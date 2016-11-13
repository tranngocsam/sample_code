import { Component, ElementRef, Input, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { Suggestion } from "../../../actions/career-actions"

@Component({
    selector: 'autocomplete',
    host: {
        '(document:click)': 'handleClick($event)',
    },
    template: `
        <div class="container autocomplete-container" >
          <div class="form-group">
            <input id="country" type="text" class="form-control" placeholder="Enter a keyword" [(ngModel)]="query" (keyup)="filter($event)" (focus)="handleFocus()" (blur)="handleBlur()" />
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

    constructor(myElement: ElementRef, private router: Router) {
      this.elementRef = myElement;
      this.selectedIdx = -1;
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
