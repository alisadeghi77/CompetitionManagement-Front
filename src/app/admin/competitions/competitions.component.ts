import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataTableComponent, ColumnConfig } from '../../shared/components/data-table/data-table.component';
import { CompetitionService } from '../../core/http-services/competition.service';
import { Observable } from 'rxjs';
import { ImageComponent } from '../../shared/components/image/image.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-competitions',
  standalone: true,
  imports: [CommonModule, DataTableComponent, ImageComponent],
  templateUrl: './competitions.component.html',
  styleUrls: ['./competitions.component.scss']
})
export class CompetitionsComponent implements OnInit {
  competitions = [];
  errorMessage: any;
  columns: ColumnConfig[] = [];

  @ViewChild('bannerTemplate', { static: true }) bannerTemplate!: TemplateRef<any>;

  constructor(
    private competitionService: CompetitionService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.columns = [
      { field: 'title', title: 'عنوان', sortable: true, width: '15%' },
      { field: 'date', title: 'تاریخ', type: 'date', sortable: true, width: '10%' },
      { field: 'address', title: 'آدرس', width: '20%' },
      { field: 'status', title: 'وضعیت', type: 'number', width: '10%' },
      { field: 'licenseFileId', title: 'مجوز', type: 'template', width: '15%' },
      {
        field: 'bannerFileId',
        title: 'بنر',
        type: 'template',
        template: this.bannerTemplate,
        width: '15%'
      },
      {
        field: 'id',
        title: 'جزئیات',
        type: 'button',
        buttonText: 'جزئیات',
        buttonClass: 'btn btn-info btn-sm',
        width: '15%'
      }
    ];

    this.competitionService.getCompetitions().subscribe({
      next: (competitions) => {
        this.competitions = competitions.data;
      },
      error: (error) => {
        console.error('Error loading competitions:', error);
        this.errorMessage = error.message || 'Failed to load competitions. Please try again later.';
      }
    });
  }

  onCompetitionClick(competition: any): void {
    console.log('Competition clicked:', competition);
    // Handle competition row click
  }

  onButtonClick(event: { row: any, column: ColumnConfig, event: MouseEvent }): void {
    console.log('Button clicked:', event);
    if (event.column.field === 'id') {
      this.router.navigate(['/admin/competitions', event.row.id]);
    }
  }
}
