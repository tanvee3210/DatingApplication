import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { UniversitynamePage } from './universityname.page';

const routes: Routes = [
  {
    path: '',
    component: UniversitynamePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UniversitynamePageRoutingModule {}
