import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, NavigationExtras } from "@angular/router";
import { Http, Response } from '@angular/http';
import { map } from 'rxjs/operators';
import { APIService } from '../provider/api-service';
import 'rxjs/add/operator/map';
import 'rxjs/Rx';

@Component({
  selector: 'app-prefergender',
  templateUrl: './prefergender.page.html',
  styleUrls: ['./prefergender.page.scss'],
})
export class PrefergenderPage implements OnInit {
  API_BASE = 'https://baabyalabs.com:3000/'
  userDetails: any;
  constructor(private router: Router,
    private http: Http,
    public api_service: APIService, public route: ActivatedRoute) {
    this.route.queryParams.subscribe(params => {
      if (params && params.special) {
        this.userDetails = JSON.parse(params.special);
        //console.log('gender', this.userDetails)
      }
    });
  }
  genderprefer: any[] = [
    { name: "Male", id: "1" },
    { name: "Female", id: "2" },
    { name: "Both", id: "3" }
  ]
  selectprefer: any
  data: any
  isnew = false
  _id: any
  ngOnInit() {
    let loginuserdata = localStorage.getItem('userDetails')
    this._id = JSON.parse(loginuserdata)
  }

  async universityData(data) {
    /*this.data = {
      users: this.userDetails,
      sexPreference: data.name
    }
    let navigationExtras: NavigationExtras = {
      queryParams: {
        special: JSON.stringify(this.data)
      }
    };
    this.router.navigate(['universityname'], navigationExtras);*/
    this.api_service.user.sexPreference = data.name;
    this.router.navigate(['universityname']);

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
  //   this.router.navigate(['/', 'universityname'])
  // }

  texterror() {

  }

}
