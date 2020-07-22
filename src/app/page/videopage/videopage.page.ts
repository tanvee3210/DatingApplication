import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { Http, Response } from '@angular/http';
import { map } from 'rxjs/operators';
import 'rxjs/add/operator/map';
import 'rxjs/Rx';
import { AlertController } from '@ionic/angular';
import { APIService } from '../provider/api-service';
import { Geolocation } from '@ionic-native/geolocation/ngx';
@Component({
  selector: 'app-videopage',
  templateUrl: './videopage.page.html',
  styleUrls: ['./videopage.page.scss'],
})
export class VideopagePage implements OnInit {
  searchfunction = false
  count = 10;
  getalluser = []
  currentlatlong: any
  firstuserimage: any
  thireduserimage: any
  seconduserimage: any
  totalcount = 0
  sexPreference: any;
  defaultSettings:any={
    distance: {
      min: 0,
      max: 15000
    },
    age: {
      min: 18,
      max: 100
    }
  };

  maleImage: any = "../../../../../assets/images/02.png";
  femaleImage: any = "../../../../../assets/images/01.png";
  API_BASE = 'https://baabyalabs.com:3000/';

  constructor(private router: Router,
    public alertCtrl: AlertController,
    private http: Http,
    private geolocation: Geolocation,
    public api_service: APIService) {
      this.api_service.getLocation();
  }

  ngOnInit() {
    this.sexPreference = this.api_service.user.sexPreference;
    this.getUsersList();
  }

  async getUsersList() {
    await this.api_service.showLoader();
    let defaultSettings = JSON.parse(localStorage.getItem('defaultSettings'));
    console.log("defaultSettings", defaultSettings);
    
    if(defaultSettings){
      this.defaultSettings = defaultSettings;
    }

    var self = this
    self.currentlatlong = {
      latitude: this.api_service.loggedInuserLocations.lat,
      longitude: this.api_service.loggedInuserLocations.lng,
      _id: this.api_service.user._id,
      countdata: this.totalcount,
      distance: this.defaultSettings.distance,
      age: this.defaultSettings.age,
      sexPreference: this.sexPreference,
      timediff: 3000//sec
      //sexPreference: "both"
    }
    var param = self.currentlatlong;
    //console.log("param", param);
    self.http.post(this.API_BASE + 'user/get_user', param)
      .map((response) => response.json())
      .subscribe((data) => self.getloginuser(data),
        error => self.getusererror())
  }

  async getloginuser(data:any) {
    this.getalluser = []
    await this.api_service.hideLoader();
    if (data.response.data.length > 0) {
      this.api_service.selectedVideoCallUser = data.response.data[0];
      for (var i = 0; i < data.response.data.length; i++) {
        this.getalluser.push(data.response.data[i])
        //console.log(this.getalluser)
      }
      // this.countdown()
      localStorage.setItem('userlist', JSON.stringify(this.getalluser));
      //localStorage.setItem('userlist', this.getalluser);
      if (this.getalluser.length > 0) {
        this.firstuserimage = ''
        this.seconduserimage = ''
        this.thireduserimage = ''

        //1st image
        if (this.getalluser[0].user_image && this.getalluser[0].user_image != "") {
          this.firstuserimage = this.getalluser[0].user_image
        } else {
          if (this.getalluser[0].sex.toLowerCase() == "male") {
            this.firstuserimage = this.maleImage;
          } else {
            this.firstuserimage = this.femaleImage;
          }
        }

        //2nd image
        if (this.getalluser.length > 1) {
          if (this.getalluser[1].user_image && this.getalluser[1].user_image != "") {
            this.seconduserimage = this.getalluser[1].user_image
          } else {
            if (this.getalluser[1].sex.toLowerCase() == "male") {
              this.seconduserimage = this.maleImage;
            } else {
              this.seconduserimage = this.femaleImage;
            }
          }
        }


        //3rd image
        if (this.getalluser.length > 2) {
          if (this.getalluser[2].user_image && this.getalluser[2].user_image != "") {
            this.thireduserimage = this.getalluser[2].user_image
          } else {
            if (this.getalluser[2].sex.toLowerCase() == "male") {
              this.thireduserimage = this.maleImage;
            } else {
              this.thireduserimage = this.femaleImage;
            }
          }
        }
      }
    } else {
      const alert = await this.alertCtrl.create({
        message: "No such user find out near your location ",
        buttons: [
          {
            text: "OK"
          }
        ]
      })
      await alert.present();
    }
  }

  showuserdata() {
    this.searchfunction = true
  }

  async getusererror() {
    await this.api_service.hideLoader();
    const alert = await this.alertCtrl.create({
      message: "All Feilds are mandatory.",
      buttons: [
        {
          text: "OK",
          handler: data => {
            this.router.navigate(['/', 'loginpage'])
            localStorage.clear();
            this.api_service.toaster('logout successfully')
          }
        }
      ]
    })
    await alert.present();
  }

  countdown() {
    if (this.count > 0) {
      this.count = this.count - 1;
      this.count = this.count
      this.countdata()
    } else {
      this.searchfunction = true
    }
  }

  countdata() {
    setTimeout(() => {
      this.countdown()
    }, 1000);
  }

  homepage() {
    this.router.navigate(['/', 'tabs'])
  }

  async gotovideosession() {
    //console.log('jai mata di')
    this.router.navigate(['/', 'videosession'])
  }


  findnewuser() {
    this.totalcount = this.totalcount + 1
    localStorage.setItem('totalcount', JSON.stringify(this.totalcount));
    this.searchfunction = false,
      this.getUsersList();
  }


}
