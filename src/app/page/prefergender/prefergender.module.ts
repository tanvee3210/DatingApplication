import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PrefergenderPageRoutingModule } from './prefergender-routing.module';

import { PrefergenderPage } from './prefergender.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PrefergenderPageRoutingModule
  ],
  declarations: [PrefergenderPage]
})
export class PrefergenderPageModule {}
