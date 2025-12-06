import { Component, inject, OnInit, signal, ViewChild } from '@angular/core';
import { MemberService } from '../../../core/services/member-service';
import { Member, MemberParams } from '../../../types/member';
import { MemberCard } from "../member-card/member-card";
import { PaginatedResult } from '../../../types/Pagination';
import { Paginator } from "../../../shared/paginator/paginator";
import { FilterModel } from '../filter-model/filter-model';

@Component({
  selector: 'app-member-list',
  imports: [MemberCard, Paginator, FilterModel],
  templateUrl: './member-list.html',
  styleUrl: './member-list.css'
})
export class MemberList implements OnInit {
  @ViewChild('filterModal') modal!:FilterModel;
  protected memberService = inject(MemberService)
  protected paginatedMembers = signal<PaginatedResult<Member>|null>(null);
  memberParams=new MemberParams();
  public updatedMemberParams:MemberParams=new MemberParams();
  constructor() {
    const filters=localStorage.getItem('filters');
    if(filters){
      this.memberParams=JSON.parse(filters);
       this.updatedMemberParams=JSON.parse(filters);
    }
  }
  ngOnInit(): void {
    this.loadMembers();
  }
  loadMembers()
  {
    this.memberService.getMembers(this.memberParams).subscribe({
      next:result=>{
        this.paginatedMembers.set(result)
      }
    })
  }
  onPageChange(event:{pageNumber:number,pageSize:number})
  {
    this.memberParams.pageSize=event.pageSize;
    this.memberParams.pageNumber=event.pageNumber;
    this.loadMembers();
  }
  openFilterModal() {
    this.modal.open();
  }
  onfilterClose(){
    console.log('filter modal closed');
  }
  onfilterChange(params:MemberParams){
    this.memberParams={...params};
    this.updatedMemberParams={...params};
    localStorage.setItem('filters', JSON.stringify(this.memberParams));
    this.loadMembers();
    console.log('modal submitted',params);
    // this.memberParams=params;
    // this.loadMembers();
  }
  resetFilters(){
    this.memberParams=new MemberParams();
    this.updatedMemberParams=new MemberParams();
    localStorage.removeItem('filters');
    this.loadMembers();
  }
  get displayMessage():string{
    const defaultParams=new MemberParams();
    const filters:string[]=[];
    if(this.updatedMemberParams.gender){
      filters.push(`Gender: ${this.updatedMemberParams.gender}s`);
    } else{filters.push(`Gender: All`);}
    if(this.updatedMemberParams.minAge!==defaultParams.minAge){
      filters.push(`Min Age: ${this.updatedMemberParams.minAge}`);
    }
    if(this.updatedMemberParams.maxAge!==defaultParams.maxAge){
      filters.push(`Max Age: ${this.updatedMemberParams.maxAge}`);
    }
    if(this.updatedMemberParams.orderBy!==defaultParams.orderBy){
      filters.push(`Order By: ${this.updatedMemberParams.orderBy}`);
    }
    return filters.join(', ');
  }
}
