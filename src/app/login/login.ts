import { Component, inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { UserInterface } from '../models/user-interface';
import { UserService } from '../services/user-service';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  fb = inject(FormBuilder);
  userService = inject(UserService);
  user: UserInterface = {
    username: '',
    password: '',
  };

  loginForm: FormGroup = this.fb.group({
    username: ['',
      {
        validators: [Validators.required, Validators.minLength(2), Validators.pattern('^[A-Z]\\S*$')],
        asyncValidators: [this.userService.validateUserExists()],
        updateOn: 'blur'
      }
    ],
    password: ['', [Validators.required, this.userService.passwordValidator]],
  });

  onLogIn() {
    const rawValue = this.loginForm.getRawValue();
    this.user = { ...rawValue };
    console.log('Login attempt with:', this.user);
  }

  onSignUp() {
    console.log('Sign Up clicked');
  }


}
