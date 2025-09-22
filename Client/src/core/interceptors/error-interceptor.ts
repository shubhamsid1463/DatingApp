import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError } from 'rxjs';
import { ToastService } from '../services/toast-service';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const toast = inject(ToastService);
  const router = inject(Router);
  return next(req).pipe(
    catchError(error => {
      if (error) {
        switch (error.status) {
          case 400:
            if (error.error.errors) {
              const modalStateErrors = [];
              for (const key in error.error.errors) {
                if (error.error.errors[key]) {
                  modalStateErrors.push(error.error.errors[key]);
                }
              }
              throw modalStateErrors.flat();
            }
            else {
              toast.error(error.error + ' ' + error.status);
            }
            break;
          case 401:
            toast.error("Unauthorized");
            break;
          case 404:
            router.navigateByUrl('/not-found');
            break;
          case 500:
            router.navigateByUrl('/server-error', { state: { error: error.error } });
            break;
          default:
            toast.error('Something unexpected went wrong');
            console.log(error);
            break;
        }
      }
      throw error;
    })
  )
};
