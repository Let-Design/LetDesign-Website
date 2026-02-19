import { AsyncPipe } from '@angular/common';
import { Component } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '@core/services/auth/auth.service';
import { TuiAnimated } from '@taiga-ui/cdk/directives/animated';
import { TuiTextfield, TuiLoader, TuiError, TuiIcon } from '@taiga-ui/core';
import { TuiStepper, TuiFieldErrorPipe, TuiPassword } from '@taiga-ui/kit';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-reset-password',
  imports: [
    AsyncPipe,
    ReactiveFormsModule,
    TuiTextfield,
    TuiStepper,
    TuiPassword,
    TuiLoader,
    TuiAnimated,
    TuiIcon,
    TuiError,
    TuiFieldErrorPipe,
  ],
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.scss',
})
export class ResetPasswordComponent {
  apiError: string | null = null;
  loading = false;
  formSubscription!: Subscription;
  form = new FormGroup({
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(8),
    ]),
    confirmPassword: new FormControl('', [
      Validators.required,
      Validators.minLength(8),
    ]),
  });

  constructor(private authService: AuthService, private router: Router) {
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
    const input = this.form.value;
    this.loading = true;

    this.authService.forgetPassword();
  }
}
