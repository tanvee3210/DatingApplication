import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ForgotpagePageRoutingModule } from './forgotpage-routing.module';

import { ForgotpagePage } from './forgotpage.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ForgotpagePageRoutingModule
  ],
  declarations: [ForgotpagePage]
})
export class ForgotpagePageModule {}
