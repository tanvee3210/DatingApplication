import { Component, OnInit } from '@angular/core';
import { Router, NavigationExtras } from "@angular/router";
import { AlertController } from '@ionic/angular';
import { FnParam } from '@angular/compiler/src/output/output_ast';
import { Facebook, FacebookLoginResponse } from '@ionic-native/facebook/ngx';
import * as firebase from 'firebase';
import { HttpClientModule } from '@angular/common/http';
import {NavController} from "@ionic/angular";
import { Http, Response } from '@angular/http';
import { APIService } from '../provider/api-service';
//import { map } from 'rxjs/operators';
import 'rxjs/add/operator/map';
import 'rxjs/Rx';
import { from } from 'rxjs';
declare var google, map, infoWindow;

@Component({
  selector: 'app-loginpage',
  templateUrl: './loginpage.page.html',
  styleUrls: ['./loginpage.page.scss'],
})
export class LoginpagePage implements OnInit {
  isLoggedIn = false;
  users: any = {};
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
  API_BASE = 'https://baabyalabs.com:3000/'
  getalldata: any;

  hideicon = true
  hideicon2 = true
  hideicon3 = true
  newuser = true
  isnew = true
  email: any
  password: any
  newemail: any
  newpassword: any
  forloginuser: any
  conformpassword: any
  lat: any
  lng: any
  map: any
  address: any
  data: any

  constructor(private router: Router,
    public alertCtrl: AlertController,
    private http: Http,
    private fb: Facebook,
    public api_service: APIService,
    public navCtrl: NavController
  ) {
    fb.getLoginStatus()
      .then(res => {
        //console.log(res.status);
        if (res.status === 'connect') {
          this.isLoggedIn = true;
        } else {
          this.isLoggedIn = false;
        }
      })
      .catch(e => console.log(e));
  }
  ngOnInit() {
    var element = document.getElementById("olduser");
    element.classList.add("add-class");
    var element = document.getElementById("newuser");
    element.classList.remove("newuser-class");
    let loginuserdata = localStorage.getItem('userDetails')
    this.getalldata = JSON.parse(loginuserdata)
  }

  // Existinguser function

  Existinguser() {
    this.newuser = true
    var element = document.getElementById("olduser");
    element.classList.add("add-class");
    var element = document.getElementById("newuser");
    element.classList.remove("newuser-class");
    var element = document.getElementById("ortext");
    element.classList.remove("ortextmargin");
  }

  async loginuser() {
    if (this.email && this.password) {
      this.forloginuser = {
        email: this.email,
        password: this.password,
      }
      var param = this.forloginuser;
      this.http.post(this.API_BASE + 'user/user_login', param)
        .map((response) => response.json())
        .subscribe((data) => this.getloginuser(data),
          error => this.getusererror())

    }
    else {
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
  }

  async getusererror() {
    const alert = await this.alertCtrl.create({
      message: "invalid password",
      buttons: [
        {
          text: "OK"
        }
      ]
    })
    await alert.present();
  }


  async getloginuser(data) {
    localStorage.setItem('userDetails', JSON.stringify(data.response));
    let defaultSettingExist = localStorage.getItem('defaultSettings');
    if (defaultSettingExist) {
      //setting already exist do nothing
    } else {
      localStorage.setItem('', JSON.stringify(this.defaultSettings));
    }
    this.api_service.user = data.response;
    this.api_service._isLoggedIn = true;
    this.navCtrl.navigateRoot('/tabs/tab2');
  }


  // new user function
  Newuser() {
    this.newuser = false
    var element = document.getElementById("newuser");
    element.classList.add("newuser-class");
    var element = document.getElementById("ortext");
    element.classList.add("ortextmargin");
    var element = document.getElementById("olduser");
    element.classList.remove("add-class");
  }


  async ValidateEmail(mail) {
    if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(mail)) {
      //if (this.newpassword.toString().length == "6") {
      if (this.newpassword === this.conformpassword) {
        this.data = {
          email: this.newemail,
          password: this.conformpassword,
        }

        /*let navigationExtras: NavigationExtras = {
          queryParams: {
            special: JSON.stringify(this.data)
          }
        };
        this.router.navigate(['userpage'], navigationExtras);*/

        this.api_service.user.email = this.newemail;
        this.api_service.user.is_new = true;
        this.api_service.user.password = this.conformpassword;
        this.router.navigate(['userpage']);


      }
      else {
        const alert = await this.alertCtrl.create({
          message: "Both password are not same.",
          buttons: [
            {
              text: "OK"
            }
          ]
        })
        await alert.present();
      }

      // else {
      //   const alert = await this.alertCtrl.create({
      //     message: "Password at least minimum 6 characters",
      //     buttons: [
      //       {
      //         text: "OK"
      //       }
      //     ]
      //   })
      //   await alert.present();
      // }
    } else {
      const alert = await this.alertCtrl.create({
        message: "please enter valid gmail address",
        buttons: [
          {
            text: "OK"
          }
        ]
      })
      await alert.present();
    }
  }

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



