import { Injectable } from '@angular/core';
import { Auth, createUserWithEmailAndPassword, signInWithEmailAndPassword, sendEmailVerification, signOut } from '@angular/fire/auth';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private auth: Auth) {}

  // ✅ Signup method for Firebase Authentication
  async signup(email: string, password: string) {
    try {
      const userCredential = await createUserWithEmailAndPassword(this.auth, email, password);
      await sendEmailVerification(userCredential.user); // ✅ Send email verification after signup
      console.log('User signed up:', userCredential.user);
      return userCredential.user;
    } catch (error: any) {
      console.error('Signup error:', error);
      throw new Error(this.getErrorMessage(error.code));
    }
  }

  // ✅ Login method
  async login(email: string, password: string): Promise<string | null> {
    try {
      const userCredential = await signInWithEmailAndPassword(this.auth, email, password);
      const user = userCredential.user;

      // ✅ Check if email is verified
      await user.reload();
      if (!user.emailVerified) {
        return 'Please verify your email before logging in.';
      }

      return null; // No errors, login successful
    } catch (error: any) {
      return error.message; // Return error message to display
    }
  }

  // ✅ Logout method
  async logout() {
    try {
      await signOut(this.auth);
      console.log('User logged out');
    } catch (error: any) {
      console.error('Logout error:', error);
      throw new Error('Logout failed. Please try again.');
    }
  }

  // ✅ Error handling method
  private getErrorMessage(errorCode: string): string {
    const errorMessages: { [key: string]: string } = {
      'auth/email-already-in-use': 'Email is already registered. Try logging in.',
      'auth/invalid-email': 'Invalid email format.',
      'auth/user-not-found': 'User not found. Please sign up first.',
      'auth/wrong-password': 'Incorrect password. Try again.',
      'auth/too-many-requests': 'Too many failed attempts. Try again later.',
      'auth/network-request-failed': 'Network error. Check your internet connection.',
      'auth/weak-password': 'Password should be at least 6 characters long.',
    };
    return errorMessages[errorCode] || 'Authentication failed. Please try again.';
  }
}
