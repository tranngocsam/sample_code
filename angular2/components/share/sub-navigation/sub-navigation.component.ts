import { Component } from '@angular/core';
import store from '../../../app-store';

@Component({
  selector: 'sub-navigation',
  templateUrl: './sub-navigation.component.html'
})

export class SubNavigationComponent {
  currentUser = null;
  constructor() {
    store.subscribe(function() {
      this.currentUser = store.getState().users.currentUser;
    });
  }
}
