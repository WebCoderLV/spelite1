import { Injectable, signal, computed } from '@angular/core';
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

  // Signal for loading state
  private isLoading = signal(false);

  // Signal for current user
  private currentUser = signal<UserInterface | null>(null);

  // Signal for validation result
  private validationResult = signal<boolean | null>(null);

  // Public readonly signals
  readonly loading = this.isLoading.asReadonly();
  readonly user = this.currentUser.asReadonly();
  readonly isValid = this.validationResult.asReadonly();


  async getUserByUsername(username: string): Promise<UserInterface | undefined> {
    this.isLoading.set(true);
    await this.simulateDelay();

    const user = DUMMY_USERS.find(user => user.username === username);
    this.currentUser.set(user || null);

    this.isLoading.set(false);
    return user;
  }

  async validateUser(username: string): Promise<boolean> {
    this.isLoading.set(true);
    await this.simulateDelay();

    const user = DUMMY_USERS.find(u => u.username === username);
    const isValid = !!user;
    this.validationResult.set(isValid);

    this.isLoading.set(false);
    return isValid;
  }

  // Async validator method that returns proper format for Angular forms
  async validateUserExists(username: string): Promise<{ [key: string]: any } | null> {
    const userExists = await this.validateUser(username);
    return userExists ? null : { userNotFound: { message: 'User not found in system' } };
  }

  async loginUser(username: string, password: string): Promise<UserInterface | null> {
    this.isLoading.set(true);
    await this.simulateDelay();

    const user = DUMMY_USERS.find(u => u.username === username && u.password === password);
    this.currentUser.set(user || null);
    this.validationResult.set(!!user);

    this.isLoading.set(false);
    return user || null;
  }

  // Method to logout user
  logoutUser(): void {
    this.currentUser.set(null);
    this.validationResult.set(null);
  }

  clearValidation(): void {
    this.validationResult.set(null);
  }

}
