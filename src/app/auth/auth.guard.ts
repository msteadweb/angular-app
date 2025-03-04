import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Auth, User } from '@angular/fire/auth';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private auth: Auth, private router: Router) {}

  canActivate(): Observable<boolean> {
    return new Observable<boolean>((observer) => {
      this.auth.onAuthStateChanged(async (user) => {
        if (!user) {
          this.router.navigate(['/login']);
          observer.next(false);
          observer.complete();
          return;
        }

        // ✅ Ensure user email is verified before granting access
        await user.reload(); 
        if (!user.emailVerified) {
          this.router.navigate(['/email-verification']);
          observer.next(false);
        } else {
          observer.next(true);
        }
        observer.complete();
      });
    });
  }
}
