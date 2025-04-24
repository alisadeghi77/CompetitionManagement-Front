import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-competitions',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="competitions-container">
      <h2>Competitions Management</h2>
      <div class="competitions-content">
        <p>Here you can manage all competitions in the system.</p>
      </div>
    </div>
  `,
  styles: [`
    .competitions-container {
      padding: 1rem;
    }

    .competitions-content {
      background: white;
      border-radius: 8px;
      padding: 1.5rem;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
      margin-top: 1rem;
    }
  `]
})
export class CompetitionsComponent {}
