import { Component } from '@angular/core';
import { Auth, User } from '@angular/fire/auth';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent {
  user: User | null = null;

  constructor(private auth: Auth, private router: Router) {
    this.auth.onAuthStateChanged((user) => {
      this.user = user;
    });
  }

  async logout() {
    await this.auth.signOut();
    this.router.navigate(['/login']);
  }
}
