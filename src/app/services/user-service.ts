import { inject, Injectable } from '@angular/core';
import { AbstractControl, AsyncValidatorFn, ValidationErrors } from '@angular/forms';
import { UserInterface } from '../models/user-interface';
import { HttpClient } from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})
export class UserService {

  private http: HttpClient = inject(HttpClient);

  public getUserByName(username: string) {
    return this.http.get<{ found: boolean, httpStatus: string }>(`http://localhost:8080/api/v1/user/${username}`);
  }

  public validateUserExists(): AsyncValidatorFn {
    return async (control: AbstractControl) => {
      if (!control.value) {
        return null;
      }
      return this.http.get<UserInterface[]>('http://localhost:8080/api/v1/users');
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

  // async onSignUp(username: string, password: string): Promise<{ success: boolean; message: string; }> {
  //   await this.simulateDelay();

  //   // Check if user already exists
  //   const existingUser = DUMMY_USERS.find(u => u.username === username);
  //   if (existingUser) {
  //     return {
  //       success: false,
  //       message: 'Username already exists. Please choose a different username.'
  //     };
  //   }

  //   // Generate new ID (get the highest ID and add 1)
  //   const maxId = DUMMY_USERS.length > 0 ? Math.max(...DUMMY_USERS.map(u => u.id || 0)) : 0;
  //   // mainīgs: nuber[] = [1,2,3]
  //   // citsMainigais = mainigais.map(elements => elements * 2); // [2,4,6]
  //   // Math.max(...citsMainigais) // 6
  //   const newUser: UserInterface = {
  //     id: maxId + 1,
  //     username: username,
  //     password: password
  //   };

  //   // Add new user to DUMMY_USERS array
  //   DUMMY_USERS.push(newUser);

  //   return {
  //     success: true,
  //     message: 'User registered successfully!',
  //   };
  // }

  onSignUp(username: string, password: string) {

    // Check if user already exists

  }
}
