import { Component, Inject } from '@angular/core';
import store from '../../../app-store';
import { Router } from '@angular/router';
import { login, User } from "../../../actions/user-actions";

interface LoginForm {
  login: string;
  password: string;
  remember_me?: boolean
}

@Component({
  selector: 'login-form',
  templateUrl: './login-form.component.html'
})

export class LoginFormComponent {
  currentUser: User = null;
  submitted: boolean = false;
  form: LoginForm = {login: "", password: ""};

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
    if (this.form.login && this.form.password) {
      login(this.form);
    }
  }
}
