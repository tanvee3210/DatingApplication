import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { VerficationpagePageRoutingModule } from './verficationpage-routing.module';

import { VerficationpagePage } from './verficationpage.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    VerficationpagePageRoutingModule
  ],
  declarations: [VerficationpagePage]
})
export class VerficationpagePageModule {}
