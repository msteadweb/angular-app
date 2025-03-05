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
  isDarkMode = false; // Track dark mode state

  constructor(private auth: Auth, private router: Router) { }

  ngOnInit() {
    onAuthStateChanged(this.auth, (user) => {
      this.isLoading = false; // ✅ Stop loading when auth state is determined
      this.user = user;

      if (user && this.router.url === '/login') {
        this.router.navigate(['/dashboard']); // ✅ Ensure logged-in users go to dashboard
      }
    });

    // Load dark mode state from local storage
    const savedMode = localStorage.getItem('darkMode');
    this.isDarkMode = savedMode === 'enabled';
    this.applyDarkMode();
  }

  toggleDarkMode() {
    this.isDarkMode = !this.isDarkMode;
    localStorage.setItem('darkMode', this.isDarkMode ? 'enabled' : 'disabled');
    this.applyDarkMode();
  }

  applyDarkMode() {
    if (this.isDarkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  }
}
