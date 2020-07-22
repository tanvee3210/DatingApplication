import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LocationpagePage } from './locationpage.page';

const routes: Routes = [
  {
    path: '',
    component: LocationpagePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LocationpagePageRoutingModule {}
