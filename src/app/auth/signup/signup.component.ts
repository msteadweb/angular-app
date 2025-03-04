import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../auth.service';  // ✅ Import AuthService
import { Router } from '@angular/router'; // ✅ Import Router for navigation

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent {
  email: string = '';
  password: string = '';
  errorMessage: string = '';

  constructor(private authService: AuthService, private router: Router) {} // ✅ Inject AuthService & Router

  async signup() {
    this.errorMessage = ''; // Reset error message before processing

    if (!this.email || !this.password) {
      this.errorMessage = 'Email and Password are required!';
      return;
    }

    try {
      console.log('Signup request:', this.email, this.password);
      await this.authService.signup(this.email, this.password);
      console.log('Signup successful!');
      this.router.navigate(['/login']); // ✅ Redirect user to login page
    } catch (error: any) {
      console.error('Signup error:', error);
      this.errorMessage = error.message;
    }
  }
}
