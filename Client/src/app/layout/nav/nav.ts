import { Component, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AccountService } from '../../services/account-service';
import { Router, RouterLink ,RouterLinkActive} from '@angular/router';
import { ToastService } from '../../../core/services/toast-service';
import { themes } from '../thems';
import { BusyService } from '../../../core/services/busy-service';
import { HasRole } from '../../../shared/directives/has-role';
@Component({
  selector: 'app-nav',
  imports: [FormsModule, RouterLink, RouterLinkActive,HasRole],
  templateUrl: './nav.html',
  styleUrl: './nav.css'
})

export class Nav  implements OnInit{
  protected AccountService=inject(AccountService);
  protected busyService=inject(BusyService);
  private router=inject(Router);
  private toast =inject(ToastService);
  protected creds: { email: string; password: string } = { email: '', password: '' };
  protected selectedtheme=signal<string>(localStorage.getItem('theme')||'light')
  protected theme=themes;
  
  ngOnInit(): void {
    document.documentElement.setAttribute('data-theme',this.selectedtheme())
  }
  handleSeletedTheme(theme :string)
  {
    this.selectedtheme.set(theme)
    localStorage.setItem('theme',theme)
    document.documentElement.setAttribute('data-theme',theme)
    const elem=document.activeElement as HTMLDivElement;
    if(elem)elem.blur();
  }
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
