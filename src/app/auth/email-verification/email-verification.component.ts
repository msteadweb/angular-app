import { Component } from '@angular/core';
import { Auth, sendEmailVerification } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common'; // ✅ Import CommonModule

@Component({
  selector: 'app-email-verification',
  standalone: true,
  imports: [CommonModule], // ✅ Add CommonModule to use *ngIf
  templateUrl: './email-verification.component.html',
  styleUrls: ['./email-verification.component.css'],
})
export class EmailVerificationComponent {
  message: string = '';
  errorMessage: string = '';
  isProcessing: boolean = false;

  constructor(private auth: Auth, private router: Router) {}

  async sendVerificationEmail() {
    if (this.isProcessing) return; // Prevent spam clicking
  
    const user = this.auth.currentUser;
    if (!user) {
      this.errorMessage = 'No user is logged in.';
      return;
    }
  
    this.isProcessing = true;
    this.errorMessage = '';
    this.message = '';
  
    try {
      await sendEmailVerification(user);
      this.message = 'Verification email sent! Check your inbox.';
      
      // ✅ Disable button for 1 minute
      setTimeout(() => {
        this.isProcessing = false;
      }, 60000); // 60 seconds
    } catch (error: any) {
      if (error.code === 'auth/too-many-requests') {
        this.errorMessage = 'Too many attempts. Please wait before trying again.';
      } else {
        this.errorMessage = 'Something went wrong. Please try again later.';
      }
    }
  }
  

  private getErrorMessage(errorCode: string): string {
    const errorMessages: { [key: string]: string } = {
      'auth/too-many-requests': 'Too many attempts. Try again later.',
      'auth/network-request-failed': 'Network error. Check your connection.',
    };
    return errorMessages[errorCode] || 'Something went wrong. Please try again.';
  }
}
