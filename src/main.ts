import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { provideRouter } from '@angular/router';
import { importProvidersFrom } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { provideAuth, getAuth, browserLocalPersistence, initializeAuth } from '@angular/fire/auth';
import { provideFirestore, getFirestore } from '@angular/fire/firestore';
import { provideStorage, getStorage } from '@angular/fire/storage';
import { provideHttpClient } from '@angular/common/http';
import { firebaseConfig } from './environments/firebase.config';
import { routes } from './app/routes';
import { provideAnimations } from '@angular/platform-browser/animations'; // ✅ Fixed typo

bootstrapApplication(AppComponent, {
  providers: [
    provideAnimations(), // ✅ Fixed typo (was 'provideAnimantions')
    provideRouter(routes),
    provideHttpClient(),
    importProvidersFrom(FormsModule),
    provideFirebaseApp(() => {
      const app = initializeApp(firebaseConfig);
      initializeAuth(app, { persistence: browserLocalPersistence }); // ✅ No need to return auth instance here
      return app;
    }),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore()),
    provideStorage(() => getStorage()),
  ],
});
