import { Component } from '@angular/core';
import store from '../../../app-store';
import { User } from "../../../actions/user-actions";

@Component({
  selector: 'sub-navigation',
  templateUrl: './sub-navigation.component.html'
})

export class SubNavigationComponent {
  currentUser: User;
  constructor() {
    store.subscribe(function() {
      this.currentUser = store.getState().users.currentUser;
    });
  }
}
