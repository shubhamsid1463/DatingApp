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
    return this.http.post<User>(this.baseUrl+'/register',creds,{withCredentials:true}).pipe(
     tap(
      user=>{
        if(user){
          this.setCurrentUser(user);
          this.startTokenRefreshTimer();
        }
      }
     )
    )
  }
  login (creds:any)
  {
    console.log(creds);
    return this.http.post<User>(this.baseUrl+'account/login',creds,{withCredentials:true}).pipe(
     tap(
      user=>{
        if(user){
          this.setCurrentUser(user);
          this.startTokenRefreshTimer();
        }
      }
     )
    )
    
  }
  logout()
  {
    localStorage.removeItem('filters');
    this.likesService.clearLikeIds();
    this.currentUser.set(null);
  }
  refreshToken()
  {
    return this.http.post<User>(this.baseUrl+'account/refresh-token',{}, {withCredentials:true})
  }
  startTokenRefreshTimer()
  {
    setInterval(()=>{
      this.http.post<User>(this.baseUrl+'account/refresh-token',{},
        {withCredentials:true}).subscribe({
          next: user => this.setCurrentUser(user),
          error: error => console.log('Token refresh failed', error)
        })},
       5*60*1000)
  }
  setCurrentUser(user:User){
    user.roles=this.getRolesFromToken(user);
    this.currentUser.set(user);
    this.likesService.getLikeIds();
  }
  private getRolesFromToken(user:User):string[]
  {
    const payload=user.token.split('.')[1];
    const roles=JSON.parse(atob(payload)).role;
    if(Array.isArray(roles)) return roles;
    else return [roles];
  }
}
