import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Auth, onAuthStateChanged, User } from '@angular/fire/auth';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  private currentUser: User | null = null;

  constructor(private auth: Auth, private router: Router) {
    // ✅ Listen for auth state changes to keep track of the current user
    onAuthStateChanged(this.auth, (user) => {
      this.currentUser = user;
    });
  }

  async canActivate(): Promise<boolean> {
    if (!this.currentUser) {
      this.router.navigate(['/login']);
      return false;
    }

    // ✅ Check if the user's email is verified
    await this.currentUser.reload();
    if (!this.currentUser.emailVerified) {
      this.router.navigate(['/email-verification']);
      return false;
    }

    return true;
  }
}
