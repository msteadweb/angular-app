import { Component } from '@angular/core';
import { CommonModule } from '@angular/common'; // ✅ Import CommonModule for *ngIf
import { Auth, User, onAuthStateChanged, signOut } from '@angular/fire/auth';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  imports: [CommonModule], // ✅ Add CommonModule
})
export class DashboardComponent {
  user: User | null = null;
  isLoading = true; // ✅ Helps prevent UI flickering

  constructor(private auth: Auth, private router: Router) {
    // ✅ Ensure user state updates correctly
    onAuthStateChanged(this.auth, (user) => {
      this.user = user;
      this.isLoading = false; // ✅ Stop loading after checking auth state
    });
  }

  async logout() {
    await signOut(this.auth);
    this.router.navigate(['/login']);
  }
}
