import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule],  // ✅ Ensure FormsModule is imported
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  errorMessage: string = '';

  login() {
    this.errorMessage = ''; // Reset error message before processing

    if (!this.email || !this.password) {
      this.errorMessage = 'Email and Password are required!';
      return;
    }

    console.log('Login clicked with:', this.email, this.password);
  }
}
