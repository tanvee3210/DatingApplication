import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { UniversitynamePageRoutingModule } from './universityname-routing.module';

import { UniversitynamePage } from './universityname.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    UniversitynamePageRoutingModule
  ],
  declarations: [UniversitynamePage]
})
export class UniversitynamePageModule {}
