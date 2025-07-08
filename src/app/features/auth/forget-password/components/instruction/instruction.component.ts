import { NgIf, AsyncPipe } from '@angular/common';
import { Component } from '@angular/core';
import {
  ReactiveFormsModule,
  FormGroup,
  FormControl,
  Validators,
} from '@angular/forms';
import { AuthService } from '@core/services/auth.service';
import { tuiPure } from '@taiga-ui/cdk/utils/miscellaneous';
import {
  TuiTextfield,
  TuiLoader,
  TuiError,
  TuiDurationOptions,
} from '@taiga-ui/core';
import { TuiStepper, TuiFieldErrorPipe } from '@taiga-ui/kit';
import { TuiInputModule, TuiTextfieldControllerModule } from '@taiga-ui/legacy';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-instruction',
  imports: [
    NgIf,
    AsyncPipe,
    ReactiveFormsModule,
    TuiTextfield,
    TuiStepper,
    TuiInputModule,
    TuiLoader,
    TuiTextfieldControllerModule,
    TuiError,
    TuiFieldErrorPipe,
  ],
  templateUrl: './instruction.component.html',
  styleUrl: './instruction.component.scss',
})
export class InstructionComponent {
  apiError: string | null = null;
  loading = false;
  formSubscription!: Subscription;
  form = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
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
    const input = this.form.value;
    this.loading = true;

    this.authService.forgetPassword();
  }

  @tuiPure
  protected getAnimation(duration: number): TuiDurationOptions {
    return { value: '', params: { duration } };
  }
}
