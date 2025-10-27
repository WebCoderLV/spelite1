import { Component, inject } from '@angular/core';
import { Field, form, maxLength, minLength, required } from '@angular/forms/signals';
import { Router } from '@angular/router';
import { takeUntil } from 'rxjs';
import { UserLoginGlobalSignal } from '../models/login-global-signal';
import { UserGlobalSignal } from '../models/user -global-signal';
import { UserService } from '../services/user-service';
import { BaseComponent } from '../shared/base-component';

@Component({
  selector: 'app-login',
  imports: [Field],
  templateUrl: './login.html',
  styleUrls: ['./login.css'],
})
export class Login extends BaseComponent {
  userService = inject(UserService);
  router = inject(Router);
  user = inject(UserGlobalSignal).user;
  userLoginGlobalSignal = inject(UserLoginGlobalSignal);

  protected readonly loginForm = form(this.user, (p) => {
    required(p.name, { message: 'Name is required' });
    minLength(p.name, 3, { message: 'Name must be at least 3 characters' });
    maxLength(p.name, 25, { message: 'Name cannot exceed 25 characters' });

    required(p.password, { message: 'Password is required' });
    minLength(p.password, 4, { message: 'Password must be at least 4 characters' });
    maxLength(p.password, 50, { message: 'Password cannot exceed 50 characters' });
  });

  onLogIn() {
    if (this.loginForm().valid()) {
      const loginSubscription = this.userService
        .logIn(this.user)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (response) => {
            this.user.update(() => ({ ...this.user(), id: response.body! }));
            this.userLoginGlobalSignal.logedIn.set(true);
            this.router.navigate(['/main']);
          },
          error: (error) => {
            console.error('Error fetching user:', error);
          },
        });
    }
  }
}
