import { Component, inject } from '@angular/core';
import {
  AbstractControl,
  AsyncValidatorFn,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
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

  // Async validator to check if user exists in dummy data
  userExistsValidator(): AsyncValidatorFn {
    return (control: AbstractControl) => {
      if (!control.value) {
        return Promise.resolve(null);
      }
      return this.userService.validateUserExists(control.value);
    };
  }

  passwordValidator = (control: AbstractControl): ValidationErrors => {
    const value = control.value;
    let errors: ValidationErrors = {};

    if (!value) {
      return errors;
    }
    if (value.length < 4 || value.length > 8) {
      errors['length'] = {
        message: 'Password must be 4 to 8 characters long. ',
      };
    }
    // Check for at least one special character
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(value)) {
      errors['specialChar'] = {
        message: 'Password must contain at least one special character. ',
      };
    }
    // Check for at least one capital letter, but not the first character
    if (!/^.+[A-Z]/.test(value) || /^[A-Z]/.test(value)) {
      errors['capitalLetter'] = {
        message: 'Password must contain one capital letter, but not as the first character.',
      };
    }

    return errors;
  };

  loginForm: FormGroup = this.fb.group({
    username: ['',
      [Validators.required, Validators.minLength(2), Validators.pattern('^[A-Z]\\S*$')],
      [this.userExistsValidator()],
      { updateOn: 'blur' }  // Validate on blur to reduce API calls
    ],
    password: ['', [Validators.required, this.passwordValidator]],
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
