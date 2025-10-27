import { Component, EventEmitter, inject, input, OnInit, Output, signal } from '@angular/core';
import { MemberService } from '../../core/services/member-service';
import { Photo } from '../../types/member';

@Component({
  selector: 'app-star-button',
  imports: [],
  templateUrl: './star-button.html',
  styleUrl: './star-button.css'
})
export class StarButton implements OnInit {
  
   disabled =  input<boolean>(false) ;
   @Output() clicked = new EventEmitter<Event>();
  protected memberService = inject(MemberService);
  ngOnInit(): void {

  }
  onButtonClick(event: Event) {
    if (!this.disabled) {
      this.clicked.emit(event);
    }
  }
}
