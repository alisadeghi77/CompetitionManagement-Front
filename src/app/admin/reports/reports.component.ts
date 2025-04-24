import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="reports-container">
      <h2>Reports Center</h2>
      <div class="reports-content">
        <p>Here you can generate and view various reports for competitions.</p>
      </div>
    </div>
  `,
  styles: [`
    .reports-container {
      padding: 1rem;
    }

    .reports-content {
      background: white;
      border-radius: 8px;
      padding: 1.5rem;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
      margin-top: 1rem;
    }
  `]
})
export class ReportsComponent {}