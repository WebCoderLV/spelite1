import { Component, computed, inject, signal } from '@angular/core';
import { Field, form, maxLength, minLength, required } from '@angular/forms/signals';
import { UserInterface } from '../models/user-interface';
import { UserService } from '../services/user-service';

@Component({
  selector: 'app-login',
  imports: [Field],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class Login {

  userService = inject(UserService);

  protected readonly user = signal<UserInterface>({
    name: '',
    password: '',
  });

  protected readonly loginForm = form(this.user, (p) => {
    required(p.name, { message: 'Name is required' });
    minLength(p.name, 3, { message: 'Name must be at least 3 characters' });
    maxLength(p.name, 25, { message: 'Name cannot exceed 25 characters' });

    required(p.password, { message: 'Password is required' });
    minLength(p.password, 4, { message: 'Password must be at least 4 characters' });
    maxLength(p.password, 50, { message: 'Password cannot exceed 50 characters' });
  });

  protected loginForms = computed(() => this.loginForm());

  onLogIn() {
    if (this.loginForm().valid()) {
      this.userService.logIn(this.user()).subscribe({
        next: (response) => {
          this.user.update(() => ({ ...this.user(), id: response.body! }));
          console.log("User " + JSON.stringify(this.user()) + " Status: " + response.status);
        },
        error: (error) => {
          console.error('Error fetching user:', error);
        }
      });
    }
  }

}