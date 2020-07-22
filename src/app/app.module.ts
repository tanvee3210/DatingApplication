import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { HttpClientModule } from '@angular/common/http';
import { HTTP } from '@ionic-native/http/ngx';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpModule } from '@angular/http';
import { Device } from '@ionic-native/device/ngx';
import { Push, PushObject, PushOptions } from '@ionic-native/push/ngx';
//import { Zoom } from '@ionic-native/zoom/ngx';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { APIService } from './page/provider/api-service';
import { Facebook } from '@ionic-native/facebook/ngx';
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';
import * as firebase from 'firebase'

var firebaseConfig = {
  apiKey: "AIzaSyDDx8mD227shSq0XwAySEzuW8yq8hg7xF8",
  authDomain: "newtestingapp-78a7e.firebaseapp.com",
  databaseURL: "https://newtestingapp-78a7e.firebaseio.com",
  projectId: "newtestingapp-78a7e",
  storageBucket: "newtestingapp-78a7e.appspot.com",
  messagingSenderId: "381745503131",
  appId: "1:381745503131:web:1040a0239e3e70b7965f3e"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [BrowserModule, HttpClientModule, HttpModule, IonicModule.forRoot(), AppRoutingModule],
  providers: [
    StatusBar,
    Camera,
    Geolocation,
    SplashScreen,
    Facebook,
    AndroidPermissions,
    Device,
    Push,
    //Zoom,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    APIService,
    HTTP,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
