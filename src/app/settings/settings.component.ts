import { Component } from '@angular/core';
import { Auth, updateProfile, User } from '@angular/fire/auth';
import { CommonModule } from '@angular/common'; // ✅ Import for *ngIf
import { FormsModule } from '@angular/forms'; // ✅ Import for ngModel

@Component({
  selector: 'app-settings',
  standalone: true,
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css'],
  imports: [CommonModule, FormsModule] // ✅ Add necessary imports
})
export class SettingsComponent {
  user: User | null = null;
  displayName = '';
  photoURL = '';
  isLoading = false;
  message: string | null = null;

  constructor(private auth: Auth) {
    this.user = this.auth.currentUser;
    if (this.user) {
      this.displayName = this.user.displayName || '';
      this.photoURL = this.user.photoURL || '';
    }
  }

  async updateProfile() {
    if (!this.user) return;
    this.isLoading = true;
    this.message = null;
    try {
      await updateProfile(this.user, {
        displayName: this.displayName,
        photoURL: this.photoURL
      });
      this.message = 'Profile updated successfully!';
    } catch (error) {
      this.message = 'Error updating profile. Please try again.';
    }
    this.isLoading = false;
  }
}
