import { inject, Injectable } from '@angular/core';
import { AccountService } from '../../app/services/account-service';
import { of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class InitService {
  private accountService=inject(AccountService);
  init(){
    const userString =localStorage.getItem('user');
    if (!userString){return of(null);}
    const user=JSON.parse(userString);
    this.accountService.setCurrentUser(user);
    return of(null);

  }
}
