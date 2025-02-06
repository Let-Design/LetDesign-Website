import { ChangeDetectionStrategy, Component, OnDestroy } from '@angular/core';
import {
  FormGroup,
  FormControl,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { TuiError, TuiIcon, TuiTextfield } from '@taiga-ui/core';
import { TuiInputModule, TuiTextfieldControllerModule } from '@taiga-ui/legacy';
import {
  TuiFieldErrorPipe,
  TuiPassword,
  tuiValidationErrorsProvider,
} from '@taiga-ui/kit';
import { AuthService } from '../../../core/services/auth.service';
import { RegisterInput } from '../../../types/auth.types';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-register',
  imports: [
    AsyncPipe,
    ReactiveFormsModule,
    TuiTextfield,
    TuiInputModule,
    TuiIcon,
    TuiPassword,
    TuiTextfieldControllerModule,
    TuiError,
    TuiFieldErrorPipe,
  ],
  templateUrl: './register.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    tuiValidationErrorsProvider({
      required: 'This field is required',
      email: 'Enter a valid email',
      minlength: ({ requiredLength }: { requiredLength: string }) =>
        `Min Length - ${requiredLength}`,
    }),
  ],
})
export class RegisterComponent {
  form = new FormGroup({
    username: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(8),
    ]),
  });

  constructor(private authService: AuthService) {}

  submit() {
    const input = this.form.value as RegisterInput;
    console.log('Submit: ', input);

    this.authService.register(input).subscribe({
      next: (res) => {
        console.log(res);
        localStorage.setItem('auth', 'true');
        this.authService.isAuthenticated.set(true);
      },
      error: (err) => console.error('Failed to register: ', err),
    });
  }

  signupWithGoogle() {
    this.authService.loginWithGoogle();
  }
}
