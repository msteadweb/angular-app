import { Component, Renderer2 } from '@angular/core';
import { Auth, updateProfile, User, onAuthStateChanged } from '@angular/fire/auth';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';  // ✅ Correct HttpClient import

@Component({
  selector: 'app-settings',
  standalone: true,
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css'],
  imports: [CommonModule, RouterModule, FormsModule]  // ✅ No need to import HttpClientModule
})
export class SettingsComponent {
  user: User | null = null;
  displayName = '';
  photoFile: File | null = null;
  photoPreview: string | null = null;
  isLoading = false;
  message: string | null = null;
  isDarkMode = false; // ✅ Dark mode state

  private cloudinaryUploadUrl = 'https://api.cloudinary.com/v1_1/dgsoziqru/image/upload';  // ✅ Your Cloudinary upload URL
  private uploadPreset = 'my_unsigned_preset';  // ✅ Replace with your actual upload preset

  constructor(private auth: Auth, private http: HttpClient, private renderer: Renderer2) { // ✅ Ensure HttpClient & Renderer2 are injected
    onAuthStateChanged(this.auth, (user) => {
      this.user = user;
      if (user) {
        this.displayName = user.displayName || '';
        this.photoPreview = user.photoURL || ''; // ✅ Show existing profile picture
      }
    });

    // ✅ Load dark mode preference
    this.isDarkMode = localStorage.getItem('darkMode') === 'true';
    if (this.isDarkMode) {
      this.renderer.addClass(document.body, 'dark-mode');
    }
  }

  toggleDarkMode(event: Event) {
    const isChecked = (event.target as HTMLInputElement).checked;
    this.isDarkMode = isChecked;

    if (isChecked) {
      this.renderer.addClass(document.body, 'dark-mode');
    } else {
      this.renderer.removeClass(document.body, 'dark-mode');
    }

    localStorage.setItem('darkMode', isChecked.toString());
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      this.photoFile = input.files[0];

      // ✅ Display preview before upload
      const reader = new FileReader();
      reader.onload = () => {
        this.photoPreview = reader.result as string;
      };
      reader.readAsDataURL(this.photoFile);
    }
  }

  async uploadImageToCloudinary(): Promise<string | null> {
    if (!this.photoFile) return null;

    const formData = new FormData();
    formData.append('file', this.photoFile);
    formData.append('upload_preset', this.uploadPreset);

    try {
      const response: any = await this.http.post(this.cloudinaryUploadUrl, formData).toPromise();
      return response.secure_url; // ✅ Return the uploaded image URL
    } catch (error) {
      console.error('Image upload failed:', error);
      return null;
    }
  }

  async updateProfile() {
    if (!this.user) return;
    this.isLoading = true;
    this.message = null;

    try {
      let photoURL = this.user.photoURL;

      // ✅ Upload to Cloudinary if new image is selected
      if (this.photoFile) {
        const uploadedImageUrl = await this.uploadImageToCloudinary();
        if (uploadedImageUrl) {
          photoURL = uploadedImageUrl;
        }
      }

      // ✅ Update Firebase Auth Profile
      await updateProfile(this.user, {
        displayName: this.displayName,
        photoURL: photoURL
      });

      // ✅ Update UI
      this.photoPreview = photoURL;
      this.message = 'Profile updated successfully!';
    } catch (error) {
      console.error('Error updating profile:', error);
      this.message = 'Error updating profile. Please try again.';
    }

    this.isLoading = false;
  }
}
