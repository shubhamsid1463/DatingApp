import { Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { MemberService } from '../../../core/services/member-service';
import { ActivatedRoute, Router } from '@angular/router';
import { Member, Photo } from '../../../types/member';
import {ImageUpload} from '../../../shared/image-upload/image-upload';
import { AccountService } from '../../../app/services/account-service';
import { User } from '../../../types/user';
import { StarButton } from "../../../shared/star-button/star-button";
@Component({
  selector: 'app-member-photos',
  imports: [ImageUpload],
  templateUrl: './member-photos.html',
  styleUrl: './member-photos.css'
})
export class MemberPhotos implements OnInit,OnDestroy{
protected accountService=inject(AccountService);
protected memberService=inject(MemberService);
private route =inject(ActivatedRoute);
protected photos=signal<Photo[]>([]);
protected loading=signal(false);
  ngOnInit(): void {
    const memberId=this.route.parent?.snapshot.paramMap.get('id')
      if(memberId){
          this.memberService.getMemberPhotos(memberId).subscribe({
            next: (photos) => this.photos.set(photos),
            error: (error) => console.error('Error fetching photos:', error)
        });
    } 
 }
get photoMocks(){
  return Array.from({length:20},(_,i)=>({
    url:'/user.png'
  }))
}
onUploadImage(photo:File){
  this.loading.set(true);
  this.memberService.uploadPhoto(photo).subscribe({
    next: (response) => {
      console.log('Photo uploaded successfully:', response);
      this.loading.set(false);
      this.photos.update(photos => [...photos, response]);
      this.memberService.editMode.set(false)
      if(!this.memberService.member()?.imaageUrl)
      {
        this.setMainPhoto(response )
      }
    },
    error: (error) => {
      console.error('Error uploading photo:', error);
      this.loading.set(false);
    }
  });
}
  ngOnDestroy(): void {
    this.loading.set(false);
    this.photos.set([]);
    this.memberService.editMode.set(false);
  }
  setMainPhoto(photo:Photo){
    confirm('No rows');
    this.memberService.setMainPhoto(photo).subscribe({
      next:()=>{
        this.setMainLocalPhoto(photo)
      }
    })
  }
  deletePhoto(photoid:number){
    this.memberService.deletePhoto(photoid).subscribe({
      next:()=>{
        this.photos.update(photos=>photos.filter(p=>p.id!==photoid));
      }
    })
  }
  private setMainLocalPhoto(photo :Photo)
  {
    const currentUser=this.accountService.currentUser();
    if(currentUser)currentUser.imageUrl=photo.url;
    this.accountService.setCurrentUser(currentUser as User);
    this.memberService.member.update(member=>({
      ...member,imaageUrl:photo.url
    })as Member);
  }
    
}

