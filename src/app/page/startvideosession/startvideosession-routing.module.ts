import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { StartvideosessionPage } from './startvideosession.page';

const routes: Routes = [
  {
    path: '',
    component: StartvideosessionPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class StartvideosessionPageRoutingModule {}
