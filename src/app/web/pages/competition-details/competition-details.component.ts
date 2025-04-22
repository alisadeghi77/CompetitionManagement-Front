import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule, Router } from '@angular/router';
import { CompetitionService } from '../../../core/http-services/competition.service';
import { ImageComponent } from '../../../shared/components/image/image.component';
import { PersianDatePipe } from '../../../shared/pipes/persian-date.pipe';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from '../../../core/http-services/auth.service';
import { CoachSelectInputComponent } from '../../../shared/components/coach-select-input/coach-select-input.component';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { DynamicFormComponent } from '../../../shared/components/dynamic-params/dynamic-params.component';

@Component({
  selector: 'app-competition-details',
  standalone: true,
  imports: [DynamicFormComponent, CommonModule, RouterModule, ImageComponent, PersianDatePipe, CoachSelectInputComponent, ReactiveFormsModule],
  templateUrl: './competition-details.component.html'
})
export class CompetitionDetailsComponent implements OnInit, AfterViewInit {
  competitionId: number | null = null;
  competition: any = null;
  loading = true;
  error: string | null = null;
  isAuthenticated = false;
  showRegistrationForm = false;
  registrationForm: FormGroup;
  submitting = false;
  submitError: string | null = null;
  submitSuccess = false;
  selectedCoach: any = null;

  @ViewChild('registrationSection') registrationSection?: ElementRef;

  constructor(
    private route: ActivatedRoute,
    private competitionService: CompetitionService,
    private modalService: NgbModal,
    private router: Router,
    private authService: AuthService,
    private fb: FormBuilder
  ) {
    this.registrationForm = this.fb.group({
      coachId: [null],
      weight: ['', [Validators.required, Validators.min(1)]],
      age: ['', [Validators.required, Validators.min(1)]],
      categoryId: ['', Validators.required],
      note: ['']
    });
  }

  ngOnInit() {
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

    this.route.queryParams.subscribe(params => {
      if (params['continueRegister']) {
        if (!this.isAuthenticated) {
          this.router.navigate([], {
            relativeTo: this.route,
            queryParams: { continueRegister: null },
            queryParamsHandling: 'merge'
          });
        } else {
          this.showRegistrationForm = true;
        }
      }
    });
  }

  ngAfterViewInit() {
    // Check if we need to scroll to registration section
    this.route.queryParams.subscribe(params => {
      if (params['continueRegister'] && this.isAuthenticated) {
        setTimeout(() => this.scrollToRegistration(), 500);
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
          console.log(this.competition);
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
        return 'در انتظار تایید';
      case 1:
        return 'در انتظار شروع';
      case 2:
        return 'در حال اجرا';
      case 3:
        return 'پایان یافته';
      default:
        return 'نامشخص';
    }
  }

  getStatusBadgeClass(status: number): string {
    switch (status) {
      case 0: return 'bg-secondary';
      case 1: return 'bg-info text-dark';
      case 2: return 'bg-success';
      case 3: return 'bg-light text-dark';
      default: return 'bg-warning text-dark';
    }
  }

  openRegisterModal() {
    if (!this.isAuthenticated) {
      const currentUrl = `/competition/${this.competitionId}?continueRegister=true`;
      const encodedReturnUrl = encodeURIComponent(currentUrl);

      // Go to register page with return URL for after registration
      this.router.navigate(['/register/participant'], {
        queryParams: { returnUrl: encodedReturnUrl }
      });
    } else {
      this.showRegistrationForm = true;
      setTimeout(() => this.scrollToRegistration(), 100);
    }
  }

  scrollToRegistration() {
    if (this.registrationSection) {
      this.registrationSection.nativeElement.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  }

  onCoachSelected(coach: any) {
    this.selectedCoach = coach;
    this.registrationForm.patchValue({
      coachId: coach.id
    });
    console.log('Selected coach:', coach);
  }

  getCategoryOptions() {
    if (!this.competition || !this.competition.registerParams || !this.competition.registerParams.values) {
      return [];
    }

    const options: any[] = [];
    this.competition.registerParams.values.forEach((val: any) => {
      if (val.params && val.params.length > 0) {
        val.params.forEach((param: any) => {
          if (param.values && param.values.length > 0) {
            param.values.forEach((subVal: any) => {
              options.push({
                id: subVal.id,
                title: `${val.title} - ${param.title} - ${subVal.title}`
              });
            });
          }
        });
      } else {
        options.push({
          id: val.id,
          title: val.title
        });
      }
    });

    return options;
  }

  onSubmitRegistration() {
    if (this.registrationForm.invalid) {
      Object.keys(this.registrationForm.controls).forEach(key => {
        const control = this.registrationForm.get(key);
        control?.markAsTouched();
      });
      return;
    }

    this.submitting = true;
    this.submitError = null;
    this.submitSuccess = false;

    const registrationData = {
      competitionId: this.competitionId,
      ...this.registrationForm.value
    };

    console.log('Registration data:', registrationData);

    // Call your registration API here
    // this.competitionService.registerForCompetition(registrationData).subscribe({
    //   next: (response) => {
    //     this.submitting = false;
    //     this.submitSuccess = true;
    //     this.registrationForm.reset();
    //   },
    //   error: (error) => {
    //     this.submitting = false;
    //     this.submitError = error.error?.message || 'خطا در ثبت نام. لطفا دوباره تلاش کنید.';
    //   }
    // });

    // Simulate API call for now
    setTimeout(() => {
      this.submitting = false;
      this.submitSuccess = true;
      this.registrationForm.reset();
    }, 1500);
  }

  onParamSelected(event: any) {
    console.log(event);
  }
}
