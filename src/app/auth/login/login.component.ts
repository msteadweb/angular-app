import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  errorMessage: string = '';

  constructor(private authService: AuthService, private router: Router) {}

  async login() {
    this.errorMessage = ''; // Reset errors

    if (!this.email || !this.password) {
      this.errorMessage = 'Email and Password are required!';
      return;
    }

    const error = await this.authService.login(this.email, this.password);
    if (error) {
      this.errorMessage = error;
      return;
    }

    // ✅ Redirect after successful login
    this.router.navigate(['/dashboard']);
  }
}
