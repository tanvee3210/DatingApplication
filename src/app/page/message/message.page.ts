import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router } from "@angular/router";
import { Http, Response } from '@angular/http';
import { APIService } from '../provider/api-service';
import { AlertController, IonContent } from '@ionic/angular';
import 'rxjs/add/operator/map';
import 'rxjs/Rx';
import { networkInterfaces } from 'os';
import { O_NOFOLLOW } from 'constants';

@Component({
  selector: 'app-message',
  templateUrl: './message.page.html',
  styleUrls: ['./message.page.scss'],
})
export class MessagePage implements OnInit {
  @ViewChild(IonContent, { read: IonContent, static: false }) myContent: IonContent;

  API_BASE = 'https://baabyalabs.com:3000/'
  chatlist: any = [];
  userlist: any = [];
  receiver: any;
  sender: any;
  isValidMessage: boolean = false;
  noMoreData: boolean = false;
  message: string = "";
  proceedToSendMessage: any;
 
  constructor(private router: Router, private http: Http, public api_service: APIService, public alertCtrl: AlertController) {
    //this.chatlist = this.api_service.selectedUserChatlist;
    this.receiver = this.api_service.chatUserList[this.api_service.selectedUserIndex];
    this.sender = this.api_service.user;
    this.api_service.chatUserList[this.api_service.selectedUserIndex].unreadcount = 0;
  }

  ngOnInit() {
    this.getChatlist(this.api_service.user._id, this.receiver._id);
    this.readChatlist(this.api_service.user._id, this.receiver._id);
    this.deDectChatScroll();
    this.proceedToSendMessage = setInterval(() => {
      if (this.message.trim() != "") {
        this.isValidMessage = true;
      }
    }, 1000);

    //Push Manager 
    /*const options: PushOptions = {
      android: {},
      ios: { alert: 'true', badge: true, sound: 'false' },
      windows: {},
      browser: { pushServiceURL: 'http://push.api.phonegap.com/v1/push' }
    }
    let pushObject = this.push.init(options);
    pushObject.on('notification').subscribe((notification: any) => {
      if (notification.additionalData.type == "chat") {
        if (notification.additionalData.dataObj.senderid == this.receiver._id) {
          this.chatlist.push(notification.additionalData.dataObj);
          this.api_service.selectedUserChatlist = this.chatlist;
          //here update unread count zero
          //console.log('here not2', notification.additionalData.dataObj);
          if (this.router['routerState'].snapshot.url == "/message") {
            this.readChatlist(this.api_service.user._id, this.receiver._id);
            this.api_service.chatUserList[this.api_service.selectedUserIndex].unreadcount = 0;
            this.api_service.chatUserList[this.api_service.selectedUserIndex].lastchat.message = notification.additionalData.dataObj.message;
            this.api_service.chatUserList[this.api_service.selectedUserIndex].lastchat.datetime = notification.additionalData.dataObj.datetime;
            this.api_service.updateUserList(this.api_service.chatUserList, notification.additionalData.dataObj.senderid);
            //console.log('User list 2', this.api_service.chatUserList);
          }

          this.ScrollToBottom();
          this.ScrollToBottom();
        } else {
          //here manage 
        }
      } else {
        //here other push type
      }
  });*/
  }

  getChatlist(senderid: any, receiverid: any) {
    //here code
    let param = { 'senderid': senderid, 'receiverid': receiverid };
    //console.log("param", param);
    this.http.post(this.API_BASE + 'chat/messages', param)
      .map((response) => response.json())
      .subscribe((c) => {
        this.api_service.selectedUserChatlist = c.response.data;
        //this.chatlist = this.api_service.selectedUserChatlist;
        if (this.api_service.selectedUserChatlist > 19) {
          this.noMoreData = true;
        }
        this.ScrollToBottom();
        this.ScrollToBottom();
      },
        error => {
          console.log(error);
        })
  }

  loadMore() {
    //here code
    //console.log('load more');
    let param = {
      'senderid': this.api_service.user._id,
      'receiverid': this.receiver._id,
      'limit': 20,
      'datetime': this.api_service.selectedUserChatlist[0].datetime
    };
    this.http.post(this.API_BASE + 'chat/messages', param)
      .map((response) => response.json())
      .subscribe((c) => {
        if (c.response.data && c.response.data.length > 0) {
          let newlist = c.response.data;
          //console.log('old list', this.api_service.selectedUserChatlist);
          this.api_service.selectedUserChatlist.forEach(function (cm: any) {
            newlist.push(cm);
          });
          setTimeout(() => {
            this.api_service.selectedUserChatlist = newlist;
            this.chatlist = this.api_service.selectedUserChatlist;
            //console.log("final list", this.chatlist);
          }, 500);
        } else {
          this.noMoreData = true;
        }
        //console.log('load more 2');
      },
        error => {
          console.log(error);
        })
  }

  readChatlist(senderid: any, receiverid: any) {
    let param = { 'senderid': senderid, 'receiverid': receiverid };
    this.http.post(this.API_BASE + 'chat/messages/read', param)
      .map((response) => response.json())
      .subscribe((c) => {
        console.log(c);
      },
        error => {
          console.log(error);
        })
  }


  sendMessage() {
    if (this.message.trim() != "") {
      let param = {
        'senderid': this.api_service.user._id,
        'receiverid': this.receiver._id,
        'message_type': 'text',
        'message': this.message,
        'datetime': new Date()
      };
      this.message = "";
      this.isValidMessage = false;
      this.http.post(this.API_BASE + 'chat', param)
        .map((response) => response.json())
        .subscribe((c: any) => {
          this.api_service.selectedUserChatlist.push(c.response.data);
          this.myContent.scrollToBottom();
          this.api_service.chatUserList[this.api_service.selectedUserIndex].unreadcount = 0;
          this.api_service.chatUserList[this.api_service.selectedUserIndex].lastchat.message = c.response.data.message;
          this.api_service.chatUserList[this.api_service.selectedUserIndex].lastchat.datetime = c.response.data.datetime;
          this.api_service.updateUserList(this.api_service.chatUserList, this.receiver._id);
          this.ScrollToBottom();
        },
          error => {
            console.log(error);
          })
    }
  }

  toJSON(d: any) {
    return JSON.parse(d);
  }
  isSender(senderid: any) {
    if (this.sender._id == senderid) {
      return true;
    } else {
      return false;
    }
  }

  timeSince(date: any) {
    let checkDateTime: any = new Date(date);
    var seconds = Math.floor(((new Date().getTime() / 1000) - (checkDateTime.getTime() / 1000))),
      interval = Math.floor(seconds / 31536000);

    if (interval > 1) return interval + "y";

    interval = Math.floor(seconds / 2592000);
    if (interval > 1) return interval + "m";

    interval = Math.floor(seconds / 86400);
    if (interval >= 1) return interval + "d";

    interval = Math.floor(seconds / 3600);
    if (interval >= 1) return interval + "h";

    interval = Math.floor(seconds / 60);
    if (interval >= 1) return interval + "m ";

    return Math.floor(seconds) + "s";
  }

  deDectChatScroll() {
    setInterval(() => {
      if (this.api_service.chatScrollToBottom == true) {
        this.ScrollToBottom();
      }
    }, 500);
  };

  ScrollToBottom() {
    setTimeout(() => {
      this.myContent.scrollToBottom(300);
    }, 500);
  }
}
