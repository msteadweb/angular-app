import { Component } from '@angular/core';
import { CommonModule } from '@angular/common'; // ✅ Import CommonModule for *ngIf
import { Auth, sendEmailVerification } from '@angular/fire/auth';
import { Router } from '@angular/router';

@Component({
  selector: 'app-email-verification',
  standalone: true,
  imports: [CommonModule], // ✅ Add CommonModule to enable *ngIf
  templateUrl: './email-verification.component.html',
  styleUrls: ['./email-verification.component.css'],
})
export class EmailVerificationComponent {
  message: string = '';
  errorMessage: string = '';
  isProcessing: boolean = false;
  showResendButton: boolean = false; // ✅ Initially hidden
  countdown: number = 60; // ✅ Countdown timer for resend button
  countdownInterval: any;
  emailSent: boolean = false; // ✅ Tracks if the email has been sent

  constructor(private auth: Auth, private router: Router) {}

  async sendVerificationEmail() {
    if (this.isProcessing) return;

    const user = this.auth.currentUser;
    if (!user) {
      this.errorMessage = 'No user is logged in.';
      return;
    }

    await user.reload();
    if (user.emailVerified) {
      this.message = 'Your email is already verified.';
      return;
    }

    this.isProcessing = true;
    this.errorMessage = '';
    this.message = '';
    this.showResendButton = false;
    this.emailSent = false; // Reset email sent status

    try {
      await sendEmailVerification(user);
      this.message = `A verification email has been sent to ${user.email}. Please check your inbox.`;
      this.emailSent = true; // ✅ Show confirmation message

      // ✅ Start 60s countdown before showing the resend button
      this.startCountdown();
    } catch (error: any) {
      this.errorMessage = this.getErrorMessage(error.code);
    }

    this.isProcessing = false;
  }

  resendVerificationEmail() {
    this.sendVerificationEmail();
  }

  private startCountdown() {
    this.countdown = 60; // Reset countdown
    this.showResendButton = false;
    this.countdownInterval = setInterval(() => {
      this.countdown--;
      if (this.countdown <= 0) {
        clearInterval(this.countdownInterval);
        this.showResendButton = true; // ✅ Show the resend button after 60s
      }
    }, 1000);
  }

  private getErrorMessage(errorCode: string): string {
    const errorMessages: { [key: string]: string } = {
      'auth/too-many-requests': 'Too many attempts. Try again later.',
      'auth/network-request-failed': 'Network error. Try again.',
    };
    return errorMessages[errorCode] || 'Something went wrong. Please try again.';
  }
}
