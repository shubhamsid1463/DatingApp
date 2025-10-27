import { Component, inject, input, Self } from '@angular/core';
import { ControlValueAccessor, FormControl, NgControl, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-text-inputs',
  imports: [ReactiveFormsModule],
  templateUrl: './text-inputs.html',
  styleUrl: './text-inputs.css'
})
export class TextInputs implements ControlValueAccessor {
  lable =input<string>()
  type =input<string>('text') 
  public ngControl =inject(NgControl);
  constructor() {
    this.ngControl.valueAccessor=this;
  }
  writeValue(value: any): void {
  }
  registerOnChange(fn: any): void {
  }
  registerOnTouched(fn: any): void {
  }
  get control():FormControl{
    return this.ngControl.control as FormControl;
  }
  showPassword(id : string)
  {
    const input = document.querySelector(`input[name="${id}"]`) as HTMLInputElement;
    if (input) {
      input.type = input.type === 'password' ? 'text' : 'password';
    }
  }
}
