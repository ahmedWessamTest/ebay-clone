import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { catchError, throwError } from 'rxjs';

export const errorsInterceptor: HttpInterceptorFn = (req, next) => {
  const _ToastrService = inject(ToastrService);
  return next(req).pipe(catchError((err: HttpErrorResponse) => {
    if (!req.url.includes('login') && !req.url.includes('register') && !req.url.includes('forgot'))
      _ToastrService.error(err.error.message, "eBay");
    console.error('Error in: ', err);
    return throwError(() => err)
  }));
};
