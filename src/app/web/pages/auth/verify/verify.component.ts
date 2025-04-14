import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { AuthService } from '../../../../core/http-services/auth.service';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-verify',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterLink],
  templateUrl: './verify.component.html',
  styleUrls: ['./verify.component.scss']
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
      }
    });
  }

  onSubmit(): void {
    if (this.verifyForm.invalid || !this.phoneNumber) return;

    this.isLoading = true;
    this.errorMessage = '';

    const otpCode = this.verifyForm.get('otpCode')?.value;

    this.authService.verify(this.phoneNumber, otpCode).subscribe({
      next: (response: any) => {
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
          this.router.navigateByUrl(this.returnUrl);
        } else {
          this.router.navigate(['/']);
        }
      },
      error: (error: HttpErrorResponse) => {
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
