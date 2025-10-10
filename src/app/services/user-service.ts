import { Injectable } from '@angular/core';
import { AbstractControl, AsyncValidatorFn, ValidationErrors } from '@angular/forms';
import { DUMMY_USERS } from '../DUMMY_USER/dummy-data';
import { UserInterface } from '../models/user-interface';

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
      return user ? null : { userNotFound: { status: true } };
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

  async onSignUp(username: string, password: string): Promise<{ success: boolean; message: string; }> {
    await this.simulateDelay();

    // Check if user already exists
    const existingUser = DUMMY_USERS.find(u => u.username === username);
    if (existingUser) {
      return {
        success: false,
        message: 'Username already exists. Please choose a different username.'
      };
    }

    // Generate new ID (get the highest ID and add 1)
    const maxId = DUMMY_USERS.length > 0 ? Math.max(...DUMMY_USERS.map(u => u.id || 0)) : 0;
    const newUser: UserInterface = {
      id: maxId + 1,
      username: username,
      password: password
    };

    // Add new user to DUMMY_USERS array
    DUMMY_USERS.push(newUser);

    return {
      success: true,
      message: 'User registered successfully!',
    };
  }

}
