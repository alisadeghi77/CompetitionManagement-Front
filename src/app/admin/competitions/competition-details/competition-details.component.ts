import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { CompetitionService } from '../../../core/http-services/competition.service';
import { ParticipantService } from '../../../core/http-services/participant.service';
import { BracketService } from '../../../core/http-services/bracket.service';
import { DataTableComponent, ColumnConfig } from '../../../shared/components/data-table/data-table.component';
import { ImageComponent } from '../../../shared/components/image/image.component';
import { Location } from '@angular/common';
import { IconComponent } from '../../../shared/components/icon/icon.component';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatchService, MatchWinnerRequest } from '../../../core/http-services/match.service';
import { SingleEliminationBracketComponent } from "../../../shared/components/single-elimination-bracket/single-elimination-bracket.component";
import { DynamicFormComponent } from '../../../shared/components/dynamic-params/dynamic-params.component';

interface ParticipantParam {
  key: string;
  value: string;
}

@Component({
  selector: 'app-competition-details',
  standalone: true,
  imports: [
    CommonModule,
    DataTableComponent,
    ImageComponent,
    IconComponent,
    ReactiveFormsModule,
    SingleEliminationBracketComponent,
    DynamicFormComponent
  ],
  templateUrl: './competition-details.component.html',
  styleUrls: ['./competition-details.component.scss']
})
export class CompetitionDetailsComponent implements OnInit {
  competitionId: number = 0;
  competition: any = null;
  participants: any[] = [];
  errorMessage: any = null;
  loading: boolean = true;
  participantsLoading: boolean = true;

  // Match table related properties
  brackets: any[] = [];
  selectedBracket: any = null;
  matchTableLoading = false;
  matchTableError: string | null = null;
  filterForm: FormGroup = new FormGroup({});
  filteredMatches: any[] = [];
  tableParams: any = {};

  columns: ColumnConfig[] = [
    { field: 'participantFullName', title: 'نام شرکت کننده', sortable: true, width: '150px' },
    { field: 'participantPhoneNumber', title: 'شماره تماس', width: '100px' },
    { field: 'coachFullName', title: 'نام مربی', sortable: true, width: '150px' },
    { field: 'coachPhoneNumber', title: 'شماره تماس مربی', width: '100px' },
    {
      field: 'status',
      title: 'وضعیت',
      width: '150px',

      sortable: true,
      formatFn: (value: any) => {
        const statusMap: { [key: string]: string } = {
          0: 'در انتظار',
          1: 'تایید شده',
          2: 'رد شده'
        };
        return statusMap[value] || value;
      }
    },
    {
      field: 'id',
      title: 'تایید',
      type: 'button',
      buttonText: 'تایید',
      buttonClass: 'btn btn-success btn-sm  p-3',
      width: '70px',
      buttonHandler: (row) => this.approveParticipant(row.id)
    },
    {
      field: 'id',
      title: 'رد',
      type: 'button',
      buttonText: 'رد',
      buttonClass: 'btn btn-danger btn-sm  p-3',
      width: '70px',
      buttonHandler: (row) => this.rejectParticipant(row.id)
    }
  ];

  selectedParams: any[] = [];
  selectedfilteredMatch: any;

  constructor(
    private route: ActivatedRoute,
    private competitionService: CompetitionService,
    private participantService: ParticipantService,
    private bracketService: BracketService,
    private matchService: MatchService,
    private location: Location,
    private fb: FormBuilder
  ) { }

  ngOnInit(): void {
    this.competitionId = Number(this.route.snapshot.paramMap.get('id'));

    this.loadCompetitionDetails();
    this.loadParticipants();
    this.loadMatchTables();
  }

  loadCompetitionDetails(): void {
    this.loading = true;
    this.competitionService.getCompetitionById(this.competitionId).subscribe({
      next: (response) => {
        this.competition = response.data;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading competition details:', error);
        this.errorMessage = error.message || 'خطا در بارگذاری جزئیات مسابقه';
        this.loading = false;
      }
    });
  }

  loadParticipants(): void {
    this.participantsLoading = true;
    this.participantService.getParticipants(this.competitionId).subscribe({
      next: (response) => {
        this.participants = response.data;
        this.participantsLoading = false;
      },
      error: (error) => {
        console.error('Error loading participants:', error);
        this.errorMessage = error.message || 'خطا در بارگذاری شرکت کنندگان';
        this.participantsLoading = false;
      }
    });
  }

  loadMatchTables(): void {
    this.matchTableLoading = true;
    this.matchTableError = null;

    this.bracketService.getBracketsKeysByCompetionId(this.competitionId).subscribe({
      next: (response) => {
        this.brackets = response.data || [];
        this.matchTableLoading = false;
        if (this.brackets.length > 0) {
          this.selectedBracket = this.brackets[0];
          this.filteredMatches = [...this.brackets];
        }
      },
      error: (error) => {
        console.error('Error loading match tables:', error);
        this.matchTableError = 'خطا در بارگذاری جداول مسابقات';
        this.matchTableLoading = false;
      }
    });
  }

  approveParticipant(participantId: string): void {
    this.participantService.approveParticipant(participantId).subscribe({
      next: (response) => {
        console.log('Participant approved:', response);
        this.loadParticipants(); // Reload participants after approval
      },
      error: (error) => {
        console.error('Error approving participant:', error);
        this.errorMessage = error.message || 'خطا در تایید شرکت کننده';
      }
    });
  }

