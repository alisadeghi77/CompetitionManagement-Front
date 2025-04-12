import { Component } from '@angular/core';
import { RouterOutlet, Router, RouterModule, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { map } from 'rxjs/operators';
import { AuthService } from '../../core/http-services/auth.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-web-layout',
  standalone: true,
  imports: [RouterOutlet, CommonModule, RouterModule, RouterLink],
  template: `
    <div class="web-layout" dir="rtl">
      <!-- Header -->
      <header class="header">
        <div class="container">
          <div class="logo">
            <h1>مدیریت مسابقات</h1>
            <nav>
              <ul>
              <li><a routerLink="/">خانه</a></li>
              <li><a routerLink="/competitions">مسابقات</a></li>
              <li><a [routerLink]="['/register']" [queryParams]="{ returnUrl: getCurrentUrl() }">ثبت نام</a></li>
              <li *ngIf="isAuthenticated$ | async">
                <a routerLink="/profile">پروفایل</a>
              </li>
            </ul>
            </nav>
          </div>
         <nav>
          <ul>
               <li *ngIf="!(isAuthenticated$ | async)">
                <a [routerLink]="['/login']" [queryParams]="{ returnUrl: getCurrentUrl() }">ورود</a>
              </li>
              <li *ngIf="isAuthenticated$ | async">
                <button (click)="logout()">خروج</button>
              </li>
            </ul>
          </nav>
        </div>
      </header>

      <!-- Main Content -->
      <main>
        <router-outlet></router-outlet>
      </main>

      <!-- Footer -->
      <footer class="footer">
        <div class="container">
          <p>&copy; 2024 مدیریت مسابقات. تمامی حقوق محفوظ است.</p>
        </div>
      </footer>
    </div>
  `,
  styles: [`
    .web-layout {
      display: flex;
      flex-direction: column;
      min-height: 100vh;
    }

    .header {
      background: #fff;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      padding: 1rem 0;
    }

    .container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 1rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .logo{
        display:flex
    }

    .logo h1 {
      margin: 0;
      margin-left:16px;
      font-size: 1.5rem;
      font-family: 'IRANSans', sans-serif;
    }

    nav ul {
      display: flex;
      list-style: none;
      margin: 0;
      padding: 0;
      gap: 1rem;
    }

    nav ul li a {
      text-decoration: none;
      color: #333;
      font-family: 'IRANSans', sans-serif;
    }

    nav ul li button {
      background: none;
      border: none;
      color: #333;
      cursor: pointer;
      font-family: 'IRANSans', sans-serif;
      padding: 0;
      font-size: 1rem;
    }

    main {
      flex: 1;
      padding: 2rem 0;
    }

    .footer {
      background: #333;
      color: white;
      padding: 1rem 0;
      text-align: center;
      font-family: 'IRANSans', sans-serif;
    }
  `]
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
