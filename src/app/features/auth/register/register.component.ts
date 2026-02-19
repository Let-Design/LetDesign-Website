import { ChangeDetectionStrategy, Component, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { TuiError, TuiIcon, TuiLoader, TuiTextfield } from '@taiga-ui/core';
import { TuiFieldErrorPipe, TuiPassword, tuiValidationErrorsProvider } from '@taiga-ui/kit';
import { AuthService } from '@core/services/auth/auth.service';
import { RegisterInput } from '@models/auth.types';
import { AsyncPipe } from '@angular/common';
import { Subscription } from 'rxjs';
import { ErrorMessages } from '@shared/utils/error-messages';
import { TuiAnimated } from "@taiga-ui/cdk/directives/animated";

@Component({
  selector: 'app-register',
  imports: [
    AsyncPipe,
    ReactiveFormsModule,
    TuiIcon,
    TuiLoader,
    TuiPassword,
    TuiTextfield,
    TuiError,
    TuiAnimated,
    TuiFieldErrorPipe,
    TuiAnimated
  ],
  templateUrl: './register.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [tuiValidationErrorsProvider(ErrorMessages)],
})
export class RegisterComponent implements OnDestroy {
  apiError: string | null = null;
  loading = false;
  formSubscription!: Subscription;
  form = new FormGroup({
    username: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(8),
    ]),
  });

  constructor(private authService: AuthService) {
    this.formSubscription = this.form.valueChanges.subscribe(() => {
      if (this.apiError) {
        this.apiError = null;
        this.form.setErrors({ api: false });
      }
    });
  }

  ngOnDestroy(): void {
    this.formSubscription.unsubscribe();
  }

  submit() {
    const input = this.form.value as RegisterInput;
    this.loading = true;
    console.log('Submit: ', input);

    this.authService.register(input).subscribe({
      next: (res) => {
        console.log(res);
        localStorage.setItem('auth', 'true');
        this.authService.isAuthenticated.set(true);
        this.loading = false;
      },
      error: (err: Error) => {
        this.apiError = err.message;
        this.form.markAllAsTouched();
        this.form.setErrors({ api: true });
        this.loading = false;
      },
    });
  }

  signupWithGoogle() {
    this.authService.loginWithGoogle();
  }
}
