import { isPlatformBrowser } from '@angular/common';
import { inject, PLATFORM_ID } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const userAlreadyLoggedGuard: CanActivateFn = (route, state) => {
  const _PLATFORM_ID = inject(PLATFORM_ID);
  const _Router = inject(Router);

  if (isPlatformBrowser(_PLATFORM_ID)) {
    if (!localStorage.getItem('userToken')) {
      return true;
    }
    else {
      _Router.navigate(['/home']);
      return false;
    }
  }
  else {
    return false
  }
};
