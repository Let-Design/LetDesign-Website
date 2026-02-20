import { Component, input, OnChanges, output, Signal, signal } from '@angular/core';
import { TuiIcon } from '@taiga-ui/core';

export interface SelectOption {
  label: string,
  id: string
}

@Component({
  selector: 'app-custom-select',
  imports: [TuiIcon],
  templateUrl: './custom-select.component.html',
})
export class CustomSelectComponent implements OnChanges {
  options = input.required<any>();
  label = input<string>();
  innerLabel = input<string>();
  value = input<string>();
  maxHeight = input<number>();
  displayLabel = input(true);
  isOpen = signal(false);
  resetTrigger = input<Signal<number>>();
  selectedOption = signal<any>({ label: 'Pick an option', value: '' });
  onUpdate = output<SelectOption>();

  ngOnChanges(): void {
    if (this.value()) {
      this.selectedOption.set({
        label: (this.options() as SelectOption[]).find(o => o.id === this.value())?.label,
        value: this.value(),
      });
    } else {
      this.selectedOption.set({ label: 'Pick an option', value: '' });
    }
  }

  onBlur() {
    setTimeout(() => {
      this.isOpen.set(false);
    }, 250);
  }

  reset() {
    this.selectedOption.set({ label: 'Pick an option', value: '' })
  }

  selectOption(label: string, opt: string) {
    this.selectedOption.set({ label, value: opt });
    this.isOpen.set(false);
    this.onUpdate.emit({
      id: opt,
      label: label
    });
  }
}