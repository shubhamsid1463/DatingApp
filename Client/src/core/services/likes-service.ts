import { inject, Injectable, signal } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Member } from '../../types/member';
import { PaginatedResult } from '../../types/Pagination';

@Injectable({
  providedIn: 'root'
})
export class LikesService {
  private baseUrl=environment.apiUrl;
  private http =inject(HttpClient);
  likeIds=signal<string[]>([]);
  toggleLike(targetMemberId:string)
  {
    return this.http.post(`${this.baseUrl}likes/${targetMemberId}`,{});
  }
  getLikes(predicate:string,pageNumber:number, pageSize:number)
  {
    let params=new HttpParams();
    params=params.append('predicate',predicate);
    params=params.append('pageNumber',pageNumber.toString());
    params=params.append('pageSize',pageSize.toString());
    return this.http.get<PaginatedResult<Member>>(`${this.baseUrl}likes`,{params});
  }
  getLikeIds()
  {
    return this.http.get<string[]>(`${this.baseUrl}likes/list`).subscribe({
      next:(ids)=>{
        this.likeIds.set(ids);
      }
    });
  }
  clearLikeIds()
  {
    this.likeIds.set([]);
  }
}