import { Component } from '@angular/core';
import { RouterOutlet, Router, RouterModule, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { AuthService } from '../../../core/http-services/auth.service';

@Component({
  selector: 'app-web-layout',
  standalone: true,
  imports: [RouterOutlet, CommonModule, RouterModule, RouterLink],
  template: `
    <div class="d-flex flex-column min-vh-100" dir="rtl">
      <!-- Header -->
      <header class="bg-white shadow-sm">
        <div class="container py-3">
          <nav class="navbar navbar-expand navbar-light">
            <div class="d-flex align-items-center me-3">
              <h1 class="h5 mb-0 me-3">مدیریت مسابقات</h1>
            </div>
            <div class="collapse navbar-collapse">
              <ul class="navbar-nav me-auto mb-0">
                <li class="nav-item">
                  <a class="nav-link" routerLink="/">خانه</a>
                </li>
                <li class="nav-item">
                  <a class="nav-link" routerLink="/competitions">مسابقات</a>
                </li>
                <li class="nav-item">
                  <a class="nav-link" [routerLink]="['/register']" [queryParams]="{ returnUrl: getCurrentUrl() }">ثبت نام</a>
                </li>
                <li class="nav-item" *ngIf="isAuthenticated$ | async">
                  <a class="nav-link" routerLink="/profile">پروفایل</a>
                </li>
              </ul>
              <ul class="navbar-nav">
                <li class="nav-item" *ngIf="!(isAuthenticated$ | async)">
                  <a class="nav-link" [routerLink]="['/login']" [queryParams]="{ returnUrl: getCurrentUrl() }">ورود</a>
                </li>
                <li class="nav-item" *ngIf="isAuthenticated$ | async">
                  <button class="btn nav-link border-0 bg-transparent" (click)="logout()">خروج</button>
                </li>
              </ul>
            </div>
          </nav>
        </div>
      </header>

      <!-- Main Content -->
      <main class="flex-grow-1 py-4">
        <router-outlet></router-outlet>
      </main>

      <!-- Footer -->
      <footer class="bg-dark text-white py-3 text-center">
        <div class="container">
          <p class="mb-0">&copy; 2024 مدیریت مسابقات. تمامی حقوق محفوظ است.</p>
        </div>
      </footer>
    </div>
  `
})
export class WebLayoutComponent {
  isAuthenticated$: Observable<boolean>;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {
    this.isAuthenticated$ = this.authService.currentUser$.pipe(
      map(user => !!user)
    );
  }

  logout() {
    this.authService.logout();
    // After logout, redirect to login page with the current URL as return URL
    const currentUrl = this.getCurrentUrl();
    this.router.navigate(['/login'], {
      queryParams: { returnUrl: currentUrl }
    });
  }

  getCurrentUrl(): string {
    return encodeURIComponent(this.router.url);
  }
}
