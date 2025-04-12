import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../core/http-services/auth.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="profile-container">
      <div class="profile-card">
        <h2>پروفایل کاربر</h2>
        <div class="profile-info">
          {{ currentUser.userName }}<br/>
          {{currentUser.fullName}}
        </div>
      </div>
    </div>
  `,
  styles: [`
    .profile-container {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 80vh;
      font-family: 'IRANSans', sans-serif;
    }

    .profile-card {
      background: white;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.1);
      padding: 2rem;
      width: 100%;
      max-width: 600px;
      text-align: right;
    }

    h2 {
      margin-bottom: 1.5rem;
      color: #333;
    }

    .profile-info {
      background-color: #f5f5f5;
      border-radius: 4px;
      padding: 1rem;
      overflow: auto;
    }
  `]
})
export class ProfileComponent {
  currentUser: any;

  constructor(private authService: AuthService) {
    this.authService.currentUser$.subscribe(user => {
      console.log(user)
      this.currentUser = user;
    });
  }
}
