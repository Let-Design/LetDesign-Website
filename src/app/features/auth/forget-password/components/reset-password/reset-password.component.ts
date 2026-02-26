import { NgIf, AsyncPipe } from '@angular/common';
import { Component } from '@angular/core';
import {
  ReactiveFormsModule,
  FormGroup,
  FormControl,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '@core/services/auth/auth.service';
import { tuiPure } from '@taiga-ui/cdk/utils/miscellaneous';
import {
  TuiTextfield,
  TuiLoader,
  TuiError,
  TuiDurationOptions,
  TuiIcon,
} from '@taiga-ui/core';
import { TuiStepper, TuiFieldErrorPipe, TuiPassword } from '@taiga-ui/kit';
import { TuiInputModule, TuiTextfieldControllerModule } from '@taiga-ui/legacy';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-reset-password',
  imports: [
    NgIf,
    AsyncPipe,
    ReactiveFormsModule,
    TuiTextfield,
    TuiStepper,
    TuiInputModule,
    TuiPassword,
    TuiLoader,
    TuiIcon,
    TuiTextfieldControllerModule,
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

  @tuiPure
  protected getAnimation(duration: number): TuiDurationOptions {
    return { value: '', params: { duration } };
  }
}
