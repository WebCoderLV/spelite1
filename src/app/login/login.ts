import { Component, inject } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { UserInterface } from '../models/user-interface';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  fb = inject(FormBuilder);

  formValidators = (controles: AbstractControl): ValidationErrors | null => {
    const value = controles.value;

    if (!value) {
      return null;
    }

    let errors: ValidationErrors = {};

    if (/^[A-Z]/.test(value)) {
      errors['upperCase'] = {
        message: 'Field must start with an uppercase letter',
      };
    }

    return Object.keys(errors).length ? errors : null;
  };

  loginForm = this.fb.group({
    username: ['', [Validators.required, Validators.minLength(2), this.formValidators]],
    password: ['', [Validators.required]],
  });

  user: UserInterface = {
    username: '',
    password: '',
  };

  onSubmit() {
    console.log('Form Submitted', this.loginForm);
    this.user = {
      username: this.loginForm.value.username || '',
      password: this.loginForm.value.password || '',
    };
  }

  onSignUp() {
    console.log('Sign Up clicked');
  }
}
