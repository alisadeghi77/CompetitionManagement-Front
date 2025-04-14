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
  templateUrl: './competitions.component.html',
  styleUrls: ['./competitions.component.scss']
})
export class CompetitionsComponent implements OnInit {
  competitions: any[] = [];
  loading = true;
  error: string | null = null;

  constructor(private competitionService: CompetitionService) {}

  ngOnInit() {
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
