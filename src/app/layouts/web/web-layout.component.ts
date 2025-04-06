import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { map } from 'rxjs/operators';
import { AuthService } from '../../core/http-services/auth.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-web-layout',
  standalone: true,
  imports: [RouterOutlet, CommonModule],
  template: `
    <div class="web-layout">
      <!-- Header -->
      <header class="header">
        <div class="container">
          <div class="logo">
            <h1>Competition Management</h1>
          </div>
          <nav>
            <ul>
              <li><a routerLink="/">Home</a></li>
              <li><a routerLink="/competitions">Competitions</a></li>
              <li><a routerLink="/register">Register</a></li>
              <li *ngIf="isAuthenticated$ | async">
                <a routerLink="/profile">Profile</a>
              </li>
              <li *ngIf="!(isAuthenticated$ | async)">
                <a routerLink="/login">Login</a>
              </li>
              <li *ngIf="isAuthenticated$ | async">
                <button (click)="logout()">Logout</button>
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
          <p>&copy; 2024 Competition Management. All rights reserved.</p>
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

    .logo h1 {
      margin: 0;
      font-size: 1.5rem;
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
    }
  `]
})
export class WebLayoutComponent {

  isAuthenticated$: Observable<boolean>;

  constructor(private authService: AuthService) {
    this.isAuthenticated$ = this.authService.currentUser$.pipe(
      map(user => !!user)
    );
  }


  logout() {
    this.authService.logout();
  }
}
