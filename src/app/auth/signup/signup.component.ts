import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../auth.service';  
import { Router } from '@angular/router';

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
  isProcessing: boolean = false; // ✅ Added to manage button state

  constructor(private authService: AuthService, private router: Router) {}

  async signup() {
    this.errorMessage = ''; 
    if (!this.email || !this.password) {
      this.errorMessage = 'Email and Password are required!';
      return;
    }

    this.isProcessing = true; // ✅ Disable button during processing

    try {
      console.log('Signup request:', this.email, this.password);
      await this.authService.signup(this.email, this.password);
      console.log('Signup successful!');
  
      this.router.navigate(['/email-verification']); // ✅ Redirect user to email verification page
    } catch (error: any) {
      console.error('Signup error:', error);
      this.errorMessage = error.message;
    }

    this.isProcessing = false; // ✅ Re-enable button after processing
  }

  private getErrorMessage(errorCode: string): string {
    const errorMessages: { [key: string]: string } = {
      'auth/email-already-in-use': 'This email is already registered.',
      'auth/invalid-email': 'Invalid email format.',
      'auth/weak-password': 'Password should be at least 6 characters.',
      'auth/network-request-failed': 'Network error. Please try again.',
    };
    return errorMessages[errorCode] || 'Something went wrong. Please try again.';
  }
}
