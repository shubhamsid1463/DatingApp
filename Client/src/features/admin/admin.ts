import { Component, inject } from '@angular/core';
import { AccountService } from '../../app/services/account-service';
import { UserManagment } from "./user-managment/user-managment";
import { PhotoManagment } from "./photo-managment/photo-managment";

@Component({
  selector: 'app-admin',
  imports: [UserManagment, PhotoManagment],
  templateUrl: './admin.html',
  styleUrl: './admin.css'
})
export class Admin {
protected accountService=inject(AccountService);
activeTab: string = 'photos';
tabs = [
  {label: 'Photos', value: 'photos'},
  {label: 'User Managment', value: 'roles'}
  
];
switchTab(tab: string) {
  this.activeTab = tab;
}
}
