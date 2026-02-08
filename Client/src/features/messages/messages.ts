import { Component, inject, OnInit, signal } from '@angular/core';
import { MessageService } from '../../core/services/message-service';
import { PaginatedResult } from '../../types/Pagination';
import { Message } from '../../types/message';
import { Paginator } from "../../shared/paginator/paginator";
import { DatePipe } from '@angular/common';
import { RouterLink } from "@angular/router";

@Component({
  selector: 'app-messages',
  imports: [Paginator, DatePipe, RouterLink],
  templateUrl: './messages.html',
  styleUrl: './messages.css'
})
export class Messages implements OnInit {

private messageService=inject(MessageService);
protected container='Inbox';
protected pageNumber=1;
protected pageSize=5;
protected paginatedMessages=signal<PaginatedResult<Message>|null>(null);

protected tabs=[
    {label:'Inbox',value:'Inbox'},
    {label:'Outbox',value:'Outbox'},
    {label:'Unread',value:'Unread'}
]
  ngOnInit(): void {
    this.loadMessages();
  }
  loadMessages(){
    this.messageService.getMessages(this.container,this.pageNumber,this.pageSize).subscribe({
      next:response=>{
        this.paginatedMessages.set(response);
      }
    });
  }
  get isInbox(){
    return this.container==='Inbox';
  }
  setContainer(container:string){
    this.container=container;
    this.pageNumber=1;
    this.loadMessages();
  }
  onPageChange($event: { pageNumber: number; pageSize: number; }) {
this.pageSize=$event.pageSize;
    this.pageNumber=$event.pageNumber;
    this.loadMessages();
}
deleteMessage(messageId:string){
  event?.stopPropagation();
  this.messageService.deleteMessage(messageId).subscribe({
    next:()=>{  
      this.paginatedMessages.update(current=>{
        if(!current) return current;
        const updatedItems=current.items.filter(m=>m.id!==messageId);
        return {
          ...current,
          items:updatedItems,
          metadata:{
            ...current.metadata,
            totalCount:current.metadata.totalCount-1
          }
        };
      })
    }
    });
  }
}
