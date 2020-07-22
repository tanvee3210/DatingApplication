import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { VideopagePageRoutingModule } from './videopage-routing.module';

import { VideopagePage } from './videopage.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    VideopagePageRoutingModule
  ],
  declarations: [VideopagePage]
})
export class VideopagePageModule {}
