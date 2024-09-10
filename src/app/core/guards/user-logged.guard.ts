import { isPlatformBrowser } from '@angular/common';
import { inject, PLATFORM_ID } from '@angular/core';
import { PlatformConfig } from '@angular/platform-server';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { IUserData } from '../interfaces/iuser-data';

export const userLoggedGuard: CanActivateFn = (route, state) => {
  const _PLATFORM_ID: PlatformConfig = inject(PLATFORM_ID);
  const _Router = inject(Router);
  const _AuthService = inject(AuthService);
  if (isPlatformBrowser(_PLATFORM_ID)) {
    const userToken: string | null = localStorage.getItem('userToken');

    if (userToken === 'undefined') {
      _AuthService.logOut();
      return false
    }

    if (userToken) {
      return true
    }
    else {
      _Router.navigate(['/login']);
      return false
    }
  } else {
    return false
  }
};
