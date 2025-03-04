import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Auth, onAuthStateChanged, signInWithEmailAndPassword } from '@angular/fire/auth';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // ✅ Import FormsModule for [(ngModel)]

@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  imports: [CommonModule, FormsModule], // ✅ Add FormsModule
})
export class LoginComponent implements OnInit {
  email = '';
  password = '';
  errorMessage: string | null = null;
  isLoading = false; // ✅ Use `isLoading` instead of `loading`

  constructor(private auth: Auth, private router: Router) {}

  ngOnInit() {
    onAuthStateChanged(this.auth, (user) => {
      if (user) {
        this.router.navigate(['/dashboard']);
      }
    });
  }

  successMessage: string | null = null; // ✅ Add success message state

async login() {
  this.errorMessage = null;
  this.successMessage = null; // Reset messages
  this.isLoading = true;

  try {
    await signInWithEmailAndPassword(this.auth, this.email, this.password);
    this.successMessage = 'Login successful! Redirecting...'; // ✅ Show success message
    setTimeout(() => this.router.navigate(['/dashboard']), 1500); // ✅ Delay for UX
  } catch (error: any) {
    const errorMessages: { [key: string]: string } = {
      'auth/invalid-credential': 'Invalid email or password. Please try again.',
      'auth/user-not-found': 'No account found with this email.',
      'auth/wrong-password': 'Incorrect password. Try again.',
      'auth/too-many-requests': 'Too many failed attempts. Try again later.',
      'auth/network-request-failed': 'Network error. Check your connection.',
    };
  
    this.errorMessage = errorMessages[error.code] || 'An unexpected error occurred.';
  
    // Automatically clear error after 5 seconds
    setTimeout(() => {
      this.errorMessage = null;
    }, 5000);
  }
  
   finally {
    this.isLoading = false;
  }
}

  
}
