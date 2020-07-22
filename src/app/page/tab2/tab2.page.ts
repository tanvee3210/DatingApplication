import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { Http, Response } from '@angular/http';
import { AlertController } from '@ionic/angular';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { Device } from '@ionic-native/device/ngx';
import { Push, PushObject, PushOptions } from '@ionic-native/push/ngx';
import { APIService } from '../provider/api-service';
// import { map } from 'rxjs/operators';
import 'rxjs/add/operator/map';
import 'rxjs/Rx';
declare var google, map, infoWindow;

@Component({
  selector: 'app-tab2',
  templateUrl: './tab2.page.html',
  styleUrls: ['./tab2.page.scss'],
})
export class Tab2Page implements OnInit {

  API_BASE = 'https://baabyalabs.com:3000/'
  lat: any
  lng: any
  map: any
  address: any
  currentlatlong: any
  showbutton: any
  _id: any
  find_user: any
  count: any
  sexPreference: any
  defaultSettings = {
    distance: {
      min: 0,
      max: 15000
    },
    age: {
      min: 18,
      max: 100
    }
  };

  constructor(private router: Router,
    private device: Device,
    private push: Push,
    private geolocation: Geolocation,
    private http: Http,
    public api_service: APIService,
    public alertCtrl: AlertController) {
      
    //this.getneatrbyapi();
    this.api_service.getLocation();
    this.getlatlong();
    let loginuserdata = JSON.parse(localStorage.getItem('userDetails'));
    //console.log(loginuserdata);
    this._id = loginuserdata._id;
    this.sexPreference = loginuserdata.sexPreference;
    //console.log('device', this.device);


    //here push code
    this.push.hasPermission()
      .then((res: any) => {
        if (res.isEnabled) {
          //console.log('We have permission to send push notifications');
        } else {
          //console.log('We do not have permission to send push notifications');
        }

      });
    const options: PushOptions = {
      android: {},
      ios: {
        alert: 'true',
        badge: true,
        sound: 'false'
      },
      windows: {},
      browser: {
        pushServiceURL: 'http://push.api.phonegap.com/v1/push'
      }
    }


    const pushObject: PushObject = this.push.init(options);
    if (!this.api_service.isTokenGenerated) {
      pushObject.on('registration').subscribe((registration: any) => {
        //console.log('Device registered', registration);
        let tokenData = {
          device_id: this.device.uuid,
          device_type: this.device.platform,
          device_token: registration.registrationId,
          _id: loginuserdata._id
        };
        //console.log(tokenData);
        this.api_service.isTokenGenerated = true;
        this.api_service.updateUserDetails(loginuserdata._id, tokenData);
      });
    }
    pushObject.on('notification').subscribe((notification: any) => {
      //console.log('Push Received', notification);
      this.api_service.managePushData(notification);
    });
    //console.log('here enter on home page');
  }

  ngOnInit() {
    localStorage.removeItem("totalcount");
  }

  /*async getneatrbyapi() {
    await this.api_service.showLoader();
    var self = this
    self.geolocation.getCurrentPosition().then((resp) => {
      self.lat = resp.coords.latitude
      self.lng = resp.coords.longitude
      this.getlatlong()
    }).catch((error) => {
      this.getlatlong()
      //console.log('Error getting location', error);
    });
  }*/

  async showmessage() {
    await this.api_service.hideLoader();
    const alert = await this.alertCtrl.create({
      message: "Currently no user found in your area.",
      buttons: [
        {
          text: "OK"
        }
      ]
    })
    await alert.present();
  }

  getlatlong() {
    let defaultSettingExist: any = localStorage.getItem('defaultSettings');
    defaultSettingExist = JSON.parse(defaultSettingExist);
    if (defaultSettingExist) {
      //setting already exist do nothing
    } else {
      localStorage.setItem('', JSON.stringify(this.defaultSettings));
      defaultSettingExist = this.defaultSettings;
    }

    var self = this;
    self.currentlatlong = {
      latitude : this.api_service.loggedInuserLocations.lat,
      longitude : this.api_service.loggedInuserLocations.lng,
      distance: defaultSettingExist.distance,
      age: defaultSettingExist.age,
      _id: this.api_service.user._id,
      sexPreference: this.api_service.user.sexPreference,
      timediff: 3000//sec
    }
    
    //console.log("here home", this.api_service.user);
    var param = self.currentlatlong;
    //console.log("param", param);
    self.http.post(this.API_BASE + 'user/get_location', param)
      .map((response) => response.json())
      .subscribe((data) => self.getloginuser(data),
        error => self.getusererror())
  }

  async getloginuser(data: any) {
    await this.api_service.hideLoader();
    if (data && data.response && data.response.data.length > 0) {
      this.showbutton = true
      this.find_user = data.response.data.length;
      this.count = data.response.data.length;
    } else {
      this.find_user = 0
      this.showbutton = false
    }
  }
  async getusererror() {
    await this.api_service.hideLoader();
    const alert = await this.alertCtrl.create({
      message: "All Feilds are mandatory.",
      buttons: [
        {
          text: "OK"
        }
      ]
    })
    await alert.present();

  }

  gotovideopage() {
    //this.router.navigate(['/', 'videopage'])
    this.router.navigateByUrl('/videopage', { replaceUrl: true });
  }
  userlogin() {
    //this.router.navigate(['/', 'userprofile'])
    this.router.navigateByUrl('/userprofile', { replaceUrl: true });
  }
  chatpage() {
    //this.router.navigate(['/', 'tab3'])
    this.router.navigateByUrl('/tab3', { replaceUrl: true });
  }

}
