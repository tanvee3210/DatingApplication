import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, NavigationExtras } from "@angular/router";
import { Http, Response } from '@angular/http';
import { map } from 'rxjs/operators';
import 'rxjs/add/operator/map';
import 'rxjs/Rx';
import { APIService } from '../provider/api-service';
@Component({
  selector: 'app-gender',
  templateUrl: './gender.page.html',
  styleUrls: ['./gender.page.scss'],
})
export class GenderPage implements OnInit {
  API_BASE = 'https://baabyalabs.com:3000/'
  userDetails: any;
  constructor(private router: Router,
    private http: Http,
    public api_service: APIService, public route: ActivatedRoute) {
    this.route.queryParams.subscribe(params => {
      if (params && params.special) {
        this.userDetails = JSON.parse(params.special);
        //console.log('userDetai456456456456s', this.userDetails)
      }
    });
  }


  gender: any[] = [
    { name: "Male", id: "1" },
    { name: "Female", id: "2" },
    { name: "Other", id: "3" }
  ]
  selectgender: any
  data: any
  isnew = false
  _id: any
  ngOnInit() {
    let loginuserdata = localStorage.getItem('userDetails')
    this._id = JSON.parse(loginuserdata)
  }

  async genderData(data) {
    /*this.data = {
      userInfo: this.userDetails,
      is_new: this.isnew,
      sex: data.name
    }
    let navigationExtras: NavigationExtras = {
      queryParams: {
        special: JSON.stringify(this.data)
      }
    };
    
    this.router.navigate(['prefergender'], navigationExtras);*/
    this.api_service.user.sex = data.name;
    this.router.navigate(['prefergender']);

    // var param = this.data
    // await this.api_service.showLoader();
    // this.http.post(this.API_BASE + 'user/userSignup', param)
    //   .map((response) => response.json())
    //   .subscribe((data) => this.gotogenderpage(data),
    //     error => {
    //       this.texterror()
    //     })
  }

  // async gotogenderpage(data) {
  //   await this.api_service.hideLoader();
  //   this.router.navigate(['/', 'prefergender'])
  // }

  texterror() {

  }
}
