import { AsyncPipe, NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnDestroy } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  TuiDurationOptions,
  TuiError,
  TuiIcon,
  TuiLoader,
  tuiScaleIn,
  TuiTextfield,
} from '@taiga-ui/core';
import { TuiInputModule, TuiTextfieldControllerModule } from '@taiga-ui/legacy';
import {
  TuiFieldErrorPipe,
  TuiPassword,
  tuiValidationErrorsProvider,
} from '@taiga-ui/kit';
import { AuthService } from '@core/services/auth.service';
import { LoginInput } from '@models/auth.types';
import { Subscription } from 'rxjs';
import { tuiPure } from '@taiga-ui/cdk/utils/miscellaneous';
import { ErrorMessages } from '@shared/utils/error-messages';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [
    NgIf,
    RouterLink,
    AsyncPipe,
    ReactiveFormsModule,
    TuiTextfield,
    TuiInputModule,
    TuiIcon,
    TuiLoader,
    TuiPassword,
    TuiTextfieldControllerModule,
    TuiError,
    TuiFieldErrorPipe,
  ],
  templateUrl: './login.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [tuiValidationErrorsProvider(ErrorMessages)],
  animations: [tuiScaleIn],
})
export class LoginComponent implements OnDestroy {
  apiError: string | null = null;
  loading = false;
  formSubscription!: Subscription;
  form = new FormGroup({
    username: new FormControl('', Validators.required),
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
    console.log('Submit: ', this.form.value);
    const input = this.form.value as LoginInput;
    this.loading = true;

    this.authService.login(input).subscribe({
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

  loginWithGoogle() {
    this.authService.loginWithGoogle();
  }

  @tuiPure
  protected getAnimation(duration: number): TuiDurationOptions {
    return { value: '', params: { duration } };
  }
}
