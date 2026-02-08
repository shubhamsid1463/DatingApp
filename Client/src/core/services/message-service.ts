import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { HttpClient, HttpParams } from '@angular/common/http';
import { PaginatedResult } from '../../types/Pagination';
import { Message } from '../../types/message';

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  private baseUrl = environment.apiUrl;
  private http =inject(HttpClient);
  getMessages(container:string,pageNumber:number,pageSize:number)
  {
    let params= new HttpParams();
    params=params.append('Container',container);
    params=params.append('pageNumber',pageNumber);  
    params=params.append('pageSize',pageSize);
    return this.http.get<PaginatedResult<Message>>(this.baseUrl+'messages',{params});
  }
  getMessageThread(membereId:string)
  {
    return this.http.get<Message[]>(this.baseUrl+'messages/thread/'+membereId);
  }
  sendMessage(memberId:string,content:string)
  {
    return this.http.post<Message>(this.baseUrl+'messages/createMessage',{recipientId:memberId,content});
  }
  deleteMessage(messageId:string)
  {
    return this.http.delete(this.baseUrl+'messages/Delete/'+messageId);
  }
}