  async gotouserpage() {
    if (this.newemail && this.newpassword && this.conformpassword) {
      this.ValidateEmail(this.newemail)
    } else {
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
  }


  gotoforgotpage() {
    this.router.navigate(['/', 'forgotpage'])
  }
  inputpassword = 'password'
  inputpassword1 = 'password'
  inputpassword2 = 'password'

  showicon(data) {
    if (data == "1") {
      this.hideicon = false
      this.inputpassword = 'text'
    } else if (data == "2") {
      this.hideicon2 = false
      this.inputpassword1 = 'text'
    } else if (data == "3") {
      this.hideicon3 = false
      this.inputpassword2 = 'text'
    }
  }

  // social login 

  sociallogin: any
  // facebooklogin() {
  //   this.fb.login(['public_profile', 'user_friends', 'email']).then((res) => {
  //     let Credential = firebase.auth.FacebookAuthProvider.credential(res.authResponse.accessToken)
  //     firebase.auth().signInWithCredential(Credential).then((info) => {
  //       this.sociallogin = info.user;
  //       this.data = {
  //         email: this.sociallogin.email,
  //         user_uid: this.sociallogin.uid,
  //         full_name: this.sociallogin.displayName,
  //         user_image: this.sociallogin.photoURL,
  //         is_new: this.isnew,
  //         latitude: "0",
  //         longitude: "0"
  //       }
  //       var param = this.data;
  //       this.http.post(this.API_BASE + 'user/social_login', param)
  //         .map((response) => response.json())
  //         .subscribe((data) => this.socialloginuser(data),
  //           error => {
  //             this.texterror()
  //           })
  //     }, error => {
  //       alert("dkhdfjfhujdkd dfjdhfdfj fksdfsdfkj")
  //     })
  //   })
  // }

  facebooklogin() {
    this.fb.login(['public_profile', 'user_friends', 'email'])
      .then(res => {
        if (res.status === 'connected') {
          this.isLoggedIn = true;
          this.getUserDetail(res.authResponse.userID);
        } else {
          this.isLoggedIn = false;
        }
      })
      .catch(e => console.log('Error logging into Facebook', e));
  }

  testingFB() {
    let param = {
      id: "1527106540790389",
      full_name: "Tanu Singh",
      user_image: "https://platform-lookaside.fbsbx.com/platform/profilepic/?asid=1527106540790389&height=50&width=50&ext=1591008026&hash=AeReYflRH-mhc5Bk",
      is_new: true,
      latitude: "0",
      longitude: "0",
      email: "tanveesingh111@gmail.com",
      user_uid: "1527106540790389",
      name: "Tanu Singh"
    }
    //console.log("here 1", param);
    this.http.post(this.API_BASE + 'user/social_login', param)
      .map((response) => response.json())
      .subscribe((data2) => {
        debugger
        //console.log("here dkj", data2);
        this.api_service.user = data2.response;
        this.api_service.user.is_new = false;
        //localStorage.setItem('userDetails', JSON.stringify(data2.response));
        let defaultSettingExist = localStorage.getItem('defaultSettings');
        if (defaultSettingExist) {
          //setting already exist do nothing
        } else {
          localStorage.setItem('defaultSettings', JSON.stringify(this.defaultSettings));
        }
        this.api_service.user = data2.response;
        if (data2.response.sex && data2.response.sex != "") {
          this.api_service._isLoggedIn = true;
          this.navCtrl.navigateRoot('/tabs/tab2');

        } else {
          this.router.navigate(['/', 'gender'])
        }
      },
        (error: any) => {
          console.log("err", error);
          this.texterror()
        });
  }

  getUserDetail(userid: any) {
    this.fb.api('/' + userid + '/?fields=id,email,name,picture', ['public_profile'])
      .then(res => {
        console.log(res);
        var param = {
          email: res.email,
          user_uid: res.id,
          full_name: res.name,
          user_image: "",
          is_new: true,
          latitude: 27.6498816,
          longitude: 77.2825088,
        };
        if (res && res.picture && res.picture.data.url) {
          param.user_image = res.picture.data.url;
        };

        this.users = param;
        this.http.post(this.API_BASE + 'user/social_login', param)
          .map((response) => response.json())
          .subscribe((data2) => {
            localStorage.setItem('userDetails', JSON.stringify(param));
            let defaultSettingExist = localStorage.getItem('defaultSettings');
            if (defaultSettingExist) {
              //setting already exist do nothing
            } else {
              localStorage.setItem('defaultSettings', JSON.stringify(this.defaultSettings));
            }
            this.api_service.user = data2.response;
            this.api_service.user.is_new = false;

            this.api_service.user = data2.response;
            //console.log("here data 2", data2);
            if (data2.response.sex && data2.response.sex != "" && data2.age && data2.age != "") {
              //this.api_service._isLoggedIn = true;
              this.navCtrl.navigateRoot('/tabs/tab2');
            } else {
              this.router.navigate(['/', 'userpage'])
            }
          },
            error => {
              this.texterror()
            });
      })
      .catch(e => {
        console.log(e);
      });
  }

  socialloginuser(data) {
    //localStorage.setItem('userDetails', JSON.stringify(data.response._id));
    if (data.response.is_mobile_verify == 1) {
      this.navCtrl.navigateRoot('/tabs/tab2');
    } else {
      this.router.navigate(['/', 'gender'])
    }

  }


  againhideicon(data) {
    if (data == '1') {
      this.hideicon = true
      this.inputpassword = 'password'
    } else if (data == "2") {
      this.hideicon2 = true
      this.inputpassword1 = 'password'
    } else if (data == "3") {
      this.hideicon3 = true
      this.inputpassword2 = 'password'
    }
  }
}
