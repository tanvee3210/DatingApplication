import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { AlertController } from '@ionic/angular';
import { Http, Response } from '@angular/http';
import { map } from 'rxjs/operators';
import 'rxjs/add/operator/map';
import 'rxjs/Rx';
import { APIService } from '../provider/api-service';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { ThrowStmt } from '@angular/compiler';
import { async } from '@angular/core/testing';
declare var AWS;

@Component({
  selector: 'app-tab1',
  templateUrl: './tab1.page.html',
  styleUrls: ['./tab1.page.scss'],
})
export class Tab1Page implements OnInit {

  API_BASE = 'https://baabyalabs.com:3000/'
  username: any
  workingplace: any
  gender: any
  user_age: any
  user_image: any
  userage: any
  sexPreference: any
  maleImage: any = "../../../../../assets/images/02.png";
  femaleImage: any = "../../../../../assets/images/01.png";

  constructor(private router: Router,
    public alertCtrl: AlertController,
    private http: Http,
    public api_service: APIService,
    private camera: Camera) { 
      console.log('user', this.api_service.user);
    }
  toggle = true
  isshowsettingpage = true
  data: any
  img: any
  currentImage: any;
  age: any = {
    lower: 18,
    upper: 40
  };
  distance: any = 15000;//km
  selectedSexPreference: any;
  ngOnInit() {
    this.selectedSexPreference = this.api_service.user.sexPreference;
    let defaultSettings = JSON.parse(localStorage.getItem('defaultSettings'));
    if (defaultSettings) {
      this.age.lower = defaultSettings.age.min;
      this.age.upper = defaultSettings.age.max;
      this.distance = defaultSettings.distance.max;
    }

    this.user_details();
    this.setSettingData();
  }
  async updateSexPref(sf: any) {
    this.selectedSexPreference = sf;
    this.api_service.user.sexPreference = sf;
    this.api_service.user.sexPreference = sf;
    this.updateCurrentUserDetails(this.api_service.user);
  }

  async updateCurrentUserDetails(d: any) {
    localStorage.setItem('userDetails', JSON.stringify(d));
    let params = {
      _id: d._id,
      is_new: false,
      sexPreference: d.sexPreference,
      currentImage: d.currentImage
    };
    d.is_new = false;

    this.http.post(this.API_BASE + 'user/userSignup', params)
      .map((response) => response.json())
      .subscribe((data) => {
        //console.log("Updated Successfully!");
      },
        error => {
          this.texterror()
        })
  }

  generateUUID() {
    debugger
    let d = new Date().getTime();
    const uuid = "xxxxxxxxxxxxxxxyxxxxxxxxxxxxxxx".replace(/[xy]/g, function (
      c
    ) {
      const r = (d + Math.random() * 16) % 16 | 0;
      d = Math.floor(d / 16);
      return (c == 'x' ? r : (r & 0x3) | 0x8).toString(16);
    });
    return uuid;
  }

  user_details() {
    this.data = {
      _id: this.api_service.user._id,
      user_image: this.currentImage,
    }
    var param = this.data
    this.http.post(this.API_BASE + 'user/user_details', param)
      .map((response) => response.json())
      .subscribe((data) => this.gotogenderpage(data),
        error => {
          this.texterror()
        })
  }

  async gotogenderpage(data) {
    this.username = data.response.full_name
    this.user_age = data.response.age
    this.workingplace = data.response.university_name
    this.gender = data.response.sex
    this.sexPreference = data.response.sexPreference
    this.currentImage = data.response.currentImage
    if (data.response.user_image && data.response.user_image != "") {
      this.currentImage = data.response.user_image
    } else {
      if (data.response.sex.toLowerCase() == "male") {
        this.currentImage = this.maleImage;
      } else {
        this.currentImage = this.femaleImage;
      }
    }
    //console.log("this.currentImage", this.currentImage);
    this.userage = data.response.age
  }

  texterror() {

  }

  getAWSObj() {
    const albumBucketName = 'dolphino'
    const bucketRegion = 'us-west-2'
    const IdentityPoolId = 'us-west-2:ff182092-2a76-489c-9d58-45ba742d9e7d'
    AWS.config.update({
      region: 'us-west-2', //'us-west-2',
      credentials: new AWS.CognitoIdentityCredentials({
        IdentityPoolId: IdentityPoolId
      })
    });
    return new AWS.S3({
      apiVersion: '2012-10-17', //'2006-03-01',
      params: {
        Bucket: albumBucketName
      }
    });
  }

