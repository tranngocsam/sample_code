import { Component, ElementRef, Input, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { Suggestion } from "../../../actions/career-actions";
import { Subject } from "rxjs/Subject";
import { Observable } from "rxjs/Observable";
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/debounce';
import 'rxjs/add/observable/interval';

@Component({
    selector: 'autocomplete',
    host: {
        '(document:click)': 'handleClick($event)',
    },
    template: `
        <div class="container autocomplete-container" >
          <div class="form-group">
            <input id="country" type="text" class="form-control" placeholder="Enter a keyword" [(ngModel)]="query" (keyup)="subject$.next($event)" (focus)="handleFocus()" (blur)="handleBlur()" />
          </div>
          <div class="suggestions" *ngIf="options && options.length > 0 && showOptions">
            <ul class="list-unstyled">
              <li *ngFor="let item of options; let idx = index">
                <a href="#" (click)="select(item, $event)">{{item.value}}</a>
              </li>
            </ul>
          </div>
        </div>
    `
})

export class AutocompleteComponent {
    public query: string = '';
    public showOptions: boolean = false;
    public elementRef: ElementRef;

    @Input() public options: Suggestion[];
    @Input() public isLoading: boolean;
    @Output() public onKeyup: EventEmitter<any> = new EventEmitter();

    selectedIdx: number;
    subject$ = new Subject();

    constructor(myElement: ElementRef, private router: Router) {
      let fthis = this;
      this.elementRef = myElement;
      this.selectedIdx = -1;

      this.subject$.map((event: KeyboardEvent)=> (<HTMLInputElement>event.target).value)
                   .debounce(() => Observable.interval(1000))
                   .distinctUntilChanged()
                   .subscribe((value) => this.onKeyup.emit(value));

      this.subject$.subscribe(function(event: KeyboardEvent) {
        fthis.showOptions = true;
        if (event.code == "ArrowDown" && this.selectedIdx < this.options.length) {
          fthis.selectedIdx++;
        } else if (event.code == "ArrowUp" && this.selectedIdx > 0) {
          fthis.selectedIdx--;
        } else if (event.code == "Enter") {
          // this.router.navigate(["jobs/search", {term: this.query}]);
        }
      });
    }

    filter(event: KeyboardEvent) {
      this.showOptions = true;
      if (event.code == "ArrowDown" && this.selectedIdx < this.options.length) {
        this.selectedIdx++;
      } else if (event.code == "ArrowUp" && this.selectedIdx > 0) {
        this.selectedIdx--;
      } else if (event.code == "Enter") {
        // this.router.navigate(["jobs/search", {term: this.query}]);
      } else {
        this.onKeyup.emit(event);
      }
    }

    select(item: Suggestion, event: MouseEvent) {
      event.preventDefault();
      this.query = item.value;
      this.selectedIdx = -1;
      this.router.navigate(["jobs/" + item.slug]);
    }

    handleFocus() {
      this.showOptions = true;
    }

    handleBlur() {
      if (this.selectedIdx > -1 && this.options && this.options.length > 0) {
        let suggestion: Suggestion = this.options[this.selectedIdx];

        if (suggestion) {
          this.query = suggestion.value;
        }
      }

      setTimeout(()=> this.showOptions = false, 500);
      this.selectedIdx = -1;
    }

    handleClick(event: MouseEvent) {
      var clickedComponent: Node = <Node>event.target;
      var inside = false;
      do {
        if (clickedComponent === this.elementRef.nativeElement) {
            inside = true;
        }
        clickedComponent = clickedComponent.parentNode;
      } while (clickedComponent);

      if (!inside) {
        this.showOptions = false;
      }
      this.selectedIdx = -1;
    }
}
