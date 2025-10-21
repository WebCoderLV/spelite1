import { Component, signal } from '@angular/core';
import { Field, form, maxLength, minLength, required } from '@angular/forms/signals';
import { UserInterface } from '../models/user-interface';

@Component({
  selector: 'app-login',
  imports: [Field],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class Login {

  protected readonly user = signal<UserInterface>({
    username: '',
    password: '',
  });

  protected readonly loginForm = form(this.user, (path) => {
    required(path.username, { message: 'Username is required' });
    minLength(path.username, 3, { message: 'Username must be at least 3 characters' });
    maxLength(path.username, 25, { message: 'Username cannot exceed 25 characters' });

    required(path.password, { message: 'Password is required' });
    minLength(path.password, 4, { message: 'Password must be at least 4 characters' });
    maxLength(path.password, 50, { message: 'Password cannot exceed 50 characters' });
  });

  onLogIn() {
    if (this.loginForm().valid()) {
      console.log('User ', this.user(), ' logged in');
    }
  }

}
