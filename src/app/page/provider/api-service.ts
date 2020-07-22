import { Injectable } from '@angular/core';
import { Router } from "@angular/router";
import { HttpClient } from '@angular/common/http';
import { Http, Response } from '@angular/http';
import { ToastController, LoadingController, AlertController } from '@ionic/angular';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';
import { Platform } from '@ionic/angular';
import { map } from 'rxjs/operators';
import 'rxjs/add/operator/map';
import 'rxjs/Rx';

@Injectable()

export class APIService {

  _isMobileDevice = true;
  _isLoggedIn = false;
  user: any = {};
  API_BASE = 'https://baabyalabs.com:3000/';
  chatUserList: any = [];
  selectedUserChatlist: any = [];
  selectedUserIndex: any;
  pushObject: any;
  isTokenGenerated: boolean = false;
  chatScrollToBottom: boolean = false;
  loggedInuserLocations: any = { lat: 22.7777, lng: 78.783638 };
  loggedInuserLocations2: any = { lat: 0, lng: 0 };
  selectedVideoCallUser: any = {};
  videoCallPushReceived: any = null;
  videoCallSession: any = null;
  loader:any = null;
  videoCallRequestWaiting:any = true;
  videoCallRequestAction:any = 'request';
  nextCallStart :any=false;

  constructor(public platform:Platform, private androidPermissions: AndroidPermissions, public alertController: AlertController, 
    private geolocation: Geolocation, private router: Router, public http: HttpClient, public loadingCtrl: LoadingController, private toastCtrl: ToastController) {
    let myuser = JSON.parse(localStorage.getItem('userDetails'));
    if (myuser) {
      this.user = myuser;
    } else {
      this.user = {};
    }
    this.updateOnlineStatus();
    //this.getLocation();
  }

  isMobileDevice() {
    return this._isMobileDevice;
  }

  getLocation(){
    let self = this;
    this.androidPermissions.checkPermission(this.androidPermissions.PERMISSION.ACCESS_COARSE_LOCATION).then(
      async result3 => {
        //console.log('Has Location permission?', result3.hasPermission);
        if(result3.hasPermission){
          this.geolocation.getCurrentPosition().then((resp) => {
            // resp.coords.latitude
            // resp.coords.longitude
            if(resp){
              self.loggedInuserLocations.lat = resp.coords.latitude;
              self.loggedInuserLocations.lng = resp.coords.longitude;
              self.loggedInuserLocations2.lat = resp.coords.latitude;
              self.loggedInuserLocations2.lng = resp.coords.longitude;
            }
            //console.log('A location 1', resp);
      
           }).catch((error) => {
             //console.log('Error getting location', error);
           });
           
           let watch = this.geolocation.watchPosition();
           watch.subscribe((data) => {
            // data can be a set of coordinates, or an error (if an error occurred).
            // data.coords.latitude
            // data.coords.longitude
            //console.log('A location 2', data);
            if(data && data.coords && data.coords.latitude){
              self.loggedInuserLocations.lat = data.coords.latitude;
              self.loggedInuserLocations.lng = data.coords.longitude;
              self.loggedInuserLocations2.lat = data.coords.latitude;
              self.loggedInuserLocations2.lng = data.coords.longitude;
            }
           });
        }else{
          this.androidPermissions.requestPermissions([this.androidPermissions.PERMISSION.ACCESS_COARSE_LOCATION])
        }
      }
    );
  };

  sendVideoCallPush(senderid: any, receiverid: any, type: any) {
    var param = {
      'senderid': senderid,
      'receiverid': receiverid,
      'session': this.videoCallSession,
      'push_type': type
    };
    this.http.post(this.API_BASE + 'chat/videocall', param)
      .map((response: any) => response.json())
      .subscribe((data) => {
        console.log('Video Call Push Send', data);
      },
        error => {
          //
        })
  }

