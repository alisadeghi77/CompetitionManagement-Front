import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { CompetitionService } from '../../../core/http-services/competition.service';
import { ParticipantService } from '../../../core/http-services/participant.service';
import { DataTableComponent, ColumnConfig } from '../../../shared/components/data-table/data-table.component';
import { ImageComponent } from '../../../shared/components/image/image.component';
import { Location } from '@angular/common';
import { IconComponent } from '../../../shared/components/icon/icon.component';

@Component({
  selector: 'app-competition-details',
  standalone: true,
  imports: [CommonModule, DataTableComponent, ImageComponent, IconComponent],
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

  columns: ColumnConfig[] = [
    { field: 'participantFullName', title: 'نام شرکت کننده', sortable: true },
    { field: 'participantPhoneNumber', title: 'شماره تماس' },
    { field: 'coachFullName', title: 'نام مربی', sortable: true },
    { field: 'coachPhoneNumber', title: 'شماره تماس مربی' },
    {
      field: 'status',
      title: 'وضعیت',
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
      buttonClass: 'btn btn-success btn-sm mx-1',
      buttonHandler: (row) => this.approveParticipant(row.id)
    },
    {
      field: 'id',
      title: 'رد',
      type: 'button',
      buttonText: 'رد',
      buttonClass: 'btn btn-danger btn-sm mx-1',
      buttonHandler: (row) => this.rejectParticipant(row.id)
    }
  ];

  constructor(
    private route: ActivatedRoute,
    private competitionService: CompetitionService,
    private participantService: ParticipantService,
    private location: Location
  ) { }

  ngOnInit(): void {
    this.competitionId = Number(this.route.snapshot.paramMap.get('id'));

    this.loadCompetitionDetails();
    this.loadParticipants();
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

  goBack(): void {
    this.location.back();
  }

  onButtonClick(event: { row: any, column: ColumnConfig, event: MouseEvent }): void {
    const participantId = event.row.id;

    if (event.column.buttonText === 'تایید') {
      this.approveParticipant(participantId);
    } else if (event.column.buttonText === 'رد') {
      this.rejectParticipant(participantId);
    }
  }

}
