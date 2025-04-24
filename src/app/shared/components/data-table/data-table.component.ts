//
// Creating
// data-table
//

import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, TemplateRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';

export interface ColumnConfig {
  field: string;  // Property name in data object
  title: string;  // Display title
  type?: 'text' | 'date' | 'number' | 'boolean' | 'template' | 'button'; // Column data type
  template?: TemplateRef<any>; // Custom template for rendering
  buttonText?: string; // For button type
  buttonClass?: string; // CSS class for button
  sortable?: boolean; // Whether column is sortable
  formatFn?: (value: any, row: any) => string; // For custom formatting
  width?: string; // Column width
  visible?: boolean; // Whether column is visible
}

@Component({
  selector: 'app-data-table',
  standalone: true,
  imports: [CommonModule, NgbPaginationModule, FormsModule],
  templateUrl: './data-table.component.html',
  styleUrls: ['./data-table.component.scss']
})
export class DataTableComponent implements OnInit, OnChanges {
  @Input() columns: ColumnConfig[] = [];
  @Input() data: any[] = [];
  @Input() enablePagination: boolean = false;
  @Input() pageSize: number = 10;
  @Input() showSearch: boolean = false;
  @Input() rowClass: string = '';
  @Input() emptyMessage: string = 'No data available';
  @Input() loading: boolean = false;

  @Output() rowClick = new EventEmitter<any>();
  @Output() buttonClick = new EventEmitter<{row: any, column: ColumnConfig, event: MouseEvent}>();
  @Output() pageChange = new EventEmitter<number>();

  // Pagination properties
  currentPage: number = 1;
  totalItems: number = 0;
  filteredData: any[] = [];
  displayData: any[] = [];

  // Sorting
  sortField: string | null = null;
  sortDirection: 'asc' | 'desc' = 'asc';

  // Search
  searchQuery: string = '';

  // Make Math available in template
  Math = Math;

  constructor() { }

  ngOnInit(): void {
    this.initializeData();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['data'] || changes['pageSize']) {
      this.initializeData();
    }
  }

  initializeData(): void {
    this.filterData();
    this.sortData();
    this.updateDisplayData();
  }

  filterData(): void {
    if (!this.searchQuery || this.searchQuery.trim() === '') {
      this.filteredData = [...this.data];
    } else {
      const query = this.searchQuery.toLowerCase().trim();

      this.filteredData = this.data.filter(item => {
        // Search across all text columns
        return this.columns.some(column => {
          if (column.type !== 'button' && column.type !== 'template') {
            const value = this.getFieldValue(item, column.field);
            if (value !== undefined && value !== null) {
              return String(value).toLowerCase().includes(query);
            }
          }
          return false;
        });
      });
    }

    this.totalItems = this.filteredData.length;
    this.currentPage = 1; // Reset to first page when filtering
  }

  sortData(): void {
    if (this.sortField) {
      this.filteredData.sort((a, b) => {
        const valueA = this.getFieldValue(a, this.sortField!);
        const valueB = this.getFieldValue(b, this.sortField!);

        if (valueA === valueB) return 0;

        const comparison = valueA < valueB ? -1 : 1;
        return this.sortDirection === 'asc' ? comparison : -comparison;
      });
    }
  }

  updateDisplayData(): void {
    if (this.enablePagination) {
      const startIdx = (this.currentPage - 1) * this.pageSize;
      this.displayData = this.filteredData.slice(startIdx, startIdx + this.pageSize);
    } else {
      this.displayData = this.filteredData;
    }
  }

  onSort(column: ColumnConfig): void {
    if (!column.sortable) return;

    if (this.sortField === column.field) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortField = column.field;
      this.sortDirection = 'asc';
    }

    this.sortData();
    this.updateDisplayData();
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.updateDisplayData();
    this.pageChange.emit(page);
  }

  onSearch(): void {
    this.filterData();
    this.updateDisplayData();
  }

  onRowClick(row: any): void {
    this.rowClick.emit(row);
  }

  onButtonClick(row: any, column: ColumnConfig, event: MouseEvent): void {
    event.stopPropagation();
    this.buttonClick.emit({ row, column, event });
  }

  getFieldValue(row: any, field: string): any {
    // Handle nested properties like 'user.name'
    return field.split('.').reduce((obj, key) =>
      (obj && obj[key] !== undefined) ? obj[key] : undefined, row);
  }

  getFormattedValue(row: any, column: ColumnConfig): string {
    const value = this.getFieldValue(row, column.field);

    if (value === undefined || value === null) {
      return '';
    }

    if (column.formatFn) {
      return column.formatFn(value, row);
    }

    switch (column.type) {
      case 'date':
        // Default date formatting
        return value instanceof Date ?
          value.toLocaleDateString() :
          new Date(value).toLocaleDateString();
      case 'boolean':
        return value ? 'Yes' : 'No';
      default:
        return String(value);
    }
  }

  clearSearch(): void {
    this.searchQuery = '';
    this.onSearch();
  }
}
