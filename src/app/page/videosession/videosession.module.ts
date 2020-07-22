import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { VideosessionPageRoutingModule } from './videosession-routing.module';

import { VideosessionPage } from './videosession.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    VideosessionPageRoutingModule
  ],
  declarations: [VideosessionPage]
})
export class VideosessionPageModule { }
