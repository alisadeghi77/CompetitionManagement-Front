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
import { ParticipantService } from '../../../core/http-services/participant.service';
import { SingleEliminationBracketComponent } from '../../../shared/components/single-elimination-bracket/single-elimination-bracket.component';
import { IconComponent } from '../../../shared/components/icon/icon.component';
import { MatchService } from '../../../core/http-services/match.service';
import { BracketService } from '../../../core/http-services/bracket.service';


interface ParticipantParam {
  key: string;
  value: string;
}

interface Match {
  id: string;
  round: number;
  matchNumberPosition: number;
  firstParticipantId: string | null;
  firstParticipantFullName: string | null;
  firstParticipantCoachId: string | null;
  firstParticipantCoachFullName: string | null;
  isFirstParticipantBye: boolean;
  secondParticipantId: string | null;
  secondParticipantFullName: string | null;
  secondParticipantCoachId: string | null;
  secondParticipantCoachFullName: string | null;
  isSecondParticipantBye: boolean;
  winnerParticipantId: string | null;
  winnerParticipantFullName: string | null;
  winnerParticipantCoachId: string | null;
  winnerParticipantCoachFullName: string | null;
}

@Component({
  selector: 'app-competition-details',
  standalone: true,
  imports: [
    DynamicFormComponent,
    CommonModule,
    RouterModule,
    ImageComponent,
    PersianDatePipe,
    CoachSelectInputComponent,
    ReactiveFormsModule,
    SingleEliminationBracketComponent,
    IconComponent
  ],
  templateUrl: './competition-details.component.html'
})
export class CompetitionDetailsComponent implements OnInit, AfterViewInit {
  competitionId: number | null = null;
  competition: any = null;
  loading = true;
  error: string | null = null;
  showRegistrationForm = false;
  registrationForm: FormGroup;
  submitting = false;
  submitError: string | null = null;
  submitSuccess = false;
  selectedfilteredMatch: { key: string; hasAnyBrackets: boolean } | null = null;
  selectedPrams: any = null;
  searching = false;

  @ViewChild('registrationSection') registrationSection?: ElementRef;
  matchTableLoading: boolean = false;
  matchTableError: string | null = null;
  brackets: any;
  selectedBracket: any;
  filteredMatches: any[] = [];
  selectedParams: any[] = [];

  constructor(
    private route: ActivatedRoute,
    private participantService: ParticipantService,
    private competitionService: CompetitionService,
    private router: Router,
    private authService: AuthService,
    private fb: FormBuilder,
    private bracketService: BracketService,
    private matchService: MatchService
  ) {
    this.registrationForm = this.fb.group({
      coachId: [null],
      coachPhoneNumber: [null],
      competitionId: ['', Validators.required],
      params: [null, Validators.required]
    });
    this.registrationForm.addValidators(control => this.coachValidator(control as FormGroup));
  }

  coachValidator(form: FormGroup) {
    const coachId = form.get('coachId')?.value;
    const coachPhoneNumber = form.get('coachPhoneNumber')?.value;
    return coachId || coachPhoneNumber ? null : { invalidCoach: true };
  }

  ngOnInit() {
    this.authService.currentUser$.subscribe(user => {
      this.showRegistrationForm = !!user;
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

  ngAfterViewInit() {
    if (this.showRegistrationForm) {
      setTimeout(() => this.scrollToRegistration(), 500);
    }
  }

  loadCompetitionDetails() {
    this.loading = true;
    this.error = null;

    this.registrationForm.patchValue({
      competitionId: this.competitionId
    });

    if (this.competitionId) {
      this.competitionService.getCompetitionById(this.competitionId).subscribe({
        next: (data) => {
          this.competition = data.data;
          this.loadMatchTables();

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

  openRegisterSection() {
    debugger
    if (!this.showRegistrationForm) {
      const currentUrl = `/competition/${this.competitionId}`;
      const encodedReturnUrl = encodeURIComponent(currentUrl);
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
    if (coach.id) {
      this.registrationForm.patchValue({
        coachId: coach.id
      });
    } else {
      debugger
      this.registrationForm.patchValue({
        coachPhoneNumber: coach.phoneNumber
      });
    }
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

    const formValues = this.registrationForm.value;
    formValues.competitionId = this.competition.id;
    debugger

    // Call your registration API here
    this.participantService.registerParticipant(formValues).subscribe({
      next: (response) => {
        debugger
        this.submitting = false;
        this.submitSuccess = true;
        this.registrationForm.reset();
      },
      error: (response) => {
        this.submitting = false;
        this.submitError = response.error?.errorMessages[0].message || 'خطا در ثبت نام. لطفا دوباره تلاش کنید.';
      }
    });
  }

  onParamSelected(event: any) {
    console.log(event);
    this.registrationForm.patchValue({
      params: event
    });
  }

  onParamsSelected(params: any[]): void {
    this.selectedPrams = params;
  }

  loadMatchTables(): void {
    this.matchTableLoading = true;
    this.matchTableError = null;
debugger
    this.bracketService.getBracketsKeysByCompetionId(this.competition.id).subscribe({
      next: (response: any) => {
        this.brackets = response.data || [];
        this.matchTableLoading = false;
        if (this.brackets.length > 0) {
          this.selectedBracket = this.brackets[0];
          this.filteredMatches = [...this.brackets];
        }
      },
      error: (error: any) => {
        console.error('Error loading match tables:', error);
        this.matchTableError = 'خطا در بارگذاری جداول مسابقات';
        this.matchTableLoading = false;
      }
    });
  }


  searchBrackets(): void {
    debugger
    if (!this.brackets) return;

    // Start with all brackets
    this.filteredMatches = [...this.brackets];

    // Convert selected params to ParticipantParam format
    const searchParams: ParticipantParam[] = this.selectedParams.map(param => ({
      key: param.key,
      value: param.value
    }));

    // Generate the search key
    const searchKey = this.generateBracketKey(searchParams);

    // Filter brackets based on the generated key
    this.selectedfilteredMatch = this.filteredMatches.filter(bracket => {
      const bracketKey = bracket.key.toLowerCase();
      return bracketKey.includes(searchKey.toLowerCase());
    })[0];
    console.log(this.selectedfilteredMatch);
  }


  private generateBracketKey(params: ParticipantParam[]): string {
    return params.map(param => `${param.key}.${param.value}`).join('_');
  }
}
