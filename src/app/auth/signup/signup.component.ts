import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';  // ✅ Import CommonModule

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [FormsModule, CommonModule],  // ✅ Add CommonModule
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent {
  email: string = '';
  password: string = '';
  errorMessage: string = '';

  signup() {
    this.errorMessage = ''; // Reset error message before processing

    if (!this.email || !this.password) {
      this.errorMessage = 'Email and Password are required!';
      return;
    }

    console.log('Signup clicked with:', this.email, this.password);
  }
}
