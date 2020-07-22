import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { VerficationpagePage } from './verficationpage.page';

const routes: Routes = [
  {
    path: '',
    component: VerficationpagePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class VerficationpagePageRoutingModule {}
