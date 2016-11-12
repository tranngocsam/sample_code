import {Component, ElementRef, Input, Output, EventEmitter} from '@angular/core';
import { Router } from '@angular/router';

@Component({
    selector: 'autocomplete',
    host: {
        '(document:click)': 'handleClick($event)',
    },
    template: `
        <div class="container autocomplete-container" >
          <div class="form-group">
            <input id="country" type="text" class="form-control" placeholder="Enter a keyword" [(ngModel)]="query" (keyup)="filter($event)" (blur)="handleBlur()" />
          </div>
          <div class="suggestions" *ngIf="options && options.length > 0">
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
    public query = '';
    public filteredList = [];
    public showOptions = false;
    public elementRef;
    renderedOptions: any;

    @Input() public options: any;
    @Input() public isLoading: boolean;
    @Output() public onKeyup: EventEmitter<any> = new EventEmitter();

    selectedIdx: number;

    constructor(myElement: ElementRef, private router: Router) {
      this.elementRef = myElement;
      this.selectedIdx = -1;
    }

    filter(event: any) {
      this.showOptions = true;
      if (event.code == "ArrowDown" && this.selectedIdx < this.options.length) {
        this.selectedIdx++;
      } else if (event.code == "ArrowUp" && this.selectedIdx > 0) {
        this.selectedIdx--;
      } else if (event.code == "Enter") {
        this.router.navigate(["jobs/search?term=" + this.query]);
      } else {
        this.onKeyup.emit(event);
      }
    }

    select(item, event) {
      event.preventDefault();
      this.query = item;
      this.filteredList = [];
      this.showOptions = false;
      this.selectedIdx = -1;
      this.router.navigate(["jobs/" + item.slug]);
    }

    handleBlur() {
      if (this.selectedIdx > -1 && this.options && this.options.length > 0) {
        // this.query = this.filteredList[this.selectedIdx];
        this.query = this.options[this.selectedIdx];
      }
      this.filteredList = [];
      this.showOptions = false;
      this.selectedIdx = -1;
    }

    handleClick(event) {
      var clickedComponent = event.target;
      var inside = false;
      do {
        if (clickedComponent === this.elementRef.nativeElement) {
            inside = true;
        }
        clickedComponent = clickedComponent.parentNode;
      } while (clickedComponent);
      if (!inside) {
        this.filteredList = [];
        this.showOptions = false;
      }
      this.selectedIdx = -1;
    }
}
