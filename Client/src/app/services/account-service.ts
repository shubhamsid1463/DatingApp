import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { RegisterCreads, User } from '../../types/user';
import { tap } from 'rxjs';
import { environment } from '../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  private  http =inject(HttpClient);
  currentUser=signal<User|null>(null);
  private baseUrl=environment.apiUrl;
  
  Register(creds:RegisterCreads){
    return this.http.post<User>(this.baseUrl+'Account/register',creds).pipe(
     tap(
      user=>{
        if(user){
          this.setCurrentUser(user);
        }
      }
     )
    )
  }
  login (creds:any)
  {
    console.log(creds);
    return this.http.post<User>(this.baseUrl+'account/login',creds).pipe(
     tap(
      user=>{
        if(user){
          this.setCurrentUser(user);
        }
      }
     )
    )
    
  }
  logout()
  {
    localStorage.removeItem('user');
    this.currentUser.set(null);
  }
  setCurrentUser(user:User){
    localStorage.setItem('user',JSON.stringify(user));
    this.currentUser.set(user);
  }
}
