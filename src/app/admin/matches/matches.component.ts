import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-matches',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="matches-container">
      <h2>Matches Management</h2>
      <div class="matches-content">
        <p>Here you can manage all matches in the system.</p>
      </div>
    </div>
  `,
  styles: [`
    .matches-container {
      padding: 1rem;
    }

    .matches-content {
      background: white;
      border-radius: 8px;
      padding: 1.5rem;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
      margin-top: 1rem;
    }
  `]
})
export class MatchesComponent {}
