import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { Http, Response } from '@angular/http';
import { APIService } from '../provider/api-service';
import { AlertController } from '@ionic/angular';
import 'rxjs/add/operator/map';
import 'rxjs/Rx';

@Component({
  selector: 'app-tab3',
  templateUrl: './tab3.page.html',
  styleUrls: ['./tab3.page.scss'],
})
export class Tab3Page implements OnInit {

  slideOpts1 = {
    initialSlide: 1,
    slidesPerView: 2,
    //speed: 900,
    // loop: true,
    spaceBetween: 0,
    autoplay: true
  };
  API_BASE = 'https://baabyalabs.com:3000/'
  userlist: any = [];
  showSlider: boolean = false;
  userlist2: any = [];

  constructor(private router: Router, private http: Http, public api_service: APIService, public alertCtrl: AlertController) {
    this.userlist = this.api_service.chatUserList;
    this.userlist2 = this.userlist;
    //this.userlist2.concat(this.userlist2);
  }



  ngOnInit() {
    this.chatlist(this.api_service.user._id);
    this.deDectChatScroll();
    this.api_service.selectedUserIndex = 0;
    this.api_service.selectedUserChatlist = [];
  };

  chatlist(userid: any) {
    //here code
    let param = { 'senderid': userid };
    //console.log("param", param);
    this.http.post(this.API_BASE + 'chat/userlist', param)
      .map((response) => response.json())
      .subscribe((d) => {
        //console.log(d);
        //this.userlist = d.response.data;
        let list1: any = d.response.data;
        let list = list1.sort((userA, userB) => {
          let d1: any = new Date(userA.lastchat.datetime);
          let d2: any = new Date(userB.lastchat.datetime);
          return d2 - d1;
        });
        this.api_service.chatUserList = list;
        this.userlist = this.api_service.chatUserList;

        this.userlist2 = this.userlist;
        this.userlist2.concat(list1);
        this.userlist2.concat(d.response.data);
        this.showSlider = true;
      },
        error => {
          ////console.log(error);
        })
  }

  toJSON(d: any) {
    return JSON.parse(d);
  }
  deDectChatScroll() {
    setInterval(() => {
      if (this.api_service.chatScrollToBottom == true) {
        this.userlist = this.api_service.chatUserList;
      }
    }, 500);
  };

  userlogin() {
    //this.router.navigate(['/', 'userprofile'])
    this.router.navigateByUrl('/userprofile', { replaceUrl: true });
  }
  chatpage() {
    //this.router.navigate(['/', 'tab3'])
    this.router.navigateByUrl('/tab3', { replaceUrl: true });
  }

  homepage() {
    //this.router.navigate(['/', 'tabs'])
    this.router.navigateByUrl('/tabs', { replaceUrl: true });
  }
  onMessage(index: any) {
    this.api_service.selectedUserIndex = index;
    this.api_service.selectedUserChatlist = [];
    //console.log(index, 'here');
    this.router.navigate(['/', 'message'])
  }

}
