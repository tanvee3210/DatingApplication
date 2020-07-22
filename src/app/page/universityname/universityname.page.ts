import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, NavigationExtras } from "@angular/router";
import { AlertController } from '@ionic/angular';
import { Http, Response } from '@angular/http';
import { map } from 'rxjs/operators';
import 'rxjs/add/operator/map';
import 'rxjs/Rx';
import { APIService } from '../provider/api-service';
@Component({
  selector: 'app-universityname',
  templateUrl: './universityname.page.html',
  styleUrls: ['./universityname.page.scss'],
})
export class UniversitynamePage implements OnInit {
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
        console.log('gender', this.userDetails)
      }
    });
  }
  Universityname: any
  data: any
  isnew = false
  _id: any
  ngOnInit() {
    let loginuserdata = localStorage.getItem('userDetails')
    this._id = JSON.parse(loginuserdata)
  }


  async gotolocationpage() {
    if (this.Universityname) {
      /*this.data = {
        userwithInfo: this.userDetails,
        university_name: this.Universityname
      }
      let navigationExtras: NavigationExtras = {
        queryParams: {
          special: JSON.stringify(this.data)
        }
      };
      this.router.navigate(['locationpage'], navigationExtras);*/

      this.api_service.user.university_name = this.Universityname;
      this.router.navigate(['locationpage']);
      // var param = this.data
      // await this.api_service.showLoader();
      // this.http.post(this.API_BASE + 'user/userSignup', param)
      //   .map((response) => response.json())
      //   .subscribe((data) => this.gotogenderpage(data),
      //     error => {
      //       this.texterror()
      //     })
    }
    else {
      const alert = await this.alertCtrl.create({
        message: "University Name Feild are mandatory.",
        buttons: [
          {
            text: "OK"
          }
        ]
      })
      await alert.present();
    }
  }

  // async gotogenderpage(data) {
  //   await this.api_service.hideLoader();
  //   this.router.navigate(['/', 'locationpage'])
  // }
  texterror() {

  }
}
