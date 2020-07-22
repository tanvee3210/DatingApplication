import { Component } from '@angular/core';
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';
import { Platform, ToastController } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { Router } from "@angular/router";
import { APIService } from './page/provider/api-service';
declare var cordova;

//import { Zoom } from '@ionic-native/zoom/ngx';
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {
  constructor(
    private platform: Platform,
    private router: Router,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private androidPermissions: AndroidPermissions,
    private toastCtrl: ToastController,
    public api_service: APIService
  ) {
    this.initializeApp();
  }

  allowCameraPermission(){
    return this.androidPermissions.requestPermissions([this.androidPermissions.PERMISSION.CAMERA, this.androidPermissions.PERMISSION.WRITE_EXTERNAL_STORAGE
      , this.androidPermissions.PERMISSION.ACCESS_COARSE_LOCATION, this.androidPermissions.PERMISSION.ACCESS_FINE_LOCATION,
    this.androidPermissions.PERMISSION.RECORD_AUDIO, this.androidPermissions.PERMISSION.READ_PHONE_STATE
    ])
  };

  initializeApp() {


    this.platform.ready().then(() => {
      //Check Camera Permission
      const promise1 = new Promise((resolve, reject) => {
        this.androidPermissions.checkPermission(this.androidPermissions.PERMISSION.CAMERA).then(
          async result => {
            //console.log('Has permission?', result.hasPermission);
            if(result.hasPermission){
              //console.log('Camera allowed');
              resolve();
            }else{
              await this.allowCameraPermission();
              resolve();
            }
          }
        );
      });

      Promise.all([promise1]).then((values) => {
        const promise2 = new Promise((resolve, reject) => {
          this.androidPermissions.checkPermission(this.androidPermissions.PERMISSION.WRITE_EXTERNAL_STORAGE).then(
            async result2 => {
              //console.log('Has permission?', result2.hasPermission);
              if(result2.hasPermission){
                //console.log('WRITE_EXTERNAL_STORAGE allowed');
                resolve();
              }else{
                this.allowCameraPermission();
                //console.log('Step 2 storage allowed');
                resolve();
              }
            }
          );
        });
        
        Promise.all([promise2]).then((values) => {
          const promise3 = new Promise((resolve, reject) => {
            this.androidPermissions.checkPermission(this.androidPermissions.PERMISSION.ACCESS_COARSE_LOCATION).then(
              async result3 => {
                //console.log('Has permission?', result3.hasPermission);
                if(result3.hasPermission){
                  //console.log('ACCESS_COARSE_LOCATION allowed');
                  resolve();
                }else{
                  this.allowCameraPermission();
                  //console.log('Step 3 location allowed');
                  resolve();
                }
              }
            );
          });
          Promise.all([promise3]).then((values) => {
            const promise4 = new Promise((resolve, reject) => {
              this.androidPermissions.checkPermission(this.androidPermissions.PERMISSION.RECORD_AUDIO).then(
                async result4 => {
                  //console.log('Has permission?', result4.hasPermission);
                  if(result4.hasPermission){
                    //console.log('RECORD_AUDIO allowed');
                    resolve();
                  }else{
                    this.allowCameraPermission();
                    //console.log('Step 4 audio allowed');
                    resolve();
                  }
                }
              );
            });
            Promise.all([promise4]).then((values) => {
              const promise5 = new Promise((resolve, reject) => {
                this.androidPermissions.checkPermission(this.androidPermissions.PERMISSION.READ_PHONE_STATE).then(
                  async result5 => {
                    //console.log('Has permission?', result5.hasPermission);
                    if(result5.hasPermission){
                      //console.log('READ_PHONE_STATE allowed');
                      resolve();
                    }else{
                      this.allowCameraPermission()
                      //console.log('Step 5 READ_PHONE_STATE allowed');
                      resolve();
                    }
                  }
                );
              });

              Promise.all([promise5]).then((values) => {
                //console.log('All Permission allowed');
                this.statusBar.styleDefault();
                this.splashScreen.hide();
                this.loadUIDisplay();
                this.api_service.getLocation();
        
                if (this.user) {
                  this.router.navigateByUrl('/tabs');
                }
                else {
                  this.router.navigateByUrl('/loginpage');
                }
              });

            });
          });
        });
      });

    });
  }

  initializeAdapterIosRtc() {
    //console.log('Initializing iosrct');
    cordova.plugins.iosrtc.registerGlobals();
    // load adapter.js (version 4.0.1)
    const script2 = document.createElement('script');
    script2.type = 'text/javascript';
    script2.src = 'assets/libs/adapter-4.0.1.js';
    script2.async = false;
    document.head.appendChild(script2);
  }

  async presentToast(text) {
    const toast = await this.toastCtrl.create({
      message: text,
      duration: 3000,
      position: 'top'
    });
    toast.present();
  }

  user: any
  name: any
  session: any
  loadUIDisplay() {
    try {
      this.user = JSON.parse(localStorage.getItem("userDetails"));
      this.name = this.user;
    } catch (err) {

    }
  }
}
