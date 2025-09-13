import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AccountService } from '../../services/account-service';
@Component({
  selector: 'app-nav',
  imports: [FormsModule],
  templateUrl: './nav.html',
  styleUrl: './nav.css'
})
export class Nav {
  protected AccountService=inject(AccountService);
  protected creds: { email: string; password: string } = { email: '', password: '' };
  Login(){
    this.AccountService.login(this.creds).subscribe({
      next:Response=>{console.log(Response);this.creds={email:'',password:''}},
      error:error=>alert(error.error),
      complete:()=>console.log('Login request completed')
    })
  }
  logout(){
    this.AccountService.logout();
    this.creds={email:'',password:''};
  }
}
