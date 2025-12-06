import { Component, HostListener, inject, OnDestroy, OnInit, signal, ViewChild } from '@angular/core';
import { EditableMember, Member } from '../../../types/member';
import { DatePipe } from '@angular/common';
import { MemberService } from '../../../core/services/member-service';
import { FormsModule, NgForm } from '@angular/forms';
import { ToastService } from '../../../core/services/toast-service';
import { AccountService } from '../../../app/services/account-service';
import { TimeAgoPipe } from "../../../core/pipes/time-ago-pipe";

@Component({
  selector: 'app-member-profile',
  imports: [ FormsModule, TimeAgoPipe],
  templateUrl: './member-profile.html',
  styleUrl: './member-profile.css'
})
export class MemberProfile implements OnInit, OnDestroy {

  @ViewChild('editForm') editForm?: NgForm;
  @HostListener('window:beforeunload', ['$event']) unloadNotification($event: BeforeUnloadEvent) {
    if (this.editForm?.dirty)
      $event.preventDefault();
  }
  private accountService = inject(AccountService);
  protected memberService = inject(MemberService);
  private toast = inject(ToastService);

  protected editableMember: EditableMember = {
    displayName: '',
    description: '',
    city: '',
    country: ''
  }

  ngOnInit(): void {
    this.editableMember = {
      displayName: this.memberService.member()?.displayName || '',
      description: this.memberService.member()?.description || '',
      city: this.memberService.member()?.city || '',
      country: this.memberService.member()?.country || ''
    }
    console.log(this.memberService.member());
  }
  updateProfile() {
    if (!this.memberService.member()) return;
    const updatedMember = { ...this.memberService.member(), ...this.editForm?.value };
    this.memberService.updateMember(this.editableMember).subscribe(
      {
        next: () => {
          const currentUser = this.accountService.currentUser();
          if (updatedMember.displayName && currentUser && updatedMember.displayName !== currentUser.displayName) {
            this.accountService.setCurrentUser({ ...currentUser, displayName: this.editableMember.displayName });
          }
            this.toast.success('Profile updated successfully');
            this.memberService.editMode.set(false);
            this.memberService.member.set(updatedMember as Member);
            this.editForm?.reset(updatedMember);
          }
      }
    );
  }
  ngOnDestroy(): void {
    if (this.memberService.editMode())
      this.memberService.editMode.set(false);
  }
}
