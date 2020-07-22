import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PrefergenderPage } from './prefergender.page';

const routes: Routes = [
  {
    path: '',
    component: PrefergenderPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PrefergenderPageRoutingModule {}
