import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Auth, onAuthStateChanged, signInWithEmailAndPassword } from '@angular/fire/auth';

@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  email = '';
  password = '';
  errorMessage: string | null = null;

  constructor(private auth: Auth, private router: Router) {}

  ngOnInit() {
    // Check if the user is already logged in
    onAuthStateChanged(this.auth, (user) => {
      if (user) {
        this.router.navigate(['/dashboard']); // Redirect to dashboard if logged in
      }
    });
  }

  async login() {
    this.errorMessage = null;
    try {
      await signInWithEmailAndPassword(this.auth, this.email, this.password);
      this.router.navigate(['/dashboard']); // Redirect to dashboard after login
    } catch (error: any) {
      this.errorMessage = error.message;
    }
  }
}
