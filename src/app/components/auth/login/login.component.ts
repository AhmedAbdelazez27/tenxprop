import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../shared/services/auth.service';
import { MessageService } from 'primeng/api';
import { SpinnerService } from '../../../shared/services/spinner.service';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule,ToastModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
  providers: [MessageService]
})
export class LoginComponent {
  loginForm: FormGroup;

  constructor(private fb: FormBuilder
    , private router: Router
    , private _AuthService : AuthService
    ,private messageService: MessageService
    ,private _SpinnerService: SpinnerService,
  ) {
    this.loginForm = this.fb.group({
      userName: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      this._SpinnerService.showSpinner();
  
      const payload = {
        ...this.loginForm.value,
        tenantId: 7,
        fcm: "",
        tenancyName: "compassint"
      };
  
      console.log(payload);
  
      this._AuthService.login(payload).subscribe({
        next: (res:any) => {
          this._SpinnerService.hideSpinner();
          localStorage.setItem("token", res.result?.accessToken)
          localStorage.setItem("userData",JSON.stringify({name: res.result?.userName,userId: res.result?.userId}))
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Login successful!',
          });
  
          this.router.navigate(['/Main/']);
        },
        error: (error) => {
          this._SpinnerService.hideSpinner();
  
          console.log(error);
          this.messageService.add({
            severity: 'error',
            summary: 'Login Failed',
            detail: error?.error?.message || 'Invalid credentials',
          });
        }
      });
  
    } else {
      // ✅ Toast message for invalid form
      this.messageService.add({
        severity: 'warn',
        summary: 'Validation Error',
        detail: 'Please fill all required fields',
      });
  
      this.loginForm.markAllAsTouched(); 
    }
  }
  

  loginWithOtp() {
    this.router.navigate(['/auth/otp']);
  }
}
