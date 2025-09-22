import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AccountService } from '../../services/account-service';
import { Router, RouterLink ,RouterLinkActive} from '@angular/router';
import { ToastService } from '../../../core/services/toast-service';
@Component({
  selector: 'app-nav',
  imports: [FormsModule, RouterLink, RouterLinkActive],
  templateUrl: './nav.html',
  styleUrl: './nav.css'
})

export class Nav {
  protected AccountService=inject(AccountService);
  private router=inject(Router);
  private toast =inject(ToastService);
  protected creds: { email: string; password: string } = { email: '', password: '' };
  Login(){
    this.AccountService.login(this.creds).subscribe({
      next:()=>{ this.router.navigateByUrl('/members');},
      error:error=>{
        this.toast.error(error.error);
      },
      complete:()=>{console.log('Login request completed');this.toast.success("Success");}
    })
  }
  logout(){
    this.AccountService.logout();
    this.creds={email:'',password:''};
    this.router.navigateByUrl('/');
  }
}
