import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, NavigationExtras } from "@angular/router";
import { AlertController } from '@ionic/angular';
import { Http, Response } from '@angular/http';
import { map } from 'rxjs/operators';
import 'rxjs/add/operator/map';
import { APIService } from '../provider/api-service';
import 'rxjs/Rx';
@Component({
  selector: 'app-verficationpage',
  templateUrl: './verficationpage.page.html',
  styleUrls: ['./verficationpage.page.scss'],
})
export class VerficationpagePage implements OnInit {
  API_BASE = 'https://baabyalabs.com:3000/'
  userDetails: any;
  constructor(private router: Router,
    public alertCtrl: AlertController,
    private http: Http,
    public api_service: APIService,
    public route: ActivatedRoute) {
    this.route.queryParams.subscribe(params => {
      if (params && params.special) {
        this.userDetails = JSON.parse(params.special);
        //console.log('gender', this.userDetails)
      }
    });
  }

  countryname = "+91"
  countryflag = "../../../assets/images/india.png"
  mobile: any
  showotpverfication = false
  showtext = false
  count = 47
  first: any
  second: any
  third: any
  fourth: any
  five: any
  six: any

  newmobilenumber: any
  country: any[] = [
    { name: "INDIA ", number: "+91", flag: "../../../assets/images/india.png" },
    { name: "U.S.", number: "+1", flag: "../../../assets/images/us.png" },
    { name: "CHINA", number: "+86", flag: "../../../assets/images/chine.png" },
    { name: "CANADA", number: "+1", flag: "../../../assets/images/canada.png" },
    { name: "MEXICO", number: "+52", flag: "../../../assets/images/mexico.png" }
  ]
  countrycode = true
  data: any
  isnew = false
  _id: any
  ngOnInit() {
    let loginuserdata = localStorage.getItem('userDetails')
    this._id = JSON.parse(loginuserdata)
  }

  selectcountry() {
    this.countrycode = false
  }

  selectcountryname(data) {
    this.countryflag = data.flag
    this.countryname = data.number
    this.countrycode = true
  }


  async gotoOTPPage() {
    if (this.mobile) {
      var mobilenumber = this.countryname + this.mobile
      this.newmobilenumber = mobilenumber
      /*this.data = {
        userVerification: this.userDetails,
        is_new: this.isnew,
        mobile_number: mobilenumber
      }
      let navigationExtras: NavigationExtras = {
        queryParams: {
          special: JSON.stringify(this.data)
        }
      };  
      this.router.navigate(['otpverfication'], navigationExtras);*/

      this.api_service.user.mobile_number = mobilenumber;
      this.router.navigate(['otpverfication']);
      // var param = this.data
      // await this.api_service.showLoader();
      // this.http.post(this.API_BASE + 'user/userSignup', param)
      //   .map((response) => response.json())
      //   .subscribe((data) => this.gotogenderpage(data),
      //     error => {
      //       this.numbertexterror()
      //     })
    } else {
      const alert = await this.alertCtrl.create({
        message: "Mobile number Feild are mandatory,For Sending OTP.",
        buttons: [
          {
            text: "OK"
          }
        ]
      })
      await alert.present();
    }
  }

  async numbertexterror() {
    await this.api_service.hideLoader();
    const alert = await this.alertCtrl.create({
      message: "This mobile number is already registered with us..",
      buttons: [
        {
          text: "OK"
        }
      ]
    })
    await alert.present();
  }


  async otpverfication() {
    if (this.first && this.second && this.third && this.fourth && this.five && this.six) {
      var optvalue = this.first.toString() + this.second + this.third + this.fourth + this.five + this.six
      this.data = {
        mobile_number: this.newmobilenumber,
        verification_code: optvalue
      }
      let navigationExtras: NavigationExtras = {
        queryParams: {
          special: JSON.stringify(this.data)
        }
      };
      this.router.navigate(['otpverfication'], navigationExtras);
      var param = this.data
      await this.api_service.showLoader();
      this.http.post(this.API_BASE + 'user/verify_otp', param)
        .map((response) => response.json())
        .subscribe((data) => this.optsubmit(data),
          error => {
            this.texterror()
          })
    } else {
      const alert = await this.alertCtrl.create({
        message: "First fill otp and then click on submit button ",
        buttons: [
          {
            text: "OK"
          }
        ]
      })
      await alert.present();
    }
  }

  async optsubmit(data) {
    await this.api_service.hideLoader();
    this.router.navigate(['/', 'otpverfication'])
  }

  async gotogenderpage(data) {
    await this.api_service.hideLoader();
    this.showotpverfication = true
    this.timer()

  }
  timer() {
    if (this.count > 0) {
      this.count = this.count - 1;
      this.count = this.count
      this.countdata()
    } else {
      this.showtext = true
    }
  }
  countdata() {
    setTimeout(() => {
      this.timer()
    }, 1000);
  }

  async texterror() {
    await this.api_service.hideLoader();
    const alert = await this.alertCtrl.create({
      message: "Please enter correct verification code.",
      buttons: [
        {
          text: "OK"
        }
      ]
    })
    await alert.present();
  };
  //nextElement: any
  moveToNext(nextElement) {
    nextElement.setFocus();
  }
}
