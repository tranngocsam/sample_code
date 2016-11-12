import { BrowserModule } from '@angular/platform-browser';
import { Component, NgModule, Inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule }   from '@angular/router';

import { HomeModule } from "./components/home/home.module";
import { JobsModule } from "./components/jobs/jobs.module";
import { PageHeaderComponent } from "./components/page-header/page-header.component";
import { PageFooterComponent } from "./components/page-footer/page-footer.component";

import { loadCurrentUser } from "./actions/user-actions";
import * as Rx from 'rxjs/Rx';
(<any>window).Rx = Rx;
@Component({
  selector: 'app-root',
  template: `
    <div class="app-container">
      <page-header></page-header>
      <router-outlet></router-outlet>
      <page-footer></page-footer>
    </div>
  `,
  styleUrls: []
})
export class Main {
}

@NgModule({
  declarations: [
    Main,
    PageHeaderComponent,
    PageFooterComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    JobsModule,
    HomeModule,
    RouterModule
  ],
  exports: [
    // SubNavigation
  ],
  providers: [
    // { provide: AppStore, useFactory: () => store }
  ],
  bootstrap: [Main]
})

export class AppModule {
  constructor() {
    loadCurrentUser();
  }
}
