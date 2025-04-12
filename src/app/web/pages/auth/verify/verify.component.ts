import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../../../core/http-services/auth.service';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-verify',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  template: `
    <div class="verify-container">
      <div class="verify-card">
        <h2>تأیید کد</h2>
        <p>کد تأیید ارسال شده به شماره {{ phoneNumber }} را وارد کنید</p>

        <form [formGroup]="verifyForm" (ngSubmit)="onSubmit()">
          <div class="form-group">
            <label for="otpCode">کد تأیید</label>
            <input
              type="text"
              id="otpCode"
              formControlName="otpCode"
              placeholder="****"
              maxlength="4"
              dir="ltr"
            >
            <div *ngIf="verifyForm.get('otpCode')?.invalid && verifyForm.get('otpCode')?.touched" class="error-message">
              کد تأیید معتبر وارد کنید
            </div>
          </div>
          <button
            type="submit"
            [disabled]="verifyForm.invalid || isLoading"
            class="btn-submit"
          >
            <span *ngIf="isLoading">در حال بررسی...</span>
            <span *ngIf="!isLoading">تأیید</span>
          </button>
        </form>

        <div class="back-section">
          <a (click)="goBack()" class="back-link">بازگشت به صفحه ورود</a>
        </div>

        <div *ngIf="errorMessage" class="error-message">
          {{ errorMessage }}
        </div>
      </div>
    </div>
  `,
  styles: [`
    .verify-container {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 80vh;
      font-family: 'IRANSans', sans-serif;
    }

    .verify-card {
      background: white;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.1);
      padding: 2rem;
      width: 100%;
      max-width: 400px;
      text-align: right;
    }

    h2 {
      margin-bottom: 1rem;
      color: #333;
    }

    p {
      margin-bottom: 1.5rem;
      color: #666;
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
      text-align: center;
      letter-spacing: 0.5rem;
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

    .back-section {
      margin-top: 1.5rem;
      text-align: center;
    }

    .back-link {
      color: #4a90e2;
      text-decoration: none;
      cursor: pointer;
    }

    .back-link:hover {
      text-decoration: underline;
    }

    .error-message {
      color: #e74c3c;
      margin-top: 0.5rem;
      font-size: 0.875rem;
    }
  `]
})
export class VerifyComponent implements OnInit {
  verifyForm: FormGroup;
  isLoading = false;
  errorMessage = '';
  phoneNumber = '';
  returnUrl: string | null = null;

  constructor(
    private authService: AuthService,
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.verifyForm = this.fb.group({
      otpCode: ['', [
        Validators.required,
        Validators.pattern('^[0-9]{4}$')
      ]]
    });
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      if (params['phoneNumber']) {
        this.phoneNumber = params['phoneNumber'];
      } else {
        // If no phone number, redirect to login
        this.router.navigate(['/login']);
      }

      // Get returnUrl if present
      if (params['returnUrl']) {
        this.returnUrl = params['returnUrl'];
        console.log("af nav",this.returnUrl)

      }
    });
  }

  onSubmit(): void {
    if (this.verifyForm.invalid || !this.phoneNumber) return;

    this.isLoading = true;
    this.errorMessage = '';

    const otpCode = this.verifyForm.get('otpCode')?.value;

    this.authService.verify(this.phoneNumber, otpCode).subscribe({
      next: (response) => {
        this.isLoading = false;

        // Store token and user data
        if (response.token) {
          this.authService.setToken(response.token);
        }

        if (response.user) {
          this.authService.setUser(response.user);
        }

        // Redirect to returnUrl if present, otherwise to home
        if (this.returnUrl) {
          this.router.navigateByUrl(decodeURIComponent(this.returnUrl));
        } else {
          this.router.navigate(['/']);
        }
      },
      error: (error) => {
        this.isLoading = false;
        this.errorMessage = error?.error?.message || 'کد وارد شده صحیح نیست. لطفا دوباره تلاش کنید.';
      }
    });
  }

  goBack(): void {
    // Pass returnUrl back to login page if present
    if (this.returnUrl) {
      this.router.navigate(['/login'], {
        queryParams: { returnUrl: this.returnUrl }
      });
    } else {
      this.router.navigate(['/login']);
    }
  }
}
