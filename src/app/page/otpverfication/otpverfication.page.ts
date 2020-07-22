import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, NavigationExtras } from "@angular/router";
import { AlertController } from '@ionic/angular';
import { Http, Response } from '@angular/http';
import { map } from 'rxjs/operators';
import 'rxjs/add/operator/map';
import { APIService } from '../provider/api-service';
import 'rxjs/Rx';

@Component({
  selector: 'app-otpverfication',
  templateUrl: './otpverfication.page.html',
  styleUrls: ['./otpverfication.page.scss'],
})
export class OtpverficationPage implements OnInit {
  API_BASE = 'https://baabyalabs.com:3000/'
  userDetails: any;
  newemail: any;
  newpassword: any;
  conformpassword: any;
  userage: any;
  username: any;
  Universityname: any;
  defaultSettings = {
    distance: {
      min: 0,
      max: 150000
    },
    age: {
      min: 18,
      max: 100
    }
  };

  constructor(private router: Router,
    public alertCtrl: AlertController,
    private http: Http,
    public api_service: APIService,
    public route: ActivatedRoute) {
    this.route.queryParams.subscribe(params => {
      if (params && params.special) {
        this.userDetails = JSON.parse(params.special);
        //console.log('verification', this.userDetails)
      }
    });
  }
  showverfications = true
  ngOnInit() {
  }

  async gotohomepage() {
    //console.log('check', this.userDetails);
    let currentDateTime = this.api_service.getCurrentDateTime();


    var param1 = {
      email: this.api_service.user.email,
      password: this.api_service.user.password,
      latitude: this.api_service.user.latitude,
      longitude: this.api_service.user.longitude,
      is_new: this.api_service.user.is_new
    }
    var param2 = {
      full_name: this.api_service.user.full_name,
      age: this.api_service.user.age,
      user_image: this.api_service.user.user_image,
      sex: this.api_service.user.sex,
      mobile_number: this.api_service.user.mobile_number,
      sexPreference: this.api_service.user.sexPreference,
      university_name: this.api_service.user.university_name,
      latitude: this.api_service.user.latitude,
      longitude: this.api_service.user.longitude,
      is_new: false,
      last_active_time: currentDateTime
    }

    await this.api_service.showLoader();
    if (!this.api_service.user.is_new) {
      //console.log(this.api_service.user, param2);
      this.updateUserDetails(this.api_service.user._id, param2);
    } else {
      this.http.post(this.API_BASE + 'user/userSignup', param1)
        .map((response) => response.json())
        .subscribe((data) => {
          this.api_service.user._id = data.response._id;
          this.updateUserDetails(data.response._id, param2);
        },
          error => {
            this.api_service.hideLoader();
            this.texterror()
          })
    }

  }
  async updateUserDetails(_id: any, params: any) {
    params._id = _id;
    //console.log("update", params);
    this.http.post(this.API_BASE + 'user/userSignup', params)
      .map((response) => response.json())
      .subscribe((data) =>
        this.getLoginUserDetails(_id),
        error => {
          this.texterror()
        })
  };
  async getLoginUserDetails(_id: any) {
    let params = { _id: _id };
    this.http.post(this.API_BASE + 'user/user_details', params)
      .map((response) => response.json())
      .subscribe((data) => {
        this.api_service.hideLoader();
        //console.log("here final", this.api_service.user);
        localStorage.setItem('userDetails', JSON.stringify(this.api_service.user));
        let defaultSettingExist = localStorage.getItem('defaultSettings');
        if (defaultSettingExist) {
          //setting already exist do nothing
        } else {
          localStorage.setItem('', JSON.stringify(this.defaultSettings));
        }

        this.api_service._isLoggedIn = true;
        this.router.navigate(['/', 'tabs']);
      },
        error => {
          this.texterror()
        })
  };

  async texterror() {
    const alert = await this.alertCtrl.create({
      message: "this email id is all ready register",
      buttons: [
        {
          text: "OK"
        }
      ]
    })
    await alert.present();

  }


}
