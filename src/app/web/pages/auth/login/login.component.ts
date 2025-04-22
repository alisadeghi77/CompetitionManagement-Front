import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { AuthService } from '../../../../core/http-services/auth.service';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterLink],
  templateUrl: './login.component.html'
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
        this.router.navigateByUrl(this.returnUrl);
      }
    });

    // Get the returnUrl from query params
    this.route.queryParams.subscribe(params => {
      if (params['returnUrl']) {
        this.returnUrl = params['returnUrl'];
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
