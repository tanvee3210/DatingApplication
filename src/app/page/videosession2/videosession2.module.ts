import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { Videosession2PageRoutingModule } from './videosession2-routing.module';

import { Videosession2Page } from './videosession2.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    Videosession2PageRoutingModule
  ],
  declarations: [Videosession2Page]
})
export class Videosession2PageModule {}
