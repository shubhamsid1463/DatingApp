import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { RegisterCreads, User } from '../../types/user';
import { tap } from 'rxjs';
import { environment } from '../../environments/environment.development';
import { LikesService } from '../../core/services/likes-service';

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  private  http =inject(HttpClient);
  private  likesService =inject(LikesService);
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
    localStorage.removeItem('filters');
    this.likesService.clearLikeIds();
    this.currentUser.set(null);
  }
  setCurrentUser(user:User){
    localStorage.setItem('user',JSON.stringify(user));
    this.currentUser.set(user);
    this.likesService.getLikeIds();
  }
}