  async uploadImage(imgToUpload) {
    return new Promise(async (resolve) => {
      //this.api_service.showLoader();
      var blob: any = this.b64toBlob(imgToUpload);
      blob.lastModifiedDate = new Date();
      blob.name = this.api_service.user._id + ".png";
      var photoKey = blob.name;
      photoKey = photoKey;
      var self = this;
      //console.log("here 3");
      self.getAWSObj().upload({
        Key: photoKey,
        Body: blob,
        ACL: 'public-read'
      }, async function (err, data) {
        //this.api_service.hideLoader();
        //console.log("here 4", err, data);
        if (err) {
          //console.log("here 5", err, data);
          debugger
          resolve({ issuccess: false, image: null })
        } else {
          self.currentImage = data.Location;
          self.loaderhide();
          //this.user_details();
          //console.log("here 6", err, data);
          debugger
          //this.api_service.user.user_image = data.Location;
          //this.api_service.updateUserDetails(this.api_service.user._id, { "user_image": data.Location });
          debugger;
          self.img = data.Location
          resolve({ issuccess: true, image: data.Location })
        }
      });
    })
  }
  b64toBlob(dataURI) {
    var str = dataURI.split(",")[1]
    var byteString = atob(str);//.split(',')[1]);
    var ab = new ArrayBuffer(byteString.length);
    var ia = new Uint8Array(ab);
    for (var i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    return new Blob([ab], { type: 'image/png' });
  }


  async loaderhide() {
    await this.api_service.hideLoader();
  }


  async openCameraOption() {
    let alert = await this.alertCtrl.create({
      header: " Select Image",
      inputs: [
        {
          value: "1",
          type: "radio",
          label: "Gallery"
        },
        {
          value: "2",
          type: "radio",
          label: "Take Photo...."
        }
      ],
      buttons: [
        {
          text: "Cancel",
          role: "cancel",
          handler: data => {
            //console.log("Cancel clicked");
          }
        },
        {
          text: "Ok",
          handler: data => {
            if (data) {
              this.chooseImage(data);
            } else {
              // invalid login
              return false;
            }
          }
        }
      ]
    })
    await alert.present();
  }

  chooseImage(type) {
    var self = this;
    if (type == "2") {
      const options: CameraOptions = {
        quality: 50,
        destinationType: this.camera.DestinationType.DATA_URL,
        encodingType: this.camera.EncodingType.JPEG,
        mediaType: this.camera.MediaType.PICTURE,
        allowEdit: true,
        targetHeight: 500
      };

      this.camera.getPicture(options).then(async (imageData) => {
        this.currentImage = 'data:image/jpeg;base64,' + imageData;
        //console.log("here 1");
        let imgData: any = await this.uploadImage(this.currentImage);
        //console.log("imgData;", imgData);
        if (imgData && imgData.issuccess) {
          this.api_service.updateUserDetails(this.api_service.user._id, { "user_image": imgData.image });
          this.api_service.user.user_image = imgData.image;
        }
      }, (err) => {
        // Handle error
        //console.log("Camera issue:" + err);
      });
    } else {
      const options: CameraOptions = {
        quality: 100,
        destinationType: this.camera.DestinationType.DATA_URL,
        sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
        saveToPhotoAlbum: false,
        encodingType: this.camera.EncodingType.JPEG,
        mediaType: this.camera.MediaType.PICTURE,
        allowEdit: true,
        targetHeight: 250
      };

      this.camera.getPicture(options).then(async (imageData) => {
        this.currentImage = 'data:image/jpeg;base64,' + imageData;
        //console.log("here 2");
        let imgData: any = await this.uploadImage(this.currentImage);
        //console.log("imgData;", imgData);
        if (imgData && imgData.issuccess) {
          this.api_service.updateUserDetails(this.api_service.user._id, { "user_image": imgData.image });
          this.api_service.user.user_image = imgData.image;
        }

      }, (err) => {
        // Handle error
        //console.log("Camera issue:" + err);
      });
    }
  }


  showsettingpage() {
    this.isshowsettingpage = false
  }
  showbutton() {
    this.isshowsettingpage = true
  }
  userlogin() {
    //this.router.navigate(['/', 'userprofile'])
    this.router.navigateByUrl('/userprofile', { replaceUrl: true });
  }
  chatpage() {
    //this.router.navigate(['/', 'tab3'])
    this.router.navigateByUrl('/tab3', { replaceUrl: true });
  }

  async homepage() {
    //this.router.navigate(['/', 'tabs'])
    this.router.navigateByUrl('/tabs', { replaceUrl: true });
    this.loaderhide();
  }


  async Logout() {
    const alert = await this.alertCtrl.create({
      message: "Do you really want to logout ?",
      buttons: [
        {
          text: "YES",
          handler: data => {
            this.api_service.user = {};
            this.api_service._isLoggedIn = false;
            this.router.navigate(['/', 'loginpage'])
            localStorage.clear();
            // this.api_service.toaster('logout successfully')
          }
        },
        {
          text: "NO"
        }
      ]
    });
    await alert.present();
  }

  //here set setting values locally
  setSettingData() {
    setInterval(() => {
      let defaultSettings = {
        distance: {
          min: 0,
          max: this.distance
        },
        age: {
          min: this.age.lower,
          max: this.age.upper
        }
      };
      localStorage.setItem('defaultSettings', JSON.stringify(defaultSettings));
    }, 1000);
  }

}
