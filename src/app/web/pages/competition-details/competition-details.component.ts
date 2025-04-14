import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule, Router } from '@angular/router';
import { CompetitionService } from '../../../core/http-services/competition.service';
import { ImageComponent } from '../../../shared/components/image/image.component';
import { PersianDatePipe } from '../../../shared/pipes/persian-date.pipe';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from '../../../core/http-services/auth.service';
// import { RegisterModalComponent } from '../../../shared/components/register-modal/register-modal.component';

@Component({
  selector: 'app-competition-details',
  standalone: true,
  imports: [CommonModule, RouterModule, ImageComponent, PersianDatePipe],
  templateUrl: './competition-details.component.html',
  styleUrls: ['./competition-details.component.scss']
})
export class CompetitionDetailsComponent implements OnInit {
  competitionId: number | null = null;
  competition: any = null;
  loading = true;
  error: string | null = null;
  isAuthenticated = false;

  constructor(
    private route: ActivatedRoute,
    private competitionService: CompetitionService,
    private modalService: NgbModal,
    private router: Router,
    private authService: AuthService
  ) { }

  ngOnInit() {
    // Check authentication status
    this.authService.currentUser$.subscribe(user => {
      this.isAuthenticated = !!user;
    });

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
    const currentUrl = `/competition/${this.competitionId}`;
    const encodedReturnUrl = encodeURIComponent(currentUrl);

    // Always go to register page, but with return URL for after registration
    this.router.navigate(['/register/participant'], {
      queryParams: { returnUrl: encodedReturnUrl }
    });
  }
}
