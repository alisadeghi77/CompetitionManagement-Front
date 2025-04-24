import { Component } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { AuthService } from '../../../core/http-services/auth.service';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [RouterOutlet, CommonModule, RouterLink, RouterLinkActive],
  template: `
    <div class="admin-layout">
      <!-- Sidebar -->
      <div class="sidebar" [class.collapsed]="sidebarCollapsed">
        <div class="logo">
          <h2>{{ sidebarCollapsed ? 'CM' : 'Competition Manager' }}</h2>
        </div>
        <div class="toggle-btn" (click)="toggleSidebar()">
          <i class="toggle-icon">{{ sidebarCollapsed ? '→' : '←' }}</i>
        </div>
        <nav>
          <ul>
            <li>
              <a routerLink="/admin/dashboard" routerLinkActive="active">
                <span class="icon">📊</span>
                <span class="text" *ngIf="!sidebarCollapsed">Dashboard</span>
              </a>
            </li>
            <li>
              <a routerLink="/admin/competitions" routerLinkActive="active">
                <span class="icon">🏆</span>
                <span class="text" *ngIf="!sidebarCollapsed">Competitions</span>
              </a>
            </li>
            <li>
              <a routerLink="/admin/participants" routerLinkActive="active">
                <span class="icon">👥</span>
                <span class="text" *ngIf="!sidebarCollapsed">Participants</span>
              </a>
            </li>
            <li>
              <a routerLink="/admin/matches" routerLinkActive="active">
                <span class="icon">🎮</span>
                <span class="text" *ngIf="!sidebarCollapsed">Matches</span>
              </a>
            </li>
            <li>
              <a routerLink="/admin/results" routerLinkActive="active">
                <span class="icon">📈</span>
                <span class="text" *ngIf="!sidebarCollapsed">Results</span>
              </a>
            </li>
            <li>
              <a routerLink="/admin/reports" routerLinkActive="active">
                <span class="icon">📝</span>
                <span class="text" *ngIf="!sidebarCollapsed">Reports</span>
              </a>
            </li>
            <li>
              <a routerLink="/admin/settings" routerLinkActive="active">
                <span class="icon">⚙️</span>
                <span class="text" *ngIf="!sidebarCollapsed">Settings</span>
              </a>
            </li>
          </ul>
        </nav>
      </div>

      <!-- Main Content -->
      <div class="main-content" [class.expanded]="sidebarCollapsed">
        <!-- Top Navigation -->
        <header class="top-nav">
          <div class="page-title">
            <h1>Admin Dashboard</h1>
          </div>
          <div class="user-info">
            <div class="user-name" *ngIf="currentUser$ | async as user">
              <span class="welcome">Welcome,</span>
              <span class="name">Admin</span>
            </div>
            <button class="logout-btn" (click)="logout()">Logout</button>
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
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    }

    .sidebar {
      width: 250px;
      background: #2c3e50;
      color: white;
      transition: width 0.3s ease;
      position: relative;
      box-shadow: 0 0 10px rgba(0,0,0,0.1);
      display: flex;
      flex-direction: column;
    }

    .sidebar.collapsed {
      width: 70px;
    }

    .logo {
      padding: 1.5rem 1rem;
      border-bottom: 1px solid rgba(255,255,255,0.1);
      text-align: center;
    }

    .logo h2 {
      margin: 0;
      font-size: 1.2rem;
      white-space: nowrap;
      overflow: hidden;
    }

    .toggle-btn {
      position: absolute;
      top: 1rem;
      right: -12px;
      background: #34495e;
      border-radius: 50%;
      width: 24px;
      height: 24px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      color: white;
      box-shadow: 0 0 5px rgba(0,0,0,0.2);
      z-index: 10;
    }

    .toggle-icon {
      font-style: normal;
      font-size: 12px;
    }

    nav {
      margin-top: 1rem;
      flex-grow: 1;
      overflow-y: auto;
    }

    nav ul {
      list-style: none;
      padding: 0;
      margin: 0;
    }

    nav ul li {
      margin-bottom: 0.5rem;
    }

    nav ul li a {
      display: flex;
      align-items: center;
      color: #ecf0f1;
      text-decoration: none;
      padding: 0.75rem 1.5rem;
      border-radius: 4px;
      margin: 0 0.5rem;
      transition: all 0.2s ease;
    }

    nav ul li a:hover {
      background: rgba(255,255,255,0.1);
    }

    nav ul li a.active {
      background: #3498db;
    }

    .icon {
      margin-right: 1rem;
      font-size: 1.2rem;
      width: 20px;
      text-align: center;
    }

    .text {
      white-space: nowrap;
    }

    .main-content {
      flex: 1;
      background: #f5f6fa;
      transition: margin-left 0.3s ease;
    }

    .main-content.expanded {
      margin-left: -180px;
    }

    .top-nav {
      background: white;
      padding: 1rem 2rem;
      box-shadow: 0 2px 4px rgba(0,0,0,0.05);
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .page-title h1 {
      margin: 0;
      font-size: 1.5rem;
      color: #2c3e50;
    }

    .user-info {
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    .user-name {
      display: flex;
      flex-direction: column;
      text-align: right;
    }

    .welcome {
      font-size: 0.8rem;
      color: #7f8c8d;
    }

    .name {
      font-weight: bold;
      color: #2c3e50;
    }

    .logout-btn {
      background: #e74c3c;
      color: white;
      border: none;
      padding: 0.5rem 1rem;
      border-radius: 4px;
      cursor: pointer;
      font-weight: 500;
      transition: background 0.2s ease;
    }

    .logout-btn:hover {
      background: #c0392b;
    }

    main {
      padding: 2rem;
      height: calc(100vh - 70px);
      overflow-y: auto;
    }
  `]
})
export class AdminLayoutComponent {
  currentUser$: Observable<any>;
  sidebarCollapsed = false;

  constructor(private authService: AuthService, private router: Router) {
    this.currentUser$ = this.authService.currentUser$;
  }

  toggleSidebar() {
    this.sidebarCollapsed = !this.sidebarCollapsed;
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/']);
  }
}
