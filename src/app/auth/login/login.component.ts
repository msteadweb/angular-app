import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule], // ✅ Ensure FormsModule is imported
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  errorMessage: string = '';

  constructor(private authService: AuthService, private router: Router) {}

  async login() {
    this.errorMessage = ''; // Reset error message before processing

    if (!this.email || !this.password) {
      this.errorMessage = 'Email and Password are required!';
      return;
    }

    try {
      await this.authService.login(this.email, this.password);
      console.log('Login successful');
      this.router.navigate(['/dashboard']); // ✅ Redirect to dashboard on success
    } catch (error: any) {
      this.errorMessage = error.message;
    }
  }
}
