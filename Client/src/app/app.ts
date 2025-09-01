import { HttpClient } from '@angular/common/http';
import { Component, inject, OnInit, signal } from '@angular/core';
import { JsonPipe } from '@angular/common';

@Component({
  selector: 'app-root',
  imports: [],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {
  private http = inject(HttpClient);
  protected readonly title = 'Dating App';
  protected members = signal<any>([]);
  ngOnInit(): void {
    this.http.get('https://localhost:5001/api/Members').subscribe({
      next: (data) =>  this.members.set(data ),
      error: (error) => console.log(error),
      complete: () => console.log('Request complete')
    });
  }

}
