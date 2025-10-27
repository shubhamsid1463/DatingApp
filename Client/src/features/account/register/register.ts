import { Component, inject, output, signal } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { RegisterCreads } from '../../../types/user';
import { AccountService } from '../../../app/services/account-service';
import { JsonPipe } from '@angular/common';
import { TextInputs } from "../../../shared/text-inputs/text-inputs";
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule, TextInputs],
  templateUrl: './register.html',
  styleUrl: './register.css'
})
export class Register {
  
  CancelRegisters=output<boolean>();
  protected AccountService=inject(AccountService);
  private router=inject(Router);
  private fb=inject(FormBuilder)
  protected creds={} as RegisterCreads;
  protected credentialForm :FormGroup;
  protected profileForm:FormGroup ;
  public currentStep=signal(1);
  protected validationErrors=signal<string[]>([]);
  constructor(){
    this.credentialForm=this.fb.group({
      email :['' ,[Validators.required, Validators.email]],
      displayName :['' ,Validators.required],
      password :['' ,[Validators.required, Validators.minLength(6),Validators.maxLength(20)]],
      confirmPassword :['' ,[Validators.required, Validators.minLength(6),Validators.maxLength(20),this.matchValues('password')]]
    })
    this.credentialForm.controls['password'].valueChanges.subscribe({
      next:()=>{
        this.credentialForm.controls['confirmPassword'].updateValueAndValidity();
      }
    })
    this.profileForm=this.fb.group({
      gender: ['male',Validators.required],
      dateOfBirth: ['',Validators.required],
      city: ['',Validators.required],
      country: ['',Validators.required]
    })
  }

  initializeForm(){
    

  }
  matchValues(matchTo:string):ValidatorFn{
      return (control:AbstractControl):ValidationErrors |null=>{
        const parent =control.parent ;
        if(!parent)return  null
        const matchValue =parent.get(matchTo)?.value
        return matchValue===control.value?null:{passwordmismatch:true}
    }
}
nextStep(){
  if(this.currentStep()===1 && this.credentialForm.valid){
    this.currentStep.update(current=>current+1);
  }
}
  previousStep(){
    if(this.currentStep()===2){
      this.currentStep.update(current=>current-1);
    }
  }
  register(){
    if(this.credentialForm.valid && this.profileForm.valid){
      const formdata={...this.credentialForm.value,...this.profileForm.value} ;
      console.log(formdata);
      console.log(this.credentialForm.value);
      this.AccountService.Register(formdata).subscribe({
        next:Response=>{
          this.router.navigateByUrl('/members')
          this.cancel();
        },
        error:error=>{console.log(error);
          this.validationErrors.set(error)
        },
        complete:()=>console.log('Register request completed')
      })
    }

    
    }
  cancel(){
    this.CancelRegisters.emit(false);
    console.log('cancelled');
  }
  showPassword(id : string)
  {
    const input = document.querySelector(`input[name="${id}"]`) as HTMLInputElement;
    if (input) {
      input.type = input.type === 'password' ? 'text' : 'password';
    }
  }
}
