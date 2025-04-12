import { HttpInterceptorFn, HttpStatusCode } from "@angular/common/http";
import { inject } from "@angular/core";
import { Router } from "@angular/router";
import { catchError, throwError } from "rxjs";
import { AuthService } from "../http-services/auth.service";

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const authService = inject(AuthService);

  return next(req).pipe(
    catchError(error => {
      // Handle 401 Unauthorized errors
      if (error.status === HttpStatusCode.Unauthorized) {
        // Logout the user
        authService.logout();

        // Get current URL for returnUrl
        const currentUrl = window.location.pathname;
        const encodedReturnUrl = encodeURIComponent(currentUrl);

        // Redirect to login page with returnUrl
        router.navigate(['/login'], {
          queryParams: { returnUrl: encodedReturnUrl }
        });
      }

      return throwError(() => error);
    })
  );
};
