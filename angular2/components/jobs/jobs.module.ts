import { NgModule }       from '@angular/core';
import { CommonModule }   from '@angular/common';
import { FormsModule }    from '@angular/forms';

import { ShareModule } from "../share/share.module";
// import { JobsSearchComponent }    from './jobs-search.component';
import { JobDetailComponent }  from './job-detail/job-detail.component';
import { JobsRoutingModule } from './jobs-routing.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    JobsRoutingModule,
    ShareModule
  ],
  declarations: [
    // JobsSearchComponent,
    JobDetailComponent
  ],
  providers: [

  ]
})
export class JobsModule {}
