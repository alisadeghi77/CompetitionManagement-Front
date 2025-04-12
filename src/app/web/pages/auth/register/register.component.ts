import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { UserService, RegisterRequest } from '../../../../core/http-services/user.service';
import { AuthService } from '../../../../core/http-services/auth.service';
import { HttpErrorResponse } from '@angular/common/http';

export type RegisterType = 'planner' | 'participant';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <div class="register-container">
      <div class="register-card">
        <h2>ثبت نام {{ getRegisterTypeTitle() }}</h2>

        <form [formGroup]="registerForm" (ngSubmit)="onSubmit()">
          <div class="form-group">
            <label for="firstName">نام</label>
            <input
              type="text"
              id="firstName"
              formControlName="firstName"
              placeholder="نام خود را وارد کنید"
            >
            <div *ngIf="registerForm.get('firstName')?.invalid && registerForm.get('firstName')?.touched" class="error-message">
              لطفاً نام خود را وارد کنید
            </div>
          </div>

          <div class="form-group">
            <label for="lastName">نام خانوادگی</label>
            <input
              type="text"
              id="lastName"
              formControlName="lastName"
              placeholder="نام خانوادگی خود را وارد کنید"
            >
            <div *ngIf="registerForm.get('lastName')?.invalid && registerForm.get('lastName')?.touched" class="error-message">
              لطفاً نام خانوادگی خود را وارد کنید
            </div>
          </div>

          <div class="form-group">
            <label for="phoneNumber">شماره موبایل</label>
            <input
              type="text"
              id="phoneNumber"
              formControlName="phoneNumber"
              placeholder="09XXXXXXXXX"
              dir="ltr"
            >
            <div *ngIf="registerForm.get('phoneNumber')?.invalid && registerForm.get('phoneNumber')?.touched" class="error-message">
              شماره موبایل معتبر وارد کنید
            </div>
          </div>

          <button
            type="submit"
            [disabled]="registerForm.invalid || isLoading"
            class="btn-submit"
          >
            <span *ngIf="isLoading">در حال ثبت نام...</span>
            <span *ngIf="!isLoading">ثبت نام</span>
          </button>
        </form>

        <div class="login-link">
          <p>قبلاً ثبت نام کرده‌اید؟ <a [routerLink]="['/login']" [queryParams]="{ returnUrl: returnUrl }">ورود</a></p>
        </div>

        <div *ngIf="errorMessage" class="error-message">
          {{ errorMessage }}
        </div>
      </div>
    </div>
  `,
  styles: [`
    .register-container {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 80vh;
      font-family: 'IRANSans', sans-serif;
    }

    .register-card {
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

    .login-link, .register-toggle {
      margin-top: 1.5rem;
      text-align: center;
    }

    .login-link a, .register-toggle a {
      color: #4a90e2;
      text-decoration: none;
    }

    .login-link a:hover, .register-toggle a:hover {
      text-decoration: underline;
    }

    .error-message {
      color: #e74c3c;
      margin-top: 0.5rem;
      font-size: 0.875rem;
    }
  `]
})
export class RegisterComponent implements OnInit {
  registerType: RegisterType = 'participant';

  registerForm: FormGroup;
  isLoading = false;
  errorMessage = '';
  returnUrl: string | null = null;

  constructor(
    private userService: UserService,
    private authService: AuthService,
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.registerForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      phoneNumber: ['', [
        Validators.required,
        Validators.pattern('^09[0-9]{9}$')
      ]]
    });
  }

  ngOnInit(): void {
    // Get returnUrl from query params
    this.route.queryParams.subscribe(params => {
      if (params['returnUrl']) {
        this.returnUrl = params['returnUrl'];
      }
    });

    // Get registerType from route data
    this.route.data.subscribe(data => {
      if (data['registerType']) {
        this.registerType = data['registerType'] as RegisterType;
      }
    });
  }

  getRegisterTypeTitle(): string {
    return this.registerType === 'planner' ? 'برنامه‌ریز' : 'شرکت‌کننده';
  }

  onSubmit(): void {
    if (this.registerForm.invalid) return;

    this.isLoading = true;
    this.errorMessage = '';

    const registerData: RegisterRequest = {
      firstName: this.registerForm.get('firstName')?.value,
      lastName: this.registerForm.get('lastName')?.value,
      phoneNumber: this.registerForm.get('phoneNumber')?.value
    };

    // Choose API based on registerType
    const registerObservable = this.registerType === 'planner'
      ? this.userService.registerPlanner(registerData)
      : this.userService.registerParticipant(registerData);

    registerObservable.subscribe({
      next: (response: any) => {
        this.isLoading = false;

        // On successful registration, navigate to verify page
        this.router.navigate(['/verify'], {
          queryParams: {
            phoneNumber: registerData.phoneNumber,
            returnUrl: this.returnUrl
          }
        });
      },
      error: (error: HttpErrorResponse) => {
        this.isLoading = false;
        this.errorMessage = error?.error?.message || 'خطا در ثبت نام. لطفا دوباره تلاش کنید.';
      }
    });
  }
}
