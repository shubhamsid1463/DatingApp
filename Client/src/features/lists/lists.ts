import { Component, inject, OnInit, signal } from '@angular/core';
import { LikesService } from '../../core/services/likes-service';
import { Member } from '../../types/member';
import { MemberCard } from "../members/member-card/member-card";
import { PaginatedResult } from '../../types/Pagination';
import { Paginator } from "../../shared/paginator/paginator";

@Component({
  selector: 'app-lists',
  imports: [MemberCard, Paginator],
  templateUrl: './lists.html',
  styleUrl: './lists.css'
})
export class Lists implements OnInit {

  private likesService = inject(LikesService);
  protected paginatedResult=signal<PaginatedResult<Member>|null>(null);
  protected predicate='liked';
  protected pageNumber=1;
  protected pageSize=10;
  
  tabs=[
    {label:'Liked',predicate:'liked'},
    {label:'Liked me',predicate:'likedBy'},
    {label:'Mutual',predicate:'mutual'}
  ]
  ngOnInit(): void {
    this.loadLikes();
  }
  setPredicate(predicate:string){
    this.predicate=predicate;
    this.pageNumber=1;
    this.loadLikes();
  }
  loadLikes(){
    this.likesService.getLikes(this.predicate,this.pageNumber,this.pageSize).subscribe({
      next:members=>this.paginatedResult.set(members)
    });
  }
  onPageChanged(event :{pageNumber:number,pageSize:number}){
    this.pageSize=event.pageSize;
    this.pageNumber=event.pageNumber;
    this.loadLikes();
  }
}
