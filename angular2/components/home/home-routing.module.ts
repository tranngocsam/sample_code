import { NgModule }     from '@angular/core';
import { RouterModule } from '@angular/router';

import { LandingComponent }  from './landing/landing.component';
import { LoginFormComponent }  from './login-form/login-form.component';

@NgModule({
  imports: [
    RouterModule.forRoot([
      // { path: 'search',  component: JobsSearchComponent },
      { path: '', component: LandingComponent },
      { path: 'login', component: LoginFormComponent }
    ])
  ],
  exports: [
    RouterModule
  ]
})
export class HomeRoutingModule { }
