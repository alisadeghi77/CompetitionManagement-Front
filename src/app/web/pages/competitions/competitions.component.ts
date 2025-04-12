import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CompetitionService } from '../../../core/http-services/competition.service';
import { ImageComponent } from '../../../shared/components/image/image.component';
import { PersianDatePipe } from '../../../shared/pipes/persian-date.pipe';

@Component({
  selector: 'app-competitions',
  standalone: true,
  imports: [CommonModule, RouterModule, ImageComponent, PersianDatePipe],
  template: `
    <div class="competitions-container" dir="rtl">
      <h1 class="page-title">مسابقات</h1>

      <div class="competitions-grid">
        <div *ngFor="let competition of competitions" class="competition-card">
          <div class="card-image">
            <app-image
              [fileId]="competition.bannerImageId"
              [altText]="competition.title"
              className="card-image"
            />
          </div>
          <div class="card-content">
            <h2 class="competition-title">{{ competition.title }}</h2>
            <div class="competition-info">
              <div class="info-item">
                <span class="label">تاریخ:</span>
                <span class="value">{{ competition.date | persianDate:'jYYYY/jMM/jDD' }}</span>
              </div>
              <div class="info-item">
                <span class="label">وضعیت:</span>
                <span class="value status" [ngClass]="getStatusClass(competition.status)">
                  {{ getStatusText(competition.status) }}
                </span>
              </div>
            </div>
            <a [routerLink]="['/competition', competition.id]" class="details-button">
              مشاهده جزئیات
            </a>
          </div>
        </div>
      </div>

      <div *ngIf="loading" class="loading-spinner">
        در حال بارگذاری...
      </div>

      <div *ngIf="error" class="error-message">
        خطا در بارگذاری مسابقات. لطفا دوباره تلاش کنید.
      </div>
    </div>
  `,
  styles: [`
    .competitions-container {
      padding: 2rem;
      max-width: 1200px;
      margin: 0 auto;
    }

    .page-title {
      text-align: center;
      margin-bottom: 2rem;
      color: #333;
      font-size: 2rem;
    }

    .competitions-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 2rem;
    }

    .competition-card {
      background: white;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      transition: transform 0.3s ease;
    }

    .competition-card:hover {
      transform: translateY(-5px);
    }

    .card-image {
      height: 200px;
      overflow: hidden;
    }

    .card-image img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .card-content {
      padding: 1.5rem;
    }

    .competition-title {
      margin: 0 0 1rem 0;
      font-size: 1.2rem;
      color: #2c3e50;
    }

    .competition-info {
      margin-bottom: 1.5rem;
    }

    .info-item {
      display: flex;
      justify-content: space-between;
      margin-bottom: 0.5rem;
      color: #666;
    }

    .label {
      font-weight: bold;
    }

    .status {
      padding: 0.25rem 0.5rem;
      border-radius: 4px;
      font-size: 0.9rem;
    }

    .status-0 {
      background-color: #f1f1f1;
      color: #666;
    }

    .status-1 {
      background-color: #e3f2fd;
      color: #1976d2;
    }

    .status-2 {
      background-color: #e8f5e9;
      color: #2e7d32;
    }

    .status-3 {
      background-color: #ffebee;
      color: #c62828;
    }

    .details-button {
      display: inline-block;
      padding: 0.5rem 1rem;
      background: #3498db;
      color: white;
      text-decoration: none;
      border-radius: 4px;
      transition: background 0.3s ease;
      width: 100%;
      text-align: center;
    }

    .details-button:hover {
      background: #2980b9;
    }

    .loading-spinner {
      text-align: center;
      padding: 2rem;
      color: #666;
    }

    .error-message {
      text-align: center;
      padding: 2rem;
      color: #e74c3c;
    }
  `]
})
export class CompetitionsComponent implements OnInit {
  competitions: any[] = [];
  loading = true;
  error: string | null = null;

  constructor(private competitionService: CompetitionService) {}

  ngOnInit() {
    console.log("sdsd")
    this.loadCompetitions();
  }

  loadCompetitions() {
    this.loading = true;
    this.error = null;

    this.competitionService.getCompetitions().subscribe({
      next: (data) => {
        this.competitions = [...data.data,...data.data,...data.data,...data.data,...data.data,...data.data];
        this.loading = false;
      },
      error: (err) => {
        this.error = 'خطا در بارگذاری مسابقات. لطفا دوباره تلاش کنید.';
        this.loading = false;
      }
    });
  }

  getStatusText(status: number): string {
    switch (status) {
      case 0:
        return 'در انتظار تایید ادمین';
      case 1:
        return 'در انتظار شروع';
      case 2:
        return 'در حال اجرا';
      case 3:
        return 'پایان مسابقه'
      default:
        return 'وضعیت نا مشخص';
    }
  }

  getStatusClass(status: number): string {
    return `status-${status}`;
  }
}