  managePushData(notification: any) {
    if (notification.additionalData.type == "chat") {
      console.log('here push 1', notification.additionalData.dataObj);
      if (notification.additionalData.dataObj.senderid == this.chatUserList[this.selectedUserIndex]._id) {
        this.selectedUserChatlist.push(notification.additionalData.dataObj);
        this.chatUserList[this.selectedUserIndex].unreadcount = 0;
        this.chatUserList[this.selectedUserIndex].lastchat.message = notification.additionalData.dataObj.message;
        this.chatUserList[this.selectedUserIndex].lastchat.datetime = notification.additionalData.dataObj.datetime;
        this.updateUserList(this.chatUserList, notification.additionalData.dataObj.senderid);
      } else {
        let userObj1 = this.chatUserList.find((x: any) =>
          x.lastchat.senderid == notification.additionalData.dataObj.senderid &&
          x.lastchat.receiverid == notification.additionalData.dataObj.receiverid
        );
        let userObj2 = this.chatUserList.find((x: any) =>
          x.lastchat.receiverid == notification.additionalData.dataObj.senderid &&
          x.lastchat.senderid == notification.additionalData.dataObj.receiverid
        );
        //console.log('obj1', userObj1);
        //console.log('obj2', userObj2);

        if (userObj1 || userObj2) {
          let userObj = userObj2 ? userObj2 : userObj1;
          let index = this.chatUserList.indexOf(userObj);
          //console.log(userObj, index, this.chatUserList[index]);
          this.chatUserList[index].unreadcount = this.chatUserList[index].unreadcount + 1;
          this.chatUserList[index].lastchat.message = notification.additionalData.dataObj.message;
          this.chatUserList[index].lastchat.datetime = notification.additionalData.dataObj.datetime;
          this.updateUserList(this.chatUserList, notification.additionalData.dataObj.senderid);
        }
      }
    } else {
      if (notification.additionalData.type == "videocallrequest") {
        this.videoCallPushReceived = notification.additionalData.dataObj;
        this.videoCallSession = notification.additionalData.dataObj.session;

        this.showConfirmationBox(notification.additionalData.dataObj.message, notification.additionalData.dataObj.session);
      }
      if (notification.additionalData.type == "videocallcancelled") {
        this.videoCallPushReceived = notification.additionalData.dataObj;
        this.videoCallSession = notification.additionalData.dataObj.session;
        
        this.videoCallRequestWaiting = false;
        this.videoCallRequestAction = 'cancelled';
        this.nextCallStart = true;

        this.showAlert(this.videoCallSession.users[1], this.videoCallSession.users[0], 'videocallcancelled', notification.additionalData.dataObj.message);
      }
      if (notification.additionalData.type == "videocallaccepted") {
        this.videoCallPushReceived = notification.additionalData.dataObj;
        this.videoCallSession = notification.additionalData.dataObj.session;
        
        this.videoCallRequestWaiting = false;
        this.videoCallRequestAction = 'accepted';

        //this.showAlert(this.videoCallSession.users[1], this.videoCallSession.users[0], 'videocallaccepted', notification.additionalData.dataObj.message);
      }
      if (notification.additionalData.type == "videocallend") {
        //console.log('here need to redirect on chat page ', 'videocallend');
        this.videoCallPushReceived = {};
        this.nextCallStart = true; 
        this.videoCallRequestWaiting = false;
        this.videoCallRequestAction = 'videocallend';
        this.videoCallSession = {};
        this.router.navigate(['/', 'tab3']);
      }

    }
  };

  updateUserList(list1: any, receiverid: any) {
    let list = list1.sort((userA, userB) => {
      let d1: any = new Date(userA.lastchat.datetime);
      let d2: any = new Date(userB.lastchat.datetime);
      return d2 - d1;
    });
    let userObj1 = list.find((x: any) => x.lastchat.senderid == receiverid);
    let userObj2 = list.find((x: any) => x.lastchat.receiverid == receiverid);
    if (userObj1 || userObj2) {
      let userObj = userObj1 ? userObj1 : userObj2;
      this.selectedUserIndex = list.indexOf(userObj);
      this.chatUserList = list;
      //console.log('ReOrder', this.chatUserList);
    }
    this.chatScrollToBottom = true;
    setTimeout(() => {
      this.chatScrollToBottom = false;
    }, 2000);
  };

