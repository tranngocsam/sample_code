import { NgModule }       from '@angular/core';
import { CommonModule }   from '@angular/common';
import { FormsModule } from '@angular/forms';

import { HomeRoutingModule } from './home-routing.module';
import { ShareModule } from "../share/share.module";

import { PrimaryBannerComponent } from "./primary-banner/primary-banner.component";
import { LoginBannerComponent } from "./login-banner/login-banner.component";
import { LoginFormComponent } from "./login-form/login-form.component";
import { LandingComponent } from "./landing/landing.component";
import { AutocompleteComponent } from "./autocomplete/autocomplete.component";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    HomeRoutingModule,
    ShareModule
  ],
  declarations: [
    PrimaryBannerComponent,
    LoginBannerComponent,
    LoginFormComponent,
    LandingComponent,
    AutocompleteComponent
  ],
  providers: [

  ]
})
export class HomeModule {}
