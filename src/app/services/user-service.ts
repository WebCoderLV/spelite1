import { Injectable } from '@angular/core';
import { AbstractControl, AsyncValidatorFn, ValidationErrors } from '@angular/forms';
import { DUMMY_USERS } from '../DUMMY_USER/dummy-data';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private async simulateDelay(): Promise<void> {
    return new Promise(resolve => {
      setTimeout(resolve, 1500);
    });
  }

  // Async validator to check if user exists in dummy data
  validateUserExists(): AsyncValidatorFn {
    return async (control: AbstractControl) => {
      if (!control.value) {
        return null;
      }
      await this.simulateDelay();
      const user = DUMMY_USERS.find(u => u.username === control.value);
      return user ? null : { userNotFound: { message: 'User not found in database. Please sign up!' } };
    };
  }
  //Sync Password validator function
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

}
