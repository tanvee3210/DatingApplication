import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { LocationpagePageRoutingModule } from './locationpage-routing.module';

import { LocationpagePage } from './locationpage.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    LocationpagePageRoutingModule
  ],
  declarations: [LocationpagePage]
})
export class LocationpagePageModule {}
