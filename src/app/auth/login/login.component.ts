import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Auth, signInWithEmailAndPassword, onAuthStateChanged } from '@angular/fire/auth';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  imports: [CommonModule, FormsModule],
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
        this.router.navigate(['/dashboard']); // ✅ Redirect to dashboard if already logged in
      }
    });
  }

  async login() {
    this.errorMessage = null;
    try {
      await signInWithEmailAndPassword(this.auth, this.email, this.password);
      this.router.navigate(['/dashboard']); // ✅ Redirect to dashboard on successful login
    } catch (error: any) {
      this.errorMessage = error.message;
    }
  }
}
