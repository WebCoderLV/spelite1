import { Component, inject, signal, computed, effect, OnInit } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
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
  styleUrls: ['./login.css']
})
export class Login implements OnInit {
  fb = inject(FormBuilder);
  userService = inject(UserService);

  // Signals for reactive state management
  user = signal<UserInterface>({
    username: '',
    password: '',
  });

  signUpResult = signal<{ success: boolean; message: string }>({ success: false, message: '' });

  ngOnInit() {
    this.userService.getUserByName('Arturs').subscribe({
      next: (data) => {
        console.log('Data from backend: ', data);
        this.signUpResult.set({ success: data.found, message: '' });
      },
      error: (error) => {
        console.error('Error fetching user data: ', error);
        this.signUpResult.set({ success: false, message: 'User not found' });
      }
    });
    console.log('User exists: ', this.signUpResult());
  }

  // No formas vārdiņš.
  // ielikt vārdiņu metodē, kas izsauc servisu
  // subscribe dabūt rezultātu.
  // Rezultātu es ielieku signālā

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

  // Convert form observables to signals
  formStatus = toSignal(this.loginForm.statusChanges, { initialValue: this.loginForm.status });
  formValue = toSignal(this.loginForm.valueChanges, { initialValue: this.loginForm.value });

  // Computed signals that automatically react to form changes
  formValid = computed(() => {
    // This will automatically react when formStatus() or formValue() changes
    this.formStatus(); // Access the signal to create dependency
    this.formValue(); // Access the signal to create dependency

    const usernameControl = this.loginForm.get('username');
    const passwordControl = this.loginForm.get('password');
    const isUsernameValid = usernameControl?.hasError('required') === false &&
      usernameControl?.hasError('minlength') === false &&
      usernameControl?.hasError('pattern') === false;
    const isPasswordValid = passwordControl?.valid === true;

    return isUsernameValid && isPasswordValid;
  });

  userExists = computed(() => {
    if (this.formValid()) {
      const name = this.loginForm.get('username');


      // This will automatically react when formStatus() or formValue() changes
      // this.formStatus();
      // this.formValue();

      // const usernameControl = this.loginForm.get('username');
      // const isUsernameValid = usernameControl?.hasError('required') === false &&
      //   usernameControl?.hasError('minlength') === false &&
      //   usernameControl?.hasError('pattern') === false;

      // if (usernameControl?.pending) {
      //   return null;
      // } else if (usernameControl?.errors?.['userNotFound']) {
      //   return false;
      // } else if (isUsernameValid && usernameControl?.value) {
      //   return true;

      // } else {
      //   return null;
      // }
    });

  isSignUpEnabled = computed(() => {
    return this.formValid() && this.userExists() === false && !this.signUpResult().success;
  });

  isLoginEnabled = computed(() => {
    return this.formValid() && (this.userExists() === true || this.signUpResult().success);
  });

  onLogIn() {
    const rawValue = this.loginForm.getRawValue();
    this.user.set({ ...rawValue });
    console.log('User ', this.user(), ' logged in');
  }

  async onSignUp() {
    const rawValue = this.loginForm.getRawValue();
    const result = await this.userService.onSignUp(rawValue.username, rawValue.password);
    // this.signUpResult.set(result);
  }
}
