import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ForgotpagePage } from './forgotpage.page';

const routes: Routes = [
  {
    path: '',
    component: ForgotpagePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ForgotpagePageRoutingModule {}
