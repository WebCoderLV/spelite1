import { Component, signal } from '@angular/core';
import { Field, form } from '@angular/forms/signals';
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

  protected readonly loginForm = form(this.user);

  onLogIn() {
    console.log('User ', this.user(), ' logged in');
  }

}