  rejectParticipant(participantId: string): void {
    this.participantService.rejectParticipant(participantId).subscribe({
      next: (response) => {
        console.log('Participant rejected:', response);
        this.loadParticipants(); // Reload participants after rejection
      },
      error: (error) => {
        console.error('Error rejecting participant:', error);
        this.errorMessage = error.message || 'خطا در رد شرکت کننده';
      }
    });
  }
  getCompetitionStatusTitle(status: number) {
    switch (status) {
      case 0:
        return 'در انتظار تایید ادمین';
      case 1:
        return 'در انتظار شروع';
      case 2:
        return 'در حال انجام';
      case 3:
        return 'پایان یافته';
      default:
        return '';
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

  // Management Actions Methods
  changeVisibility(): void {
    this.competitionService.changeVisibility(this.competitionId).subscribe({
      next: (response) => {
        console.log('Visibility changed:', response);
        this.loadCompetitionDetails(); // Reload competition details
      },
      error: (error) => {
        console.error('Error changing visibility:', error);
        this.errorMessage = error.message || 'خطا در تغییر وضعیت نمایش';
      }
    });
  }

  changeRegistrationStatus(): void {
    this.competitionService.changeRegistrationStatus(this.competitionId).subscribe({
      next: (response) => {
        console.log('Registration status changed:', response);
        this.loadCompetitionDetails(); // Reload competition details
      },
      error: (error) => {
        console.error('Error changing registration status:', error);
        this.errorMessage = error.message || 'خطا در تغییر وضعیت ثبت نام';
      }
    });
  }

  generateTable(): void {
    this.bracketService.createBracket(this.competitionId).subscribe({
      next: (response) => {
        console.log('Table generated:', response);
        // You might want to add logic to display success message or update UI
      },
      error: (error) => {
        console.error('Error generating table:', );
        this.errorMessage = error || 'خطا در ایجاد جدول مسابقات';
      }
    });
  }

  // Report Methods
  getParticipantReport(): void {
    // TODO: Implement participant report
    console.log('Get participant report');
  }

  getCompetitionTablesReport(): void {
    // TODO: Implement competition tables report
    console.log('Get competition tables report');
  }

  getChampionsReport(): void {
    // TODO: Implement champions report
    console.log('Get champions report');
  }

  getCoachTeamChampionsReport(): void {
    // TODO: Implement coach/team champions report
    console.log('Get coach/team champions report');
  }

  initializeFilterForm(): void {
    if (!this.competition || !this.competition.registerParams) return;

    const filterControls: any = {};

    // Create form controls for each parameter category
    if (this.competition.registerParams.values) {
      this.competition.registerParams.values.forEach((val: any) => {
        if (val.params && val.params.length > 0) {
          val.params.forEach((subParam: any) => {
            if (subParam.title) {
              const key = subParam.title;
              filterControls[key] = [null];

              // Store parameter info for display purposes
              this.tableParams[key] = {
                title: subParam.title,
                values: this.getUniqueValuesForKey(key)
              };
            }
          });
        }
      });
    }

    this.filterForm = new FormGroup(filterControls);

    // Listen for filter changes
    this.filterForm.valueChanges.subscribe(() => {
      this.applyFilters();
    });
  }

  getUniqueValuesForKey(key: string): any[] {
    if (!this.brackets || this.brackets.length === 0) return [];

    const uniqueValues = new Set();

    this.brackets.forEach(bracket => {
      if (bracket.params && Array.isArray(bracket.params)) {
        bracket.params.forEach((param: any) => {
          if (param.keyTitle === key) {
            uniqueValues.add(param.valueTitle);
          }
        });
      }
    });

    return Array.from(uniqueValues);
  }

  applyFilters(): void {
    if (!this.brackets) return;

    const filterValues = this.filterForm.value;

    // Start with all brackets
    this.filteredMatches = [...this.brackets];

    // Apply filters for each parameter with a selected value
    Object.keys(filterValues).forEach(key => {
      const selectedValue = filterValues[key];
      if (selectedValue) {
        this.filteredMatches = this.filteredMatches.filter(bracket => {
          if (!bracket.params) return false;

          // Check if any parameter in the bracket matches the filter
          return bracket.params.some((param: any) =>
            param.keyTitle === key && param.valueTitle === selectedValue
          );
        });
      }
    });
  }

  onBracketSelect(bracket: any): void {
    this.selectedBracket = bracket;
  }

  resetFilters(): void {
    this.filterForm.reset();
    this.filteredMatches = [...this.brackets];
  }

  setMatchWinner(matchId: string, participantId: number): void {
    const request: MatchWinnerRequest = {
      matchId,
      participantId
    };

    this.matchService.setMatchWinner(request).subscribe({
      next: (response) => {
        console.log('Match winner set:', response);
        this.loadMatchTables(); // Reload match tables to show updated winner
      },
      error: (error) => {
        console.error('Error setting match winner:', error);
        this.errorMessage = error.message || 'خطا در تعیین برنده مسابقه';
      }
    });
  }

  onParamsSelected(params: any[]): void {
    this.selectedParams = params;
  }

  private generateBracketKey(params: ParticipantParam[]): string {
    return params.map(param => `${param.key}.${param.value}`).join('_');
  }

  searchBrackets(): void {
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
}
