import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { OtpverficationPageRoutingModule } from './otpverfication-routing.module';

import { OtpverficationPage } from './otpverfication.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    OtpverficationPageRoutingModule
  ],
  declarations: [OtpverficationPage]
})
export class OtpverficationPageModule {}
