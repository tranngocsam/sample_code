import { Component, ElementRef, Inject } from '@angular/core';
import Career from "../../../models/career";
import store from '../../../app-store';
import * as Rx from 'rxjs/Rx';
import { loadSuggestions } from "../../../actions/career-actions";

@Component({
  selector: 'primary-banner',
  templateUrl: './primary-banner.component.html'
})
export class PrimaryBannerComponent {
  elementRef: ElementRef;
  results = [];

  constructor(@Inject(ElementRef) elementRef: ElementRef) {
    let _this = this;
    this.elementRef = elementRef;

    store.subscribe(function() {
      _this.results = store.getState().careers.suggestions;
    });
  }

  onKeyup(event) {
    let value = event.target.value;
    if (value.length > 1) {
      let params: any = {};
      params["search[term]"] = value;
      loadSuggestions(params);
    } else {
      this.results = [];
    }
  }

  openExamples(event) {
    if (event) {
      event.preventDefault();
    }

    (<any>window).jQuery(this.elementRef.nativeElement).find("#example_careers").modal();
  }
}
