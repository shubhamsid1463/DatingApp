import { Component, EventEmitter, inject, input, Output, output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RegisterCreads, User } from '../../../types/user';
import { AccountService } from '../../../app/services/account-service';

@Component({
  selector: 'app-register',
  imports: [FormsModule],
  templateUrl: './register.html',
  styleUrl: './register.css'
})
export class Register {
  CancelRegisters=output<boolean>();
  protected AccountService=inject(AccountService);
  protected creds={} as RegisterCreads
  register(){
    this.AccountService.Register(this.creds).subscribe({
      next:Response=>{console.log(Response);this.creds={email:'',displayName:'',password:''};this.cancel()},
      error:error=>alert(error.error),
      complete:()=>console.log('Register request completed')
    })
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
