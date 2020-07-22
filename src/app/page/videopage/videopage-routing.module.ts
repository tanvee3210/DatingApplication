import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { VideopagePage } from './videopage.page';

const routes: Routes = [
  {
    path: '',
    component: VideopagePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class VideopagePageRoutingModule {}
