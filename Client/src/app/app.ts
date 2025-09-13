import { HttpClient } from '@angular/common/http';
import { Component, inject, OnInit, signal } from '@angular/core';
import { JsonPipe } from '@angular/common';
import { Nav } from './layout/nav/nav';
import { AccountService } from './services/account-service';
import { Home } from '../features/home/home';
import { User } from '../types/user';

@Component({
  selector: 'app-root',
  imports: [Nav,Home],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {
  
  private http = inject(HttpClient);
  protected readonly title = 'Dating App';
  protected members = signal<User[]>([]);
  protected accountService=inject(AccountService);
  ngOnInit(): void {
    this.http.get<User[]>('https://localhost:5001/api/Members').subscribe({
      next: (data) =>  this.members.set(data ),
      error: (error) => console.log(error),
      complete: () => console.log('Request complete')
    });
    this.SetMembers()
    
  }
  SetMembers(){
    var UserString=localStorage.getItem('user');
    if (!UserString)
      return;
    else {
      const User=JSON.parse(UserString);
      this.accountService.currentUser.set(User);
    }
  }

}
