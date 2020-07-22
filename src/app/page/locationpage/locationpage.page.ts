import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, NavigationExtras } from "@angular/router";
declare var google, map, infoWindow;
import { Http, Response } from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/Rx';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { APIService } from '../provider/api-service';
@Component({
  selector: 'app-locationpage',
  templateUrl: './locationpage.page.html',
  styleUrls: ['./locationpage.page.scss'],
})
export class LocationpagePage implements OnInit {
  API_BASE = 'https://baabyalabs.com:3000/'
  userDetails: any;
  map: any
  address: any
  _id: any
  isnew = false
  data: any
  lat: any
  lng: any

  constructor(private router: Router,
    private http: Http,
    private geolocation: Geolocation,
    public api_service: APIService,
    public route: ActivatedRoute) {
    
    this.api_service.getLocation();
    this.userDetails = this.api_service.user;
    /*this.route.queryParams.subscribe(params => {
      if (params && params.special) {
        this.userDetails = JSON.parse(params.special);
        //console.log('gender', this.userDetails)
      }
    });*/
  }

  ngOnInit() {
    // this.initMap()
    let loginuserdata = localStorage.getItem('userDetails')
    this._id = JSON.parse(loginuserdata)
  }

  // map: any
  // address: any
  // _id: any
  // isnew = false
  // data: any
  // lat: any
  // lng: any

  // initMap() {
  //   const self =this;
  //   if(navigator.geolocation){
  //     navigator.geolocation.getCurrentPosition(function (position) {
  //       if(position){
  //         self.lat = position.coords.latitude;
  //         self.lng = position.coords.longitude;
  //       }else{
  //         self.lat = 27.6498816;
  //         self.lng = 77.2825088;
  //       }
  //     });
  //   }else{
  //     this.lat = 27.6498816;
  //     this.lng = 77.2825088;
  //   }
  
  // }


  // async gotoverificationpage() {
  //   var self = this
  //   self.geolocation.getCurrentPosition().then((resp) => {
  //     self.lat = resp.coords.latitude
  //     self.lng = resp.coords.longitude
  //     self.locationsave()
  //   }).catch((error) => {
  //     //console.log('Error getting location', error);
  //   });
  // }

  async gotoverificationpage() {
    this.locationsave();
  }

  async locationsave() {
    var self = this;
    this.api_service.user.latitude = this.api_service.loggedInuserLocations.lat;
    this.api_service.user.longitude = this.api_service.loggedInuserLocations.lng;
    this.router.navigate(['verficationpage']);
  }

  texterror() {
    //not used anywhere
  }

}
