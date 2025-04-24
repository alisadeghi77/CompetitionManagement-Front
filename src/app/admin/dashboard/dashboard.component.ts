import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="dashboard-container">
      <h2>Dashboard</h2>
      <div class="dashboard-stats">
        <div class="stat-card">
          <div class="stat-value">12</div>
          <div class="stat-label">Competitions</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">156</div>
          <div class="stat-label">Participants</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">48</div>
          <div class="stat-label">Matches</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">5</div>
          <div class="stat-label">Ongoing</div>
        </div>
      </div>
      <div class="dashboard-content">
        <p>Welcome to the Competition Management Admin Dashboard!</p>
      </div>
    </div>
  `,
  styles: [`
    .dashboard-container {
      padding: 1rem;
    }

    .dashboard-stats {
      display: flex;
      flex-wrap: wrap;
      gap: 1rem;
      margin: 1rem 0;
    }

    .stat-card {
      background: white;
      border-radius: 8px;
      padding: 1.5rem;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
      min-width: 150px;
      flex: 1;
      text-align: center;
    }

    .stat-value {
      font-size: 2rem;
      font-weight: bold;
      color: #3498db;
    }

    .stat-label {
      color: #7f8c8d;
      margin-top: 0.5rem;
    }

    .dashboard-content {
      background: white;
      border-radius: 8px;
      padding: 1.5rem;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
      margin-top: 1rem;
    }
  `]
})
export class DashboardComponent {
}
