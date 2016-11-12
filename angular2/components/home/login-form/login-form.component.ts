import { Component, Inject } from '@angular/core';
import store from '../../../app-store';
import { Router } from '@angular/router';
import { login } from "../../../actions/user-actions";

@Component({
  selector: 'login-form',
  templateUrl: './login-form.component.html'
})

export class LoginFormComponent {
  currentUser = null;
  submitted = false;
  user: any = {};
  constructor(private router: Router) {
    store.subscribe(function() {
      this.currentUser = store.getState().users.currentUser;
      if (this.currentUser && this.currentUser.id) {
        router.navigate(["/"]);
      }
    });
  }

  onSubmit() {
    this.submitted = true;
    if (this.user.login && this.user.password) {
      login(this.user);
    }
  }
}
