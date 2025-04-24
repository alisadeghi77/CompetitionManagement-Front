import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-participants',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="participants-container">
      <h2>Participants Management</h2>
      <div class="participants-content">
        <p>Here you can manage all participants in the system.</p>
      </div>
    </div>
  `,
  styles: [`
    .participants-container {
      padding: 1rem;
    }

    .participants-content {
      background: white;
      border-radius: 8px;
      padding: 1.5rem;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
      margin-top: 1rem;
    }
  `]
})
export class ParticipantsComponent {}
