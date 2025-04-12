import { inject } from '@angular/core';
import { Router, UrlTree } from '@angular/router';
import { AuthService } from '../http-services/auth.service';
import { map, take } from 'rxjs/operators';

export const authGuard = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.currentUser$.pipe(
    take(1),
    map(user => {
      if (user) {
        return true;
      }

      // Encode the current URL to use as returnUrl
      const currentUrl = window.location.pathname;
      console.log(currentUrl)
      const encodedReturnUrl = encodeURIComponent(currentUrl);

      // Redirect to login with returnUrl
      return router.createUrlTree(['/login'], {
        queryParams: { returnUrl: encodedReturnUrl }
      });
    })
  );
};
