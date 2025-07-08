import { ValidatorFn, AbstractControl, ValidationErrors } from '@angular/forms';
import { TuiValidationError } from '@taiga-ui/cdk/classes';

export function apiErrorValidator(error: any): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null =>
    error
      ? {
          api: new TuiValidationError(error),
        }
      : null;
}
