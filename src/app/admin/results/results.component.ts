import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-results',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="results-container">
      <h2>Results Management</h2>
      <div class="results-content">
        <p>Here you can manage all competition results in the system.</p>
      </div>
    </div>
  `,
  styles: [`
    .results-container {
      padding: 1rem;
    }

    .results-content {
      background: white;
      border-radius: 8px;
      padding: 1.5rem;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
      margin-top: 1rem;
    }
  `]
})
export class ResultsComponent {}
