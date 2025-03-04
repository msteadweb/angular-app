import { Component, inject, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Auth, signInWithEmailAndPassword } from '@angular/fire/auth';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  imports: [CommonModule, FormsModule],
})
export class LoginComponent {
  email = '';
  password = '';
  errorMessage: string | null = null;

  private auth = inject(Auth);
  private router = inject(Router);
  private ngZone = inject(NgZone); // ✅ Inject Angular's Zone

  async login() {
    this.errorMessage = null; 
    try {
      const userCredential = await signInWithEmailAndPassword(this.auth, this.email, this.password);
      
      // ✅ Ensure Angular runs the navigation inside its zone
      this.ngZone.run(() => {
        this.router.navigate(['/dashboard']);
      });

    } catch (error: any) {
      this.ngZone.run(() => {
        this.errorMessage = error.message;
      });
    }
  }
}
