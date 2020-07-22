import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { StartvideosessionPageRoutingModule } from './startvideosession-routing.module';

import { StartvideosessionPage } from './startvideosession.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    StartvideosessionPageRoutingModule
  ],
  declarations: [StartvideosessionPage]
})
export class StartvideosessionPageModule {}
