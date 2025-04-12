import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../../../core/http-services/auth.service';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  template: `
    <div class="login-container">
      <div class="login-card">
        <h2>ورود به سیستم</h2>

        <div *ngIf="isAuthenticated; else loginForm">
          <p>شما قبلاً وارد شده‌اید!</p>
          <button (click)="logout()" class="btn-logout">خروج</button>
        </div>

        <ng-template #loginForm>
          <form [formGroup]="phoneForm" (ngSubmit)="onSubmit()">
            <div class="form-group">
              <label for="phoneNumber">شماره موبایل</label>
              <input
                type="text"
                id="phoneNumber"
                formControlName="phoneNumber"
                placeholder="09XXXXXXXXX"
                dir="ltr"
              >
              <div *ngIf="phoneForm.get('phoneNumber')?.invalid && phoneForm.get('phoneNumber')?.touched" class="error-message">
                شماره موبایل معتبر وارد کنید
              </div>
            </div>
            <button
              type="submit"
              [disabled]="phoneForm.invalid || isLoading"
              class="btn-submit"
            >
              <span *ngIf="isLoading">در حال ارسال...</span>
              <span *ngIf="!isLoading">ارسال کد تایید</span>
            </button>
          </form>
        </ng-template>

        <div *ngIf="errorMessage" class="error-message">
          {{ errorMessage }}
        </div>
      </div>
    </div>
  `,
  styles: [`
    .login-container {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 80vh;
      font-family: 'IRANSans', sans-serif;
    }

    .login-card {
      background: white;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.1);
      padding: 2rem;
      width: 100%;
      max-width: 400px;
      text-align: right;
    }

    h2 {
      margin-bottom: 1.5rem;
      color: #333;
    }

    .form-group {
      margin-bottom: 1.5rem;
    }

    label {
      display: block;
      margin-bottom: 0.5rem;
      font-weight: bold;
    }

    input {
      width: 100%;
      padding: 0.75rem;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 1rem;
      transition: border-color 0.3s;
    }

    input:focus {
      border-color: #4a90e2;
      outline: none;
    }

    .btn-submit {
      background: #4a90e2;
      color: white;
      border: none;
      border-radius: 4px;
      padding: 0.75rem 1rem;
      font-size: 1rem;
      cursor: pointer;
      width: 100%;
      transition: background 0.3s;
    }

    .btn-submit:hover {
      background: #3a7bc8;
    }

    .btn-submit:disabled {
      background: #cccccc;
      cursor: not-allowed;
    }

    .btn-logout {
      background: #e74c3c;
      color: white;
      border: none;
      border-radius: 4px;
      padding: 0.75rem 1rem;
      font-size: 1rem;
      cursor: pointer;
      width: 100%;
      transition: background 0.3s;
    }

    .btn-logout:hover {
      background: #c0392b;
    }

    .error-message {
      color: #e74c3c;
      margin-top: 0.5rem;
      font-size: 0.875rem;
    }
  `]
})
export class LoginComponent implements OnInit {
  phoneForm: FormGroup;
  isLoading = false;
  errorMessage = '';
  isAuthenticated = false;
  returnUrl: string | null = null;

  constructor(
    private authService: AuthService,
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.phoneForm = this.fb.group({
      phoneNumber: ['', [
        Validators.required,
        Validators.pattern('^09[0-9]{9}$')
      ]]
    });
  }

  ngOnInit(): void {
    this.authService.currentUser$.subscribe(user => {
      this.isAuthenticated = !!user;

      // If user is authenticated and returnUrl is present, redirect to returnUrl
      if (this.isAuthenticated && this.returnUrl) {
        this.router.navigateByUrl(decodeURIComponent(this.returnUrl));
      }
    });

    // Get the returnUrl from query params
    this.route.queryParams.subscribe(params => {
      if (params['returnUrl']) {
        this.returnUrl = params['returnUrl'];
        console.log(this.returnUrl)
      }
    });
  }

  onSubmit(): void {
    if (this.phoneForm.invalid) return;

    this.isLoading = true;
    this.errorMessage = '';

    const phoneNumber = this.phoneForm.get('phoneNumber')?.value;

    this.authService.login(phoneNumber).subscribe({
      next: (response) => {
        this.isLoading = false;
        // Navigate to verify with the phone number and returnUrl
        console.log("bf nav", this.returnUrl)
        this.router.navigate(['/verify'], {
          queryParams: {
            phoneNumber: phoneNumber,
            returnUrl: this.returnUrl
          }
        });
      },
      error: (error) => {
        this.isLoading = false;
        this.errorMessage = error?.error?.message || 'خطا در ارسال کد تایید. لطفا دوباره تلاش کنید.';
      }
    });
  }

  logout(): void {
    this.authService.logout();
  }
}
