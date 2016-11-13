import { Component } from '@angular/core';
import store from '../../app-store';
import { User } from "../../actions/user-actions";

@Component({
  selector: 'page-header',
  templateUrl: './page-header.component.html',
  styleUrls: []
})

export class PageHeaderComponent {
  currentUser: User;
  constructor() {
    let _this = this;
    store.subscribe(function() {
      _this.currentUser = store.getState().users.currentUser;
    });
  }
}
