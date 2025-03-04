import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HelloWorldComponent } from './hello-world/hello-world.component';
import { Auth, onAuthStateChanged, User } from '@angular/fire/auth';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterModule, HelloWorldComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'angular-app';
  user: User | null = null; // Track logged-in user
  isLoading = true; // Prevent UI flicker

  constructor(private auth: Auth, private router: Router) {}

  ngOnInit() {
    onAuthStateChanged(this.auth, (user) => {
      this.isLoading = false; // ✅ Stop loading when auth state is determined
      this.user = user;

      if (user && this.router.url === '/login') {
        this.router.navigate(['/dashboard']); // ✅ Ensure logged-in users go to dashboard
      }
    });
  }
}
