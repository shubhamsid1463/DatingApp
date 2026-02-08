import { Component, effect, ElementRef, inject, OnInit, signal, ViewChild, viewChild } from '@angular/core';
import { MessageService } from '../../../core/services/message-service';
import { MemberService } from '../../../core/services/member-service';
import { Message } from '../../../types/message';
import { DatePipe } from '@angular/common';
import { AccountService } from '../../../app/services/account-service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-member-messages',
  imports: [DatePipe,FormsModule],
  templateUrl: './member-messages.html',
  styleUrl: './member-messages.css'
})
export class MemberMessages implements  OnInit {
  @ViewChild('messageEndRef') messageEndRef!:ElementRef;
private messageService=inject(MessageService);
protected accountService=inject(AccountService);
private memberService=inject(MemberService);
protected messages=signal<Message[]>([]);
protected messageContent='';
constructor(){
  effect(()=>{
    const currentMessages=this.messages();
    if(currentMessages.length>0)
    {
      this.scrollToBottom();

    }
  });
}
  ngOnInit() :void{
    this.loadMessages();
  }
  private loadMessages()
  {
    const memberId=this.memberService.member()?.id;
    if(memberId){
      this.messageService.getMessageThread(memberId!).subscribe({
        next:messages=>
        { this.messages.set(messages); }
      });
    }
  }
  sendMessage(content:string)
  {
    const memberId=this.memberService.member()?.id;
    if(!memberId){
      return;
    }
    if(memberId){
      this.messageService.sendMessage(memberId,content).subscribe({
        next:message=>
        { 
          this.messages.update(messages=>[...messages,message]);
        }
      });
      this.messageContent='';
    }
  }
  scrollToBottom(){
    if(!this.messageEndRef){
      return;
    }
    try{
      setTimeout(() => {
        this.messageEndRef.nativeElement.scrollIntoView({behavior:'smooth'});
      });
    }catch(err){} 
  }
}