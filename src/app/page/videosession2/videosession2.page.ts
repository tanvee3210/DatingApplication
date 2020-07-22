import { Component, OnInit, HostListener, OnDestroy } from '@angular/core';
import { Platform, AlertController, ToastController } from '@ionic/angular';
import { Router } from "@angular/router";
import { Http, Response } from '@angular/http';
import { APIService } from '../provider/api-service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { OpenVidu, Publisher, Session, StreamEvent, StreamManager, Subscriber } from 'openvidu-browser';
import { throwError as observableThrowError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';
import { map } from 'rxjs/operators';
import 'rxjs/add/operator/map';
import 'rxjs/Rx';
declare var OT: any;

@Component({
  selector: 'app-videosession2',
  templateUrl: './videosession2.page.html',
  styleUrls: ['./videosession2.page.scss'],
})
export class Videosession2Page implements OnInit {
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
  API_BASE = 'https://baabyalabs.com:3000/';
  count = 5;
  startcount = 61

  constructor(
    public alertCtrl: AlertController,
    public api_service: APIService,
    private http: Http,
    private platform: Platform,
    private httpClient: HttpClient,
    private androidPermissions: AndroidPermissions,
    private toastCtrl: ToastController,
    private router: Router
  ) {
    this.apiKey = '46514492';
    // this.sessionId = '2_MX40NjUxNDQ5Mn5-MTU4MTkzMjMwMTcxMn5TQSt6SWZpRlhGSEU1WHRkY0Jldmwzc3V-fg';
    // this.token = 'T1==cGFydG5lcl9pZD00NjUxNDQ5MiZzaWc9OTA5ZmVlZGNmOGUyN2I0ZTc5NmIyMDRmYmFiNzBlY2ExZjNiMGIyNzpzZXNzaW9uX2lkPTJfTVg0ME5qVXhORFE1TW41LU1UVTRNVGt6TWpNd01UY3hNbjVUUVN0NlNXWnBSbGhHU0VVMVdIUmtZMEpsZG13emMzVi1mZyZjcmVhdGVfdGltZT0xNTgxOTMyMzY5Jm5vbmNlPTAuNTAxMTk2OTc5OTQ1NjMyMiZyb2xlPXB1Ymxpc2hlciZleHBpcmVfdGltZT0xNTg0NTIwNzYwJmluaXRpYWxfbGF5b3V0X2NsYXNzX2xpc3Q9';
  }

  ngOnInit() {
    this.countdown();
  }

  @HostListener('window:beforeunload')
  beforeunloadHandler() {
    // On window closed leave session
  }

  ngOnDestroy() {
    // On component destroyed leave session
  }

  async countdown() {
    if (this.count > 0) {
      this.count = this.count - 1;
      this.count = this.count
      this.countdata()
    } else if (this.count == 0) {
      this.count = -1;
      this.startvideosession(this.api_service.videoCallSession)
    }
  }
  getusererror() {

  }

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

  texterror() {

  }

  handleError(error: any) {
    if (error) {
      alert(error.message);
    }
  }

  startChat(type: any) {
    var param = {
      'senderid': this.api_service.videoCallSession.users[0],
      'receiverid': this.api_service.videoCallSession.users[1],
      'session': this.api_service.videoCallSession,
      'push_type': type
    };
    this.http.post(this.API_BASE + 'chat/videocall', param)
      .map((response) => response.json())
      .subscribe((data) => {
        //console.log('Chat Started', data);
      },
        error => {
          //
        })
  }

  getSessionInfo(sessionId: any) {
    var param = { 'sessionId': sessionId };
    //console.log('here session id', param);
    this.leaveSession();
    this.http.post(this.API_BASE + 'user/getSession', param)
      .map((response) => response.json())
      .subscribe((data) => {
        //console.log('session info', data);
        if (data && data.response && data.response.users.length > 0) {
          //this.startChat();
        }
        this.router.navigate(['/', 'tab3']);
      },
        error => {
          //
        })
  }

  public leaveSession() {
    if (this.session) {
      this.session.disconnect();
    }
    // Empty all properties...
    this.subscribers = [];
    delete this.publisher;
    delete this.session;
    delete this.OV;
  }

  async startvideosession(data: any) {
    if (this.startcount > 0) {
      var self = this;
      self.startChat("videocallstarted");
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
          /*let count = 0;
          let timerId = setInterval(() => {
            count = count + 1;
            //console.log('check count', count);
            if (count == 20) {
              count = 0;
              //console.log('check final count', count);
              if (session) {
                //console.log('here check before');
                //session.disconnect();
                this.leaveSession();
                //console.log('here check after');
                setTimeout(() => { clearInterval(timerId); }, 1);

              }
            }
          }, 1000);*/
        }
      });
      session.connect(data.token, function (error: any) {
        if (error) {
          //console.log("Failed to connect: ", error.message);
          if (error.name === "OT_NOT_CONNECTED") {
            alert("You are not connected to the internet. Check your network connection.");
          }
        } else {
          //console.log("Connected");
          //self.startChat("videocallstarted");
        }
      });
      session.on("connectionDestroyed", function (event: any) {
        //console.log("session connectionDestroyed");
        self.startChat("videocallend");
        self.getSessionInfo(data.sessionId);
      });

    }
  }

  countdata() {
    setTimeout(() => {
      this.countdown()
    }, 1000);
  }

  async presentToast(text) {
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
