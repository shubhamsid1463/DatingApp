import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { AccountService } from '../../app/services/account-service';
import { ToastService } from '../services/toast-service';

export const adminGuard: CanActivateFn = (route, state) => {
  const accountService = inject(AccountService);
  const toast = inject(ToastService);
  if (accountService.currentUser()?.roles.includes('Admin')||accountService.currentUser()?.roles.includes('Moderator')) {
    return true;
  }
  else {
    toast.error("You don't have permission to access this page");
    return false;
  }
};
