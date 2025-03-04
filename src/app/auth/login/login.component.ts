import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../auth.service';  // ✅ Import AuthService
import { Router } from '@angular/router'; // ✅ Import Router for navigation

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule], 
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  errorMessage: string = '';

  constructor(private authService: AuthService, private router: Router) {} // ✅ Inject AuthService & Router

  async login() {
    this.errorMessage = ''; // Reset error message before processing

    if (!this.email || !this.password) {
      this.errorMessage = 'Email and Password are required!';
      return;
    }

    try {
      const user = await this.authService.login(this.email, this.password);
      console.log('User logged in:', user);
      this.router.navigate(['/dashboard']); // ✅ Redirect after login
    } catch (error: any) {
      this.errorMessage = error.message; // ✅ Display error message
    }
  }
}
