import { Component, inject, signal, computed, effect } from '@angular/core';
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
  styleUrl: './login.css',
})
export class Login {
  fb = inject(FormBuilder);
  userService = inject(UserService);

  // Signals for reactive state management
  user = signal<UserInterface>({
    username: '',
    password: '',
  });

  signUpResult = signal<{ success: boolean; message: string }>({
    success: false,
    message: ''
  });

  formValid = signal<boolean>(false);
  userExists = signal<boolean | null>(null);

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

  // Computed signals for button states
  isSignUpEnabled = computed(() => {
    return this.formValid() && this.userExists() === false && !this.signUpResult().success;
  });

  isLoginEnabled = computed(() => {
    return this.formValid() && (this.userExists() === true || this.signUpResult().success);
  });

  constructor() {
    // Use effects to reactively update form state when signals change
    effect(() => {
      // React to form status changes
      this.formStatus();
      this.updateFormState();
    });

    effect(() => {
      // React to form value changes  
      this.formValue();
      this.updateFormState();
    });

    // Initial form state update
    this.updateFormState();
  }

  private updateFormState() {
    const usernameControl = this.loginForm.get('username');
    const passwordControl = this.loginForm.get('password');
    const isUsernameValid = usernameControl?.hasError('required') === false &&
      usernameControl?.hasError('minlength') === false &&
      usernameControl?.hasError('pattern') === false;
    const isPasswordValid = passwordControl?.valid === true;

    this.formValid.set(isUsernameValid && isPasswordValid);
    if (usernameControl?.pending) {
      this.userExists.set(null);
    } else if (usernameControl?.errors?.['userNotFound']) {
      this.userExists.set(false);
    } else if (isUsernameValid && usernameControl?.value) {
      this.userExists.set(true);
    } else {
      this.userExists.set(null);
    }
  }

  onLogIn() {
    const rawValue = this.loginForm.getRawValue();
    this.user.set({ ...rawValue });
    console.log('User ', this.user(), ' logged in');
  }

  async onSignUp() {
    const rawValue = this.loginForm.getRawValue();
    const result = await this.userService.onSignUp(rawValue.username, rawValue.password);
    this.signUpResult.set(result);

    if (this.signUpResult().success) {
      console.log('Sign Up Success:', this.signUpResult().message);
      // Update form state to reflect that user now exists
      this.userExists.set(true);
    } else {
      console.log('Sign Up Failed:', this.signUpResult().message);
    }
  }
}
