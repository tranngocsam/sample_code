import { NgModule }     from '@angular/core';
import { RouterModule } from '@angular/router';

// import { JobsSearchComponent }    from './jobs-search.component';
import { JobDetailComponent }  from './job-detail/job-detail.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      // { path: 'search',  component: JobsSearchComponent },
      { path: 'jobs/:slug', component: JobDetailComponent }
    ])
  ],
  exports: [
    RouterModule
  ]
})
export class JobsRoutingModule { }
