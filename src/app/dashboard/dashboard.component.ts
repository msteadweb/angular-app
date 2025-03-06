import { Component, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Auth, User, onAuthStateChanged, signOut } from '@angular/fire/auth';
import { RouterModule, Router } from '@angular/router'; // ✅ Import RouterModule

@Component({
  selector: 'app-dashboard',
  standalone: true,
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  imports: [CommonModule, RouterModule] // ✅ Add RouterModule
})
export class DashboardComponent implements OnDestroy {
  user: User | null = null;
  isLoading = true;
  private authSubscription: (() => void) | null = null; // ✅ Correct type for unsubscribe function

  constructor(private auth: Auth, private router: Router) {
    this.authSubscription = onAuthStateChanged(this.auth, (user) => {
      this.user = user;
      this.isLoading = false;
    });
  }

  async logout() {
    await signOut(this.auth);
    this.router.navigate(['/login']);
  }

  ngOnDestroy() {
    if (this.authSubscription) {
      this.authSubscription(); // ✅ Properly unsubscribe
      this.authSubscription = null; // ✅ Avoid multiple calls
    }
  }

  navigateToSettings() {
    this.router.navigate(['/settings']); // ✅ Ensure navigation works
  }
}
