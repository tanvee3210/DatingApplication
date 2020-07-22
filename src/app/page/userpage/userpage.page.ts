import { Component, OnInit, NgZone } from '@angular/core';
import { Router, ActivatedRoute, NavigationExtras } from "@angular/router";
//import { APIService } from '../provider/api-service';
import { AlertController } from '@ionic/angular';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { APIService } from '../provider/api-service';
import { HttpClientModule } from '@angular/common/http';
import { Http, Response } from '@angular/http';
import { map } from 'rxjs/operators';
import 'rxjs/add/operator/map';
import 'rxjs/Rx';
import { ThrowStmt } from '@angular/compiler';
import { async } from '@angular/core/testing';
declare var AWS;


@Component({
  selector: 'app-userpage',
  templateUrl: './userpage.page.html',
  styleUrls: ['./userpage.page.scss'],
})
export class UserpagePage implements OnInit {
  API_BASE = 'https://baabyalabs.com:3000/';
  selectgender: any
  selectprefer: any
  showselectgender = true
  showname = true
  isnew = false
  username: any
  _id: any
  img: any
  userage: any = 18;
  imgToUpload: any;
  currentImage: any
  getcurrentImage: any
  data: any
  userDetails: any

  constructor(private router: Router, public alertCtrl: AlertController, public api_service: APIService, private _ngZone: NgZone, private http: Http, private camera: Camera, public route: ActivatedRoute) {
    /*this.route.queryParams.subscribe(params => {
      if (params && params.special) {
        this.userDetails = JSON.parse(params.special);
        //console.log('userDetails', this.userDetails)
      }
    });*/
    this.userDetails = this.api_service.user;
    this.username = this.api_service.user.full_name;
  }


  ngOnInit() {

    // let loginuserdata = localStorage.getItem('userDetails')
    // this._id = JSON.parse(loginuserdata)
  }


  generateUUID() {

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
    await this.api_service.showLoader();
    return new Promise(async (resolve) => {
      var blob: any = this.b64toBlob(imgToUpload);
      blob.lastModifiedDate = new Date();
      blob.name = this.generateUUID() + ".png";
      var photoKey = blob.name;
      photoKey = photoKey;
      var self = this;
      self.getAWSObj().upload({
        Key: photoKey,
        Body: blob,
        ACL: 'public-read'
      }, async function (err, data) {
        if (err) {
          resolve({ issuccess: false, image: null })
        } else {
          self.currentImage = data.Location;
          //this.api_service.user.user_image = data.location;
          self.loaderhide();
          self.img = data.Location;
          //this.api_service.updateUserDetails(this.api_service.user._id, { user_image: data.location });
          resolve({ issuccess: true, image: data.Location })
        }
      });
    })
  }

  async loaderhide() {
    await this.api_service.hideLoader();
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

  async goToNext() {
    if (this.username && this.userage) {
      /*this.data = {
        age: this.userage,
        full_name: this.username,
        // user_image: this.currentImage,
        use: this.userDetails,
      }
      let navigationExtras: NavigationExtras = {
        queryParams: {
          special: JSON.stringify(this.data)
        }
      };
      this.router.navigate(['gender'], navigationExtras);*/

      this.api_service.user.age = this.userage;
      this.api_service.user.full_name = this.username;
      // this.api_service.user.user_image = this.currentImage;
      this.router.navigate(['gender']);
    }
    else {
      const alert = await this.alertCtrl.create({
        message: "All Feilds are mandatory.",
        buttons: [
          {
            text: "OK"
          }
        ]
      })
      await alert.present();
    }
  }
  texterror() {
  }
  // go to select for gender page
  // async gotogenderpage(data) {
  //   await this.api_service.hideLoader();
  //   this.router.navigate(['/', 'gender'])
  // }
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
        targetHeight: 100
      };
      this.camera.getPicture(options).then((imageData) => {
        this.currentImage = 'data:image/jpeg;base64,' + imageData;
        this.uploadImage(this.currentImage)
        //console.log(this.currentImage)
      }, (err) => {
        // Handle error
        //console.log("Camera issue:" + err);
      });
    } else {
      const options: CameraOptions = {
        quality: 50,
        destinationType: this.camera.DestinationType.DATA_URL,
        sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
        saveToPhotoAlbum: false,
        encodingType: this.camera.EncodingType.JPEG,
        mediaType: this.camera.MediaType.PICTURE,
        allowEdit: true,
        targetHeight: 100
      };
      this.camera.getPicture(options).then((imageData) => {
        this.currentImage = 'data:image/jpeg;base64,' + imageData;
        this.uploadImage(this.currentImage)
        //console.log(this.currentImage)
      }, (err) => {
        // Handle error
        //console.log("Camera issue:" + err);
      });
    };
  }
}