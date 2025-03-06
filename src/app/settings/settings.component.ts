
import { Component, Renderer2 } from '@angular/core';
import { Auth, updateProfile, User, onAuthStateChanged, sendPasswordResetEmail } from '@angular/fire/auth';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Firestore, doc, setDoc, getDoc } from '@angular/fire/firestore';
import { animate, style, transition, trigger } from '@angular/animations';
import Cropper from 'cropperjs';

@Component({
  selector: 'app-settings',
  standalone: true,
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css'],
  imports: [CommonModule, RouterModule, FormsModule],
  animations: [
    trigger('fade', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('500ms ease-in', style({ opacity: 1 }))
      ]),
      transition(':leave', [
        animate('500ms ease-out', style({ opacity: 0 }))
      ])
    ])
  ]
})
export class SettingsComponent {
  user: User | null = null;
  displayName = '';
  email = '';
  photoFile: File | null = null;
  photoPreview: string | null = null;
  isLoading = false;
  message: string | null = null;
  isDarkMode = false;
  cropper: Cropper | null = null;

  private cloudinaryUploadUrl = 'https://api.cloudinary.com/v1_1/dgsoziqru/image/upload';
  private uploadPreset = 'my_unsigned_preset';

  constructor(
    private auth: Auth,
    private http: HttpClient,
    private renderer: Renderer2,
    private firestore: Firestore
  ) {
    onAuthStateChanged(this.auth, async (user) => {
      this.user = user;
      if (user) {
        this.displayName = user.displayName || '';
        this.email = user.email || '';
        this.photoPreview = user.photoURL || '';

        const userDocRef = doc(this.firestore, 'users', user.uid);
        const userDocSnap = await getDoc(userDocRef);
        if (userDocSnap.exists()) {
          this.isDarkMode = userDocSnap.data()['darkMode'] || false;
          this.applyDarkMode();
        }
      }
    });
  }

  toggleDarkMode(event: Event) {
    const isChecked = (event.target as HTMLInputElement).checked;
    this.isDarkMode = isChecked;
    this.applyDarkMode();

    if (this.user) {
      const userDocRef = doc(this.firestore, 'users', this.user.uid);
      setDoc(userDocRef, { darkMode: isChecked }, { merge: true });
    }
  }

  applyDarkMode() {
    if (this.isDarkMode) {
      this.renderer.addClass(document.body, 'dark-mode');
    } else {
      this.renderer.removeClass(document.body, 'dark-mode');
    }
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      this.photoFile = input.files[0];

      const reader = new FileReader();
      reader.onload = () => {
        this.photoPreview = reader.result as string;
        setTimeout(() => {
          const image = document.getElementById('crop-image') as HTMLImageElement;
          if (image) {
            this.cropper = new Cropper(image, {
              // Remove unsupported options
            });
            // Use CSS to enforce aspect ratio
            image.style.aspectRatio = '1 / 1';
          }
        }, 100);
      };
      reader.readAsDataURL(this.photoFile);
    }
  }

  async uploadImageToCloudinary(): Promise<string | null> {
    if (!this.photoFile || !this.cropper) return null;

    const canvas = this.cropper.getCropperCanvas(); // Use the correct method name
    if (!canvas) return null;

    const blob = await new Promise<Blob | null>((resolve) => {
      if (canvas instanceof HTMLCanvasElement) {
        canvas.toBlob(resolve, 'image/jpeg');
      } else {
        resolve(null);
      }
    });

    if (!blob) return null;

    const formData = new FormData();
    formData.append('file', blob, 'profile.jpg');
    formData.append('upload_preset', this.uploadPreset);

    try {
      const response: any = await this.http.post(this.cloudinaryUploadUrl, formData).toPromise();
      return response.secure_url;
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

      if (this.photoFile) {
        const uploadedImageUrl = await this.uploadImageToCloudinary();
        if (uploadedImageUrl) {
          photoURL = uploadedImageUrl;
        }
      }

      await updateProfile(this.user, {
        displayName: this.displayName,
        photoURL: photoURL
      });

      this.photoPreview = photoURL;
      this.message = 'Profile updated successfully!';
    } catch (error) {
      console.error('Error updating profile:', error);
      this.message = 'Error updating profile. Please try again.';
    }

    this.isLoading = false;
  }

  async resetPassword() {
    if (!this.user || !this.email) return;
    try {
      await sendPasswordResetEmail(this.auth, this.email);
      this.message = 'Password reset email sent!';
    } catch (error) {
      console.error('Error sending reset email:', error);
      this.message = 'Failed to send reset email. Try again later.';
    }
  }
}
