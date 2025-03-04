import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Auth, sendPasswordResetEmail } from '@angular/fire/auth';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [FormsModule, CommonModule], // ✅ Import FormsModule to use ngModel
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css'],
})
export class ForgotPasswordComponent {
  email: string = ''; // ✅ Define email property
  message: string = ''; // ✅ Define success message property
  errorMessage: string = ''; // ✅ Define error message property

  constructor(private auth: Auth) {} // ✅ Inject Firebase Auth service

  async resetPassword() {
    this.message = ''; // Reset success message
    this.errorMessage = ''; // Reset error message

    if (!this.email) {
      this.errorMessage = 'Please enter your email.';
      return;
    }

    try {
      await sendPasswordResetEmail(this.auth, this.email);
      this.message = 'Password reset email sent. Check your inbox!';
    } catch (error: any) {
      this.errorMessage = this.getErrorMessage(error.code);
    }
  }

  private getErrorMessage(errorCode: string): string {
    const errorMessages: { [key: string]: string } = {
      'auth/invalid-email': 'Invalid email format.',
      'auth/user-not-found': 'No account found with this email.',
      'auth/network-request-failed': 'Network error. Check your connection.',
    };
    return errorMessages[errorCode] || 'Password reset failed. Try again.';
  }
}
