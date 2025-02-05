import { ChangeDetectionStrategy, Component } from '@angular/core';
import {
  FormGroup,
  FormControl,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { TuiIcon, TuiTextfield } from '@taiga-ui/core';
import { TuiInputModule, TuiTextfieldControllerModule } from '@taiga-ui/legacy';
import { TuiPassword } from '@taiga-ui/kit';

@Component({
  selector: 'app-register',
  imports: [
    ReactiveFormsModule,
    TuiTextfield,
    TuiInputModule,
    TuiIcon,
    TuiPassword,
    TuiTextfieldControllerModule,
  ],
  templateUrl: './register.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
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

  submit() {
    console.log('Submit: ', this.form.value);
  }
}
