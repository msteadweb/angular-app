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

  async login() {
    this.errorMessage = null;
    this.isLoading = true; // ✅ Set `isLoading` to true
    try {
      await signInWithEmailAndPassword(this.auth, this.email, this.password);
      this.router.navigate(['/dashboard']);
    } catch (error: any) {
      this.errorMessage = error.message;
    } finally {
      this.isLoading = false; // ✅ Reset `isLoading` after login attempt
    }
  }
}
