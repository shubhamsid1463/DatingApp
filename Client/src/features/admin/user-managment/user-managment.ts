import { Component, ElementRef, inject, OnInit, signal, ViewChild } from '@angular/core';
import { AdminService } from '../../../core/services/admin-service';
import { User } from '../../../types/user';
import { HtmlParser } from '@angular/compiler';

@Component({
  selector: 'app-user-managment',
  imports: [],
  templateUrl: './user-managment.html',
  styleUrl: './user-managment.css'
})
export class UserManagment implements OnInit {
@ViewChild('rolesModal') rolesModal!: ElementRef<HTMLDialogElement>;
 private adminService = inject(AdminService);
 protected users =signal<User[]>([]);
 protected availableRoles=['Member', 'Moderator', 'Admin'];
 protected selectedUser: User | null = null;
  ngOnInit(): void {
   this.gerUsersWithRoles();
 }
 gerUsersWithRoles() {
  this.adminService.getUsersWithRoles().subscribe({
    next: users => this.users.set(users)
  })
 }
updateUserRole(userid: string, roles: string[]) {
{
    this.adminService.updateUserRoles(userid, roles).subscribe({
      next: roles => {
        const user = this.users().find(x => x.id === userid);
        if (user) {
          const updatedUsers = this.users().map(u => u.id === userid ? {...u, roles: roles} : u);
          this.users.set(updatedUsers);
        }
      }
    });
    
  }
}
openRolesModal(user: User) {
  this.selectedUser = user;
  this.rolesModal.nativeElement.showModal();
}
toggleRole(event: Event, role: string) {
  if (!this.selectedUser) return;
  const roles = this.selectedUser.roles;
  if (roles.includes(role)) {
    this.selectedUser.roles = roles.filter(r => r !== role);
  } else {
    this.selectedUser.roles = [...roles, role];
  } 
}
updateRoles(){
  if(!this.selectedUser) return;
  this.adminService.updateUserRoles(this.selectedUser.id,this.selectedUser.roles).subscribe({
    next :updatedRoles=>{
      this.users.update(users=>users.map(u=>{
        if(u.id===this.selectedUser?.id){
          return {...u, roles: updatedRoles};
        }
        return u;
      }))
      this.rolesModal.nativeElement.close();
    },
    error: error=>console.log(error)
  })
}
}
