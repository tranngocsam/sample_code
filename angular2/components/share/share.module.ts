import { NgModule }       from '@angular/core';

import { SubNavigationComponent } from "./sub-navigation/sub-navigation.component";

@NgModule({
  declarations: [
    SubNavigationComponent
  ],
  exports: [
    SubNavigationComponent
  ]
})
export class ShareModule {}
