import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: "",
    redirectTo: "loginpage",
    pathMatch: "full"
  },
  {
    path: '',
    loadChildren: () => import('./page/tabs/tabs.module').then(m => m.TabsPageModule)
  },

  {
    path: 'userpage',
    loadChildren: () => import('./page/userpage/userpage.module').then(m => m.UserpagePageModule)
  },
  {
    path: 'loginpage',
    loadChildren: () => import('./page/loginpage/loginpage.module').then(m => m.LoginpagePageModule)
  },
  {
    path: 'gender',
    loadChildren: () => import('./page/gender/gender.module').then(m => m.GenderPageModule)
  },
  {
    path: 'prefergender',
    loadChildren: () => import('./page/prefergender/prefergender.module').then(m => m.PrefergenderPageModule)
  },
  {
    path: 'universityname',
    loadChildren: () => import('./page/universityname/universityname.module').then(m => m.UniversitynamePageModule)
  },
  {
    path: 'locationpage',
    loadChildren: () => import('./page/locationpage/locationpage.module').then(m => m.LocationpagePageModule)
  },
  {
    path: 'verficationpage',
    loadChildren: () => import('./page/verficationpage/verficationpage.module').then(m => m.VerficationpagePageModule)
  },
  {
    path: 'otpverfication',
    loadChildren: () => import('./page/otpverfication/otpverfication.module').then(m => m.OtpverficationPageModule)
  },

  {
    path: 'videopage',
    loadChildren: () => import('./page/videopage/videopage.module').then(m => m.VideopagePageModule)
  },
  {
    path: 'forgotpage',
    loadChildren: () => import('./page/forgotpage/forgotpage.module').then(m => m.ForgotpagePageModule)
  },
  {
    path: 'startvideosession',
    loadChildren: () => import('./page/startvideosession/startvideosession.module').then(m => m.StartvideosessionPageModule)
  },
  {
    path: 'videosession',
    loadChildren: () => import('./page/videosession/videosession.module').then(m => m.VideosessionPageModule)
  },
  {
    path: 'message',
    loadChildren: () => import('./page/message/message.module').then(m => m.MessagePageModule)
  },
  {
    path: 'videosession2',
    loadChildren: () => import('./page/videosession2/videosession2.module').then( m => m.Videosession2PageModule)
  },
  {
    path: 'tab1',
    loadChildren: () => import('./page/tab1/tab1.module').then( m => m.Tab1PageModule)
  },
  {
    path: 'tab2',
    loadChildren: () => import('./page/tab2/tab2.module').then( m => m.Tab2PageModule)
  },
  {
    path: 'tab3',
    loadChildren: () => import('./page/tab3/tab3.module').then( m => m.Tab3PageModule)
  },

];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules, onSameUrlNavigation: 'reload' })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
