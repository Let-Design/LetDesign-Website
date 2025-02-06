import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnDestroy } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { TuiError, TuiIcon, TuiTextfield } from '@taiga-ui/core';
import { TuiInputModule, TuiTextfieldControllerModule } from '@taiga-ui/legacy';
import {
  TuiFieldErrorPipe,
  TuiPassword,
  tuiValidationErrorsProvider,
} from '@taiga-ui/kit';
import { AuthService } from '../../../core/auth/auth.service';
import { LoginInput } from '../../../types/auth.types';

@Component({
  selector: 'app-login',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TuiTextfield,
    TuiInputModule,
    TuiIcon,
    TuiPassword,
    TuiTextfieldControllerModule,
    TuiError,
    TuiFieldErrorPipe,
  ],
  templateUrl: './login.component.html',
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
export class LoginComponent {
  form = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(8),
    ]),
  });

  constructor(private authService: AuthService) {}

  submit() {
    console.log('Submit: ', this.form.value);
    const input = this.form.value as LoginInput;

    this.authService.login(input).subscribe({
      next: (res) => {
        console.log(res);
      },
      error: (err) => console.log('Failed to login: ', err),
    });
  }

  loginWithGoogle() {
    this.authService.loginWithGoogle();
  }
}
