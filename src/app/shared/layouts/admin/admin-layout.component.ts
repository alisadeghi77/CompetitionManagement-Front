import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { AuthService } from '../../../core/http-services/auth.service';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [RouterOutlet, CommonModule],
  template: `
    <div class="admin-layout">
      <!-- Sidebar -->
      <div class="sidebar">
        <div class="logo">
          <h2>Admin Panel</h2>
        </div>
        <nav>
          <ul>
            <li><a routerLink="/admin/dashboard">Dashboard</a></li>
            <li><a routerLink="/admin/competitions">Competitions</a></li>
            <li><a routerLink="/admin/participants">Participants</a></li>
            <li><a routerLink="/admin/matches">Matches</a></li>
            <li><a routerLink="/admin/settings">Settings</a></li>
          </ul>
        </nav>
      </div>

      <!-- Main Content -->
      <div class="main-content">
        <!-- Top Navigation -->
        <header class="top-nav">
          <div class="user-info">
            <span>{{ currentUser$ | async | json }}</span>
            <button (click)="logout()">Logout</button>
          </div>
        </header>

        <!-- Page Content -->
        <main>
          <router-outlet></router-outlet>
        </main>
      </div>
    </div>
  `,
  styles: [`
    .admin-layout {
      display: flex;
      min-height: 100vh;
    }

    .sidebar {
      width: 250px;
      background: #2c3e50;
      color: white;
      padding: 1rem;
    }

    .logo {
      padding: 1rem;
      border-bottom: 1px solid rgba(255,255,255,0.1);
    }

    nav ul {
      list-style: none;
      padding: 0;
    }

    nav ul li {
      padding: 0.5rem 1rem;
    }

    nav ul li a {
      color: white;
      text-decoration: none;
    }

    .main-content {
      flex: 1;
      background: #f5f6fa;
    }

    .top-nav {
      background: white;
      padding: 1rem;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }

    .user-info {
      display: flex;
      justify-content: flex-end;
      align-items: center;
      gap: 1rem;
    }

    main {
      padding: 2rem;
    }
  `]
})
export class AdminLayoutComponent {
  currentUser$: Observable<any>;

  constructor(private authService: AuthService) {
    this.currentUser$ = this.authService.currentUser$;
  }

  logout() {
    this.authService.logout();
  }
}
