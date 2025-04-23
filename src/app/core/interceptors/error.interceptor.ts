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
      // Handle authentication-related errors
      // if (
      //   error.status === HttpStatusCode.Unauthorized ||
      //   error.status === HttpStatusCode.Forbidden ||
      //   (error.error && error.error.type === 'auth_error')
      // ) {
        // Logout the user
        // authService.logout();
      // }

      return throwError(() => error);
    })
  );
};
