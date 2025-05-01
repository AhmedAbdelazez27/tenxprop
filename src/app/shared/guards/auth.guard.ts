import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = async (route, state) => {
  // const authService = inject(AuthService);
  const router = inject(Router);
  const token = localStorage.getItem('token');
  
  if (token) {
    return true;
  } else {
    await router.navigate(['/Auth/Login']);
    return false;
  }
};
