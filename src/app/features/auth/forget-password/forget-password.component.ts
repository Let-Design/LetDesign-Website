import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { TuiTextfield, tuiScaleIn } from '@taiga-ui/core';
import { tuiValidationErrorsProvider, TuiStepper } from '@taiga-ui/kit';
import { ErrorMessages } from '@shared/utils/error-messages';
import { RouterLink } from '@angular/router';
import { InstructionComponent } from './components/instruction/instruction.component';
import { ConfirmationComponent } from './components/confirmation/confirmation.component';
import { ResetPasswordComponent } from './components/reset-password/reset-password.component';

@Component({
  selector: 'app-forget-password',
  imports: [
    RouterLink,
    ReactiveFormsModule,
    TuiTextfield,
    TuiStepper,
    InstructionComponent,
    ConfirmationComponent,
    ResetPasswordComponent,
  ],
  templateUrl: './forget-password.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [tuiValidationErrorsProvider(ErrorMessages)],
  animations: [tuiScaleIn],
})
export class ForgetPasswordComponent {
  step = 0;

  constructor() {}
}
