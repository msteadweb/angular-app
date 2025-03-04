import { Component } from '@angular/core';
import { CommonModule } from '@angular/common'; // ✅ Import for *ngIf
import { FormsModule } from '@angular/forms'; // ✅ Import for [(ngModel)]
import { Auth, signInWithEmailAndPassword } from '@angular/fire/auth';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  imports: [CommonModule, FormsModule], // ✅ Add required modules
})
export class LoginComponent {
  email = '';
  password = '';
  errorMessage: string | null = null;

  constructor(private auth: Auth, private router: Router) {}

  async login() {
    this.errorMessage = null; // ✅ Clear previous error
    try {
      await signInWithEmailAndPassword(this.auth, this.email, this.password);
      this.router.navigate(['/dashboard']); // ✅ Redirect to dashboard on success
    } catch (error: any) {
      this.errorMessage = error.message; // ✅ Show error message
    }
  }
}
