import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="settings-container">
      <h2>System Settings</h2>
      <div class="settings-content">
        <p>Here you can manage system settings and configuration.</p>
      </div>
    </div>
  `,
  styles: [`
    .settings-container {
      padding: 1rem;
    }

    .settings-content {
      background: white;
      border-radius: 8px;
      padding: 1.5rem;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
      margin-top: 1rem;
    }
  `]
})
export class SettingsComponent {}