  async showLoader() {
    this.loader = await this.loadingCtrl.create({
      message: "Please wait..."
    });
    this.loader.present();
  }

  async toaster(msg:any) {
    const toast = await this.toastCtrl.create({
      message: msg,
      duration: 2000,
      position: "bottom"
    });
    toast.present();
  }

  async hideLoader() {
    if(this.loader){
      await this.loader.dismiss();
    }
  }

  async showAlert(senderid: any, receiverid: any, type: any, msg: any) {
    //this.sendVideoCallPush(senderid, receiverid, type);
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Alert',
      subHeader: 'Subtitle',
      message: msg,
      buttons: ['OK']
    });
    await alert.present();
    if (type = "videocallcancelled") {
      /*setTimeout(() => {
        this.router.navigate(['/', 'tabs'])
      }, 3 * 1000);*/
    }
    if (type = "videocallaccepted") {
      setTimeout(() => {
        this.router.navigate(['/', 'tab3'])
      }, 3 * 1000);
    }
  }

  getSenderInfo(senderid: any) {
    let params = {
      _id: senderid
    };

    this.http.post(this.API_BASE + 'user/user_details', params)
      .map((response: any) => response.json())
      .subscribe((data) => {
        this.selectedVideoCallUser = data.response;
        //console.log("Sender Info !", data);
      },
        error => {
          //
        })
  }

  async showConfirmationBox(msg: any, data: any) {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Confirm!',
      message: msg,
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            this.sendVideoCallPush(this.videoCallSession.users[1], this.videoCallSession.users[0], 'videocallcancelled');
            console.log('Confirm Cancel: blah');
          }
        }, {
          text: 'Start Call',
          handler: async () => {
            console.log('Confirm Okay', this.videoCallSession);
            this.sendVideoCallPush(this.videoCallSession.users[1], this.videoCallSession.users[0], 'videocallaccepted');
            
            this.getSenderInfo(this.videoCallSession.users[0]);
            this.router.navigate(['/', 'videosession2'])
            //here navigate to videosession page
          }
        }
      ]
    });

    await alert.present();
  }

  async updateUserDetails(_id: any, userObj: any) {
    if (Object.keys(this.user).length > 0 && this.user.hasOwnProperty('_id')) {
      userObj.is_new = false;
      userObj.user_uid = _id;
      userObj._id = _id;
      //console.log('here 1', this.user);
      this.http.post(this.API_BASE + 'user/userSignup', userObj)
        .subscribe((data: any) => {
          ////console.log("Online Stattus Updated");
        },
          (error: any) => {
            ////console.log(error);
          })
    } else {
      //console.log('user not found');
    }
  }
  getCurrentDateTime() {
    let d = new Date();
    let dformat: any = [d.getFullYear(), (d.getMonth() + 1), d.getDate()].join('-') + ' ' +
      [d.getHours(), d.getMinutes(), d.getSeconds()].join(':');
    dformat = d.toISOString();
    //let dformat2 = "2020-04-26T11:27:12.798Z";
    ////console.log(dformat);
    return dformat;
  }

  async updateOnlineStatus() {
    setInterval(() => {
      let currentDateTime = this.getCurrentDateTime();
      let userObj: any = {
        last_active_time: currentDateTime,
      };
      if (this.loggedInuserLocations2.lat > 0) {
        userObj.latitude = this.loggedInuserLocations2.lat;
        userObj.longitude = this.loggedInuserLocations2.lng;
        this.loggedInuserLocations.lat = this.loggedInuserLocations2.lat;
        this.loggedInuserLocations.lng = this.loggedInuserLocations2.lng;
      }
      this.updateUserDetails(this.user._id, userObj);
    }, 15 * 1000);
  };

}