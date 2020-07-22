import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { OtpverficationPage } from './otpverfication.page';

const routes: Routes = [
  {
    path: '',
    component: OtpverficationPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OtpverficationPageRoutingModule {}
