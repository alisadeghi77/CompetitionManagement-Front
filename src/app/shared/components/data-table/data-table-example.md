# Data Table Component Usage Example

## Basic Usage

```typescript
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataTableComponent, ColumnConfig } from '../shared/components/data-table/data-table.component';

interface User {
  id: number;
  name: string;
  email: string;
  active: boolean;
  registrationDate: Date;
}

@Component({
  selector: 'app-users-list',
  standalone: true,
  imports: [CommonModule, DataTableComponent],
  template: `
    <div class="container mt-4">
      <h2>Users</h2>
      
      <app-data-table
        [columns]="columns"
        [data]="users"
        [enablePagination]="true"
        [pageSize]="10"
        [showSearch]="true"
        [emptyMessage]="'No users found'"
        (rowClick)="onUserClick($event)"
        (buttonClick)="onButtonClick($event)">
      </app-data-table>
    </div>
  `
})
export class UsersListComponent implements OnInit {
  users: User[] = [];
  
  columns: ColumnConfig[] = [
    { field: 'id', title: 'ID', sortable: true, width: '80px' },
    { field: 'name', title: 'Name', sortable: true },
    { field: 'email', title: 'Email' },
    { field: 'active', title: 'Status', type: 'boolean' },
    { field: 'registrationDate', title: 'Registration Date', type: 'date', sortable: true },
    { 
      field: 'id', 
      title: 'Actions', 
      type: 'button', 
      buttonText: 'Edit', 
      buttonClass: 'btn btn-sm btn-outline-primary' 
    }
  ];
  
  constructor() {}
  
  ngOnInit(): void {
    // Load users data
    this.users = [
      { 
        id: 1, 
        name: 'John Doe', 
        email: 'john@example.com', 
        active: true, 
        registrationDate: new Date('2023-01-15') 
      },
      // ... more users
    ];
  }
  
  onUserClick(user: User): void {
    console.log('User clicked:', user);
    // Handle row click - e.g., navigate to user details
  }
  
  onButtonClick(event: {row: User, column: ColumnConfig, event: MouseEvent}): void {
    console.log('Button clicked:', event);
    // Handle button click - e.g., open edit modal
  }
}
```

## With Custom Template

```typescript
@Component({
  selector: 'app-users-list-with-template',
  standalone: true,
  imports: [CommonModule, DataTableComponent],
  template: `
    <div class="container mt-4">
      <h2>Users with Custom Status</h2>
      
      <app-data-table
        [columns]="columns"
        [data]="users"
        [enablePagination]="true"
        [showSearch]="true">
        
        <!-- Define template for status column -->
        <ng-template #statusTemplate let-user>
          <span class="badge" [ngClass]="user.active ? 'bg-success' : 'bg-danger'">
            {{ user.active ? 'Active' : 'Inactive' }}
          </span>
        </ng-template>
        
      </app-data-table>
    </div>
  `
})
export class UsersListWithTemplateComponent implements OnInit {
  users: User[] = [];
  
  @ViewChild('statusTemplate', { static: true }) statusTemplate!: TemplateRef<any>;
  
  columns: ColumnConfig[] = [];
  
  ngOnInit(): void {
    // Set columns after template is available
    this.columns = [
      { field: 'id', title: 'ID', sortable: true },
      { field: 'name', title: 'Name', sortable: true },
      { field: 'email', title: 'Email' },
      { field: 'active', title: 'Status', type: 'template', template: this.statusTemplate },
      { field: 'registrationDate', title: 'Registration Date', type: 'date' }
    ];
    
    // Load data
    this.loadUsers();
  }
  
  loadUsers(): void {
    // Load users from API or service
  }
}
```

## Client-side Pagination Example

```typescript
@Component({
  selector: 'app-products-list',
  standalone: true,
  imports: [CommonModule, DataTableComponent],
  template: `
    <div class="container mt-4">
      <h2>Products</h2>
      
      <app-data-table
        [columns]="columns"
        [data]="products"
        [enablePagination]="true"
        [pageSize]="5"
        [showSearch]="true"
        (pageChange)="onPageChange($event)">
      </app-data-table>
    </div>
  `
})
export class ProductsListComponent {
  products: any[] = [
    // Array of product objects
  ];
  
  columns: ColumnConfig[] = [
    { field: 'id', title: 'ID', sortable: true },
    { field: 'name', title: 'Product Name', sortable: true },
    { field: 'price', title: 'Price', type: 'number', formatFn: (value) => `$${value.toFixed(2)}` },
    { field: 'inStock', title: 'In Stock', type: 'boolean' }
  ];
  
  onPageChange(page: number): void {
    console.log('Page changed to:', page);
    // Can be used for analytics or other tracking
  }
}
```

## Notes

- The component handles client-side pagination, sorting, and searching
- For server-side pagination, simply don't set the `enablePagination` flag to true, and handle the pagination in your parent component
- Custom templates allow for complex cell rendering when needed
- Button columns emit events that can be handled in the parent component 
