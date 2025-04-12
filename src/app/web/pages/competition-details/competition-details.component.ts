import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { CompetitionService } from '../../../core/http-services/competition.service';
import { ImageComponent } from '../../../shared/components/image/image.component';
import { PersianDatePipe } from '../../../shared/pipes/persian-date.pipe';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { RegisterModalComponent } from '../../../shared/components/register-modal/register-modal.component';

@Component({
  selector: 'app-competition-details',
  standalone: true,
  imports: [CommonModule, RouterModule, ImageComponent, PersianDatePipe, RegisterModalComponent],
  template: `
    <div class="competition-details-container" dir="rtl">
      <div *ngIf="loading" class="loading-spinner">
        در حال بارگذاری...
      </div>

      <div *ngIf="error" class="error-message">
        {{ error }}
      </div>

      <div *ngIf="competition && !loading" class="competition-content">
        <h1 class="page-title">{{ competition.title }}</h1>

        <div class="image-container">
          <div class="banner-image">
            <app-image
              [fileId]="competition.bannerImageId"
              [altText]="competition.title + ' بنر'"
              className="competition-image"
            />
          </div>
          <div class="license-image">
            <app-image
              [fileId]="competition.licenseImageId"
              [altText]="competition.title + ' مجوز'"
              className="competition-image"
            />
          </div>
        </div>

        <div class="competition-info">
          <div class="info-item">
            <span class="value">زمان برگذاری: {{ competition.date | persianDate:'jYYYY/jMM/jDD' }}</span>
            <span class="value">آدرس: {{ competition.address }}</span>
            <span class="value">وضعیت مسابقه:
              <span class="value status" [ngClass]="getStatusClass(competition.status)">
                {{ getStatusText(competition.status) }}
              </span>
            </span>
          </div>
        </div>

        <div *ngIf="competition.registerParams" class="params-section">
          <h2>شرایط ثبت نام مسابقه</h2>
          <div class="params-container">
          <div *ngIf="competition.registerParams.values && competition.registerParams.values.length > 0" class="param-values">
                <div *ngFor="let value of competition.registerParams.values" class="param-value">
                  <strong>{{ value.title }}</strong>
                  <div *ngIf="value.params && value.params.length > 0" class="nested-params">
                    <div *ngFor="let nestedParam of value.params" class="nested-param">
                      <span>{{ nestedParam.title }}</span>
                      <div *ngIf="nestedParam.values && nestedParam.values.length > 0">
                        <span *ngFor="let nestedValue of nestedParam.values" class="nested-value">
                          {{ nestedValue.title }}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
           </div>


        <!-- TODO: change perdicate *ngIf="competition.status === 2 && competition.canRegister" -->
        <div  class="register-section">
          <button class="register-button" (click)="openRegisterModal()">ثبت نام در مسابقه</button>
        </div>
        </div>

      </div>
    </div>
  `,
  styles: [`
    .competition-details-container {
      padding: 2rem;
      max-width: 1200px;
      margin: 0 auto;
    }

    .page-title {
      text-align: center;
      margin-bottom: 2rem;
      color: #2c3e50;
      font-size: 2rem;
    }

    .image-container {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 2rem;
      margin-bottom: 2rem;
    }

    .competition-image {
      width: 100%;
      height: 300px;
      object-fit: cover;
      border-radius: 8px;
      box-shadow: 0 4px 8px rgba(0,0,0,0.1);
    }

    .banner-image, .license-image {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .competition-info {
      background: white;
      border-radius: 8px;
      padding: 2rem;
      margin-bottom: 2rem;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }

    .info-item {
      display: flex;
      justify-content: space-between;
      padding: 0.75rem 0;
      border-bottom: 1px solid #eee;
    }

    .info-item:last-child {
      border-bottom: none;
    }

    .label {
      font-weight: bold;
      color: #555;
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

    .register-section {
      text-align: center;
      margin: 2rem 0;
    }

    .register-button {
      padding: 0.75rem 2rem;
      background: #3498db;
      color: white;
      border: none;
      border-radius: 4px;
      font-size: 1.1rem;
      cursor: pointer;
      transition: background 0.3s ease;
    }

    .register-button:hover {
      background: #2980b9;
    }

    .params-section {
      background: white;
      border-radius: 8px;
      padding: 2rem;
      margin-top: 2rem;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }

    .params-section h2 {
      margin-bottom: 1.5rem;
      color: #2c3e50;
      text-align: center;
    }

    .params-container {
      display: flex;
      background: #f9f9f9;
      border-radius: 8px;
      padding: 1.5rem;
      flex-direction:column
    }

    .param-values {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .param-value {
      background: white;
      border-radius: 6px;
      padding: 1rem;
      box-shadow: 0 1px 3px rgba(0,0,0,0.1);
    }

    .nested-params {
      margin-top: 0.5rem;
      padding-left: 1rem;
    }

    .nested-param {
      margin-top: 0.5rem;
    }

    .nested-value {
      display: inline-block;
      background: #f1f1f1;
      padding: 0.25rem 0.5rem;
      margin: 0.25rem;
      border-radius: 4px;
      font-size: 0.9rem;
    }

    .loading-spinner {
      text-align: center;
      padding: 4rem;
      color: #666;
    }

    .error-message {
      text-align: center;
      padding: 2rem;
      color: #e74c3c;
      background: #ffebee;
      border-radius: 8px;
      margin: 2rem 0;
    }
  `]
})
export class CompetitionDetailsComponent implements OnInit {
  competitionId: number | null = null;
  competition: any = null;
  loading = true;
  error: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private competitionService: CompetitionService,
    private modalService: NgbModal
  ) { }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.competitionId = +id;
        this.loadCompetitionDetails();
      } else {
        this.error = 'شناسه مسابقه نامعتبر است.';
        this.loading = false;
      }
    });
  }

  loadCompetitionDetails() {
    this.loading = true;
    this.error = null;

    if (this.competitionId) {
      this.competitionService.getCompetitionById(this.competitionId).subscribe({
        next: (data) => {
          this.competition = data.data;
          console.log(this.competition.registerParams)
          this.loading = false;
        },
        error: (err) => {
          this.error = 'خطا در بارگذاری اطلاعات مسابقه. لطفا دوباره تلاش کنید.';
          this.loading = false;
        }
      });
    }
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
        return 'پایان مسابقه';
      default:
        return 'وضعیت نا مشخص';
    }
  }

  getStatusClass(status: number): string {
    return `status-${status}`;
  }

  openRegisterModal() {
    const modalRef = this.modalService.open(RegisterModalComponent, {
      size: 'lg',
      centered: true,
      scrollable: true
    });

    modalRef.componentInstance.competitionId = this.competitionId;
    modalRef.componentInstance.competitionParams = this.competition.params;
  }
}