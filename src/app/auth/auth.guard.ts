import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Auth } from '@angular/fire/auth';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private auth: Auth, private router: Router) {}

  async canActivate(): Promise<boolean> {
    const user = this.auth.currentUser;
    if (!user) {
      this.router.navigate(['/login']);
      return false;
    }

    await user.reload();
    if (!user.emailVerified) {
      this.router.navigate(['/email-verification']); // ✅ Redirect to email verification page
      return false;
    }

    return true;
  }
}
