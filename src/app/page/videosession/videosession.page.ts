import { Component, OnInit, HostListener, OnDestroy } from '@angular/core';
import { Platform, AlertController, ToastController } from '@ionic/angular';
import { Router } from "@angular/router";
import { Http, Response } from '@angular/http';
import { APIService } from '../provider/api-service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { UniqueDeviceID } from '@ionic-native/unique-device-id/ngx'
import { OpenVidu, Publisher, Session, StreamEvent, StreamManager, Subscriber } from 'openvidu-browser';
import { throwError as observableThrowError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';
declare var cordova;
import { map } from 'rxjs/operators';
import 'rxjs/add/operator/map';
import 'rxjs/Rx';
declare var OT: any;

@Component({
  selector: 'app-videosession',
  templateUrl: './videosession.page.html',
  styleUrls: ['./videosession.page.scss'],
})
export class VideosessionPage implements OnInit {
  OPENVIDU_SERVER_URL = 'https://' + location.hostname + ':4443';
  OPENVIDU_SERVER_SECRET = 'MY_SECRET';
  apiKey: any;
  sessionId: string;
  token: string;
  defaultUserImage: string = "https://dolphino.s3-us-west-2.amazonaws.com/be6d932c9f79f219f5d86872b2def79.png";
  ANDROID_PERMISSIONS = [
    this.androidPermissions.PERMISSION.CAMERA,
    this.androidPermissions.PERMISSION.RECORD_AUDIO,
    this.androidPermissions.PERMISSION.MODIFY_AUDIO_SETTINGS
  ];

  // OpenVidu objects
  OV: OpenVidu;
  session: Session;
  publisher: StreamManager; // Local
  subscribers: StreamManager[] = []; // Remotes
  desconnectsession: any
  userlist: any = []
  API_BASE = 'https://baabyalabs.com:3000/'
  count = 5
  startvideocall = true
  startcount = 61
  user_image: any
  user_full_name: any
  user_age: any
  mobile_number: any
  meetingPassword: any
  // Join form
  mySessionId: string;
  myUserName: string;
  receiver: any = {};
  user_id: any
  selectedIndex:any = 0;
  nextCallTimer:any=0;
  showVideoScreen :any =false;
  currentCallWaitingTime:any= 25;

  constructor(public alertCtrl: AlertController,
    public api_service: APIService,
    private http: Http,
    private platform: Platform,
    private httpClient: HttpClient,
    private androidPermissions: AndroidPermissions,
    private geolocation: Geolocation,
    private toastCtrl: ToastController,
    private router: Router
  ) {
    this.generateParticipantInfo()
    // this.apiKey = '46514492';
    this.apiKey = '46850484';
    this.api_service.videoCallRequestWaiting = true;
    this.api_service.videoCallRequestAction = 'request';
    // this.sessionId = '2_MX40NjUxNDQ5Mn5-MTU4MTkzMjMwMTcxMn5TQSt6SWZpRlhGSEU1WHRkY0Jldmwzc3V-fg';
    // this.token = 'T1==cGFydG5lcl9pZD00NjUxNDQ5MiZzaWc9OTA5ZmVlZGNmOGUyN2I0ZTc5NmIyMDRmYmFiNzBlY2ExZjNiMGIyNzpzZXNzaW9uX2lkPTJfTVg0ME5qVXhORFE1TW41LU1UVTRNVGt6TWpNd01UY3hNbjVUUVN0NlNXWnBSbGhHU0VVMVdIUmtZMEpsZG13emMzVi1mZyZjcmVhdGVfdGltZT0xNTgxOTMyMzY5Jm5vbmNlPTAuNTAxMTk2OTc5OTQ1NjMyMiZyb2xlPXB1Ymxpc2hlciZleHBpcmVfdGltZT0xNTg0NTIwNzYwJmluaXRpYWxfbGF5b3V0X2NsYXNzX2xpc3Q9';
  }


  ngOnInit() {
    this.userlist = JSON.parse(localStorage.getItem('userlist'));
    //console.log(this.userlist);
    //this.api_service.getLocation();
    this.getRandomUser2();
    //this.getRandomUser()
    this.countdown();
    
  }

  @HostListener('window:beforeunload')
  beforeunloadHandler() {
    // On window closed leave session
    this.leaveSession();
  }

  ngOnDestroy() {
    // On component destroyed leave session
    this.leaveSession();
  }

  public leaveSession() {
    // --- 7) Leave the session by calling 'disconnect' method over the Session object ---

    if (this.session) {
      this.session.disconnect();
    }

    // Empty all properties...
    this.subscribers = [];
    delete this.publisher;
    delete this.session;
    delete this.OV;
    this.generateParticipantInfo();
    //this.router.navigate(['/', 'tab3']);
  }

  currentCallChecker(){
    this.showVideoScreen = false;

    let timer1= setInterval(() => {
      this.currentCallWaitingTime =  this.currentCallWaitingTime - 1;
      console.log('currentCallWaitingTime', this.currentCallWaitingTime);
      //CASE 1
      if(this.api_service.videoCallRequestAction =='accepted'){
        console.log('Current Video Call Accepted');
        this.showVideoScreen = true;
        clearInterval(timer1);
      }

      //CASE 2
      if(this.api_service.videoCallRequestAction =='cancelled'){
        console.log('Current Video Call Cancelled');
        this.leaveSession();
        this.nextCallSchedulerTimer();
        clearInterval(timer1);
      }

      //CASE 3
      if(1 > this.currentCallWaitingTime && this.api_service.videoCallRequestWaiting){
        this.api_service.videoCallRequestWaiting = false;
        clearInterval(timer1);
        this.leaveSession();
        this.nextCallSchedulerTimer();
        console.log('Current Video Call Not Received');
      }
      //CASE 4
      if(this.api_service.videoCallRequestAction =='videocallend'){
        clearInterval(timer1);
        this.nextCallSchedulerTimer();
      }

    }, 1000);
  };

  nextCallSchedulerTimer(){
    /*this.nextCallTimer = 0;
    let timer2 = setInterval(() => {
      this.nextCallTimer =  this.nextCallTimer + 1;
      if(this.nextCallTimer == 20){
        console.log('Here Leave Current Session');
        clearInterval(timer2);
      }
    }, 20*1000);*/
    this.api_service.videoCallRequestWaiting = true;
    this.api_service.videoCallRequestAction ='pending';
    console.log('Current Call was with-'+this.api_service.selectedVideoCallUser.full_name);
    console.log('Total Length', this.userlist.length);
    this.currentCallWaitingTime = 25;
    if(this.userlist.length == 3){
      if(this.selectedIndex == 1){
        this.selectedIndex = 2;
        this.api_service.selectedVideoCallUser = this.userlist[this.selectedIndex];
        console.log('Next Call Index 2 with-'+this.api_service.selectedVideoCallUser.full_name);
        this.startvideocall = false;
        this.getRandomUser2();
        this.count = 5;
        this.countdown();
      }else if(this.selectedIndex == 0){
        this.selectedIndex = 1;
        this.api_service.selectedVideoCallUser = this.userlist[this.selectedIndex];
        console.log('Next Call Index 1 with-'+this.api_service.selectedVideoCallUser.full_name);
        this.startvideocall = false;
        this.getRandomUser2();
        this.count = 5;
        this.countdown();
      }else{
        this.router.navigateByUrl('/tabs', { replaceUrl: true });
      }
    }else if(this.userlist.length == 2){
      if(this.selectedIndex == 0){
        this.selectedIndex = 1;
        this.api_service.selectedVideoCallUser = this.userlist[this.selectedIndex];
        console.log('Next Call Index 1 with-'+this.api_service.selectedVideoCallUser.full_name);
        this.startvideocall = false;
        this.getRandomUser2();
        this.count = 5;
        this.countdown();
      }else{
        this.router.navigateByUrl('/tabs', { replaceUrl: true });
      }
    }else{
      //this.router.navigate(['/', 'tabs']);
      this.router.navigateByUrl('/tabs', { replaceUrl: true });
    }
  };

  private generateParticipantInfo() {
    // Random user nickname and sessionId
    this.mySessionId = 'SessionA';
    this.myUserName = 'Participant' + Math.floor(Math.random() * 100);
  }

  getRandomUser2(){
    this.user_image = this.userlist[this.selectedIndex].user_image ? this.userlist[this.selectedIndex].user_image : this.defaultUserImage
    this.user_full_name = this.userlist[this.selectedIndex].full_name
    this.user_age = this.userlist[this.selectedIndex].age
    this.user_id = this.userlist[this.selectedIndex]._id
  };

  //NOT USED@AJAY
  getRandomUser() {
    let defaultSettings = JSON.parse(localStorage.getItem('defaultSettings'));
    console.log('defaultSettings', defaultSettings);
    var self = this;
    let params = {
      latitude : this.api_service.loggedInuserLocations.lat,
      longitude : this.api_service.loggedInuserLocations.lng,
      distance: defaultSettings.distance,
      age: defaultSettings.age,
      _id: this.api_service.user._id,
      sexPreference: this.api_service.user.sexPreference,
      timediff: 3000//sec
    };

    self.http.post(this.API_BASE + 'user/get_user', params)
      .map((response) => response.json())
      .subscribe((data) => self.getloginuser(data),
        error => self.getusererror())
  }
  
  //NOT USED@AJAY
  async getloginuser(data:any) {
    if (data.response.data.length > 0) {
      for (var i = 0; i < data.response.data.length; i++) {
        this.user_image = data.response.data[i].user_image ? data.response.data[i].user_image : this.defaultUserImage
        this.user_full_name = data.response.data[i].full_name
        this.user_age = data.response.data[i].age
        this.user_id = data.response.data[i]._id
      }
    }
  }
  getusererror() {

  }
  async countdown() {
    console.log('here count', this.count, this.userlist);
    if (this.count > 0) {
      this.count = this.count - 1;
      this.count = this.count
      this.countdata();
    } else if (this.count == 0) {
      this.count = -1;
      this.startvideocall = false
      this.startCall()
    }
  }

  data: any


  initPublisher() {
    const publisher: Publisher = this.OV.initPublisher(undefined, {
      audioSource: undefined, // The source of audio. If undefined default microphone
      videoSource: undefined, // The source of video. If undefined default webcam
      publishAudio: true, // Whether you want to start publishing with your audio unmuted or not
      publishVideo: true, // Whether you want to start publishing with your video enabled or not
      resolution: '640x480', // The resolution of your video
      frameRate: 30, // The frame rate of your video
      insertMode: 'APPEND', // How the video is inserted in the target element 'video-container'
      mirror: true // Whether to mirror your local video or not
    });

    // --- 6) Publish your stream ---

    this.session.publish(publisher).then(() => {
      // Store our Publisher
      this.publisher = publisher;
    });
  }

  sendVideoCallPush(d: any, type: any) {
    this.data = {
      senderid: this.api_service.user._id,
      receiverid: this.api_service.selectedVideoCallUser._id,
      session: d,
      push_type: type
    }
    var param = this.data;
    this.http.post(this.API_BASE + 'chat/videocall', param)
      .map((response) => response.json())
      .subscribe((data) => {
        console.log("here session", data);
      },
        error => {
          this.texterror()
        })
  };

  startCall() {
    this.data = {
      apiKey: this.apiKey,
      senderid: this.api_service.user._id,
      receiverid: this.api_service.selectedVideoCallUser._id
    }
    var param = this.data;
    this.http.post(this.API_BASE + 'user/createSession', param)
      .map((response) => response.json())
      .subscribe((data) => {
        console.log("here session", data);
        this.api_service.videoCallSession = data;
        this.api_service.videoCallRequestWaiting = true;
        this.api_service.videoCallRequestAction = 'pending';
        this.sendVideoCallPush(data, 'videocallrequest');
        this.startvideosession(data);
        this.currentCallChecker();
      },
        error => {
          this.texterror()
        })
  }

  texterror() {

  }

  getReceiverUserData() {
    this.receiver = this.api_service.selectedVideoCallUser;
  }

  handleError(error: any) {
    if (error) {
      alert(error.message);
    }
  }

  startChat(senderid: any, receiverid: any) {
    var param = {
      'senderid': senderid,
      'receiverid': receiverid,
      'room_name': 'Nile',
      'push_type': 'videocallaccepted'
    };
    this.http.post(this.API_BASE + 'chat/videocall', param)
      .map((response) => response.json())
      .subscribe((data) => {
        console.log('Chat Started', data);
      },
        error => {
          //
        })
  }

  getSessionInfo(sessionId: any) {
    var param = { 'sessionId': sessionId };
    this.http.post(this.API_BASE + 'user/getSession', param)
      .map((response) => response.json())
      .subscribe((data) => {
        console.log('session info', data);
        if (data && data.response && data.response.users.length > 0) {
          this.startChat(data.response.users[0], data.response.users[1]);
        }
      },
        error => {
          //
        })
  }

  async startvideosession(data: any) {
    if (this.startcount > 0) {
      var self = this;
      this.startcount = this.startcount - 1;
      this.startcount = this.startcount
      this.countdata()
      var session = await OT.initSession(this.apiKey, data.sessionId);
      this.publisher = OT.initPublisher('publisher', {
        insertMode: 'append',
        width: '30%',
        height: '20%',
      }, this.handleError);
      this.session = session;

      session.on({
        streamCreated: (event: any) => {
          session.subscribe(event.stream, 'subscriber', {
            insertMode: 'append',
            width: '100%',
            height: '100%',
          }, this.handleError);
        },
        sessionConnected: (event: any) => {
          session.publish(this.publisher);
          let count22 = 0;
          let timerId = setInterval(() => {
            count22 = count22 + 1;
            //console.log('check count', count);
            if (count22 == 60) {
              count22 = 0;
              console.log('check final count', count22);
              if (session) {
                //console.log('here check before');
                //session.disconnect();
                this.leaveSession();
                if(2 > this.selectedIndex){
                  this.nextCallSchedulerTimer();
                }
                
                //console.log('here check after');
                setTimeout(() => { clearInterval(timerId); }, 1);
                // setTimeout(() => { this.startCall(); }, 1000);

              }
            }
          }, 1000);
        }
      });
      session.connect(data.token, function (error: any) {
        if (error) {
          console.log("Failed to connect: ", error.message);
          if (error.name === "OT_NOT_CONNECTED") {
            alert("You are not connected to the internet. Check your network connection.");
          }
        } else {
          console.log("Connected");
        }
      });
      session.on("connectionDestroyed", function (event: any) {
        console.log("session connectionDestroyed");
        self.getSessionInfo(data.sessionId);
      });

    } else {
      this.shownext()
    }
  }
  shownext() {
    location.reload();
  }



  countdata() {
    setTimeout(() => {
      this.countdown()
    }, 1000);
  }


  async presentToast(text:any) {
    const toast = await this.toastCtrl.create({
      message: text,
      duration: 3000,
      position: 'top'
    });
    toast.present();
  }


  private deleteSubscriber(streamManager: StreamManager): void {
    const index = this.subscribers.indexOf(streamManager, 0);
    if (index > -1) {
      this.subscribers.splice(index, 1);
    }
  }



  private checkAndroidPermissions(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.platform.ready().then(() => {
        this.androidPermissions
          .requestPermissions(this.ANDROID_PERMISSIONS)
          .then(() => {
            this.androidPermissions
              .checkPermission(this.androidPermissions.PERMISSION.CAMERA)
              .then(camera => {
                this.androidPermissions
                  .checkPermission(this.androidPermissions.PERMISSION.RECORD_AUDIO)
                  .then(audio => {
                    this.androidPermissions
                      .checkPermission(this.androidPermissions.PERMISSION.MODIFY_AUDIO_SETTINGS)
                      .then(modifyAudio => {
                        if (camera.hasPermission && audio.hasPermission && modifyAudio.hasPermission) {
                          resolve();
                        } else {
                          reject(
                            new Error(
                              'Permissions denied: ' +
                              '\n' +
                              ' CAMERA = ' +
                              camera.hasPermission +
                              '\n' +
                              ' AUDIO = ' +
                              audio.hasPermission +
                              '\n' +
                              ' AUDIO_SETTINGS = ' +
                              modifyAudio.hasPermission,
                            ),
                          );
                        }
                      })
                      .catch(err => {
                        console.error(
                          'Checking permission ' +
                          this.androidPermissions.PERMISSION.MODIFY_AUDIO_SETTINGS +
                          ' failed',
                        );
                        reject(err);
                      });
                  })
                  .catch(err => {
                    console.error(
                      'Checking permission ' + this.androidPermissions.PERMISSION.RECORD_AUDIO + ' failed',
                    );
                    reject(err);
                  });
              })
              .catch(err => {
                console.error('Checking permission ' + this.androidPermissions.PERMISSION.CAMERA + ' failed');
                reject(err);
              });
          })
          .catch(err => console.error('Error requesting permissions: ', err));
      });
    });
  }
  onExit() {
    this.router.navigate(['tabs']);
  }

}
