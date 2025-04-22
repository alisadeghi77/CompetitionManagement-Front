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
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
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
      console.log(params['returnUrl'])
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
