import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { VideosessionPage } from './videosession.page';

const routes: Routes = [
  {
    path: '',
    component: VideosessionPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class VideosessionPageRoutingModule {}
