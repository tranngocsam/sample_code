import { Component, Inject, OnInit } from '@angular/core';
import store from '../../../app-store';
import { Router, Params, ActivatedRoute } from '@angular/router';
import Career from "../../../models/career";
import { searchJobQuestions, loadJob, loadJobGuides } from "../../../actions/career-actions";
import { Util } from "../../../utils/util";
import { User } from "../../../actions/user-actions";
import { Job, Guide, Question, PaginationInfo } from "../../../actions/career-actions";

@Component({
  selector: 'job-detail',
  templateUrl: './job-detail.component.html'
})

export class JobDetailComponent implements OnInit {
  currentUser: User = null;
  slug: string;
  career: Job;
  careerPaths: any;
  guides: Guide[];
  guidesPaginationInfo: PaginationInfo;
  questions: Question[];
  questionsPaginationInfo: PaginationInfo;

  constructor(private router: Router, private route: ActivatedRoute) {
    store.subscribe(() => {
      this.currentUser = store.getState().users.currentUser;
      this.career = store.getState().careers.career;
      this.careerPaths = store.getState().careers.careerPaths;
      this.guides = store.getState().careers.guides;
      this.guidesPaginationInfo = store.getState().careers.guidesPaginationInfo;
      this.questions = store.getState().careers.questions;
      this.questionsPaginationInfo = store.getState().careers.questionsPaginationInfo;
    });
  }

  ngOnInit() {
    this.route.params.forEach((params: Params) => {
       this.slug = params['slug'];
       this.loadJob(this.slug);
       this.loadGuides(this.slug);
       this.searchQuestions(this.slug);
     });
  }

  loadJob(id: string) {
    var params:any = {};
    params.include = JSON.stringify(["career_wages", "career_job_bios", "sections", "career_job_synonyms", "steps", {interest: {include: ["steps"]}}]);

    loadJob(id, params);
  }

  loadGuides(id: string) {
    var params: any = {};
    params.include = JSON.stringify([]);

    loadJobGuides(id, params);
  }

  searchQuestions(id: string, page: number = undefined, perPage: number = undefined) {
    var params: any = {};
    params.page = page || 1;
    params.per_page = perPage || 10;
    params.include = JSON.stringify(["tags", "profile", {qa_answers: {include: ["profile"]}}]);

    searchJobQuestions(id, params);
  }
}
