import { Injectable } from '@angular/core';
import { Auth, signInWithEmailAndPassword, signOut } from '@angular/fire/auth';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private auth: Auth) {}

  async login(email: string, password: string) {
    try {
      const userCredential = await signInWithEmailAndPassword(this.auth, email, password);
      console.log('User logged in:', userCredential.user);
      return userCredential.user;
    } catch (error: any) {
      console.error('Login error:', error);
      throw new Error(this.getErrorMessage(error.code));
    }
  }

  async logout() {
    try {
      await signOut(this.auth);
      console.log('User logged out');
    } catch (error: any) {
      console.error('Logout error:', error);
      throw new Error('Logout failed. Please try again.');
    }
  }

  private getErrorMessage(errorCode: string): string {
    const errorMessages: { [key: string]: string } = {
      'auth/invalid-email': 'Invalid email format.',
      'auth/user-not-found': 'User not found. Please sign up first.',
      'auth/wrong-password': 'Incorrect password. Try again.',
      'auth/too-many-requests': 'Too many failed attempts. Try again later.',
      'auth/network-request-failed': 'Network error. Check your internet connection.',
    };
    return errorMessages[errorCode] || 'Login failed. Please try again.';
  }
}
