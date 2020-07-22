import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { Videosession2Page } from './videosession2.page';

const routes: Routes = [
  {
    path: '',
    component: Videosession2Page
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class Videosession2PageRoutingModule {}
