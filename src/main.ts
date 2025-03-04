import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { provideRouter } from '@angular/router';
import { importProvidersFrom } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { provideAuth, getAuth, browserLocalPersistence, initializeAuth } from '@angular/fire/auth';
import { provideFirestore, getFirestore } from '@angular/fire/firestore';
import { provideStorage, getStorage } from '@angular/fire/storage';
import { firebaseConfig } from './environments/firebase.config';
import { routes } from './app/routes';

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes),
    importProvidersFrom(FormsModule),
    provideFirebaseApp(() => {
      const app = initializeApp(firebaseConfig);
      const auth = initializeAuth(app, { persistence: browserLocalPersistence }); // ✅ Correct persistence setup
      return app;
    }),
    provideAuth(() => getAuth()), // ✅ Use the initialized auth
    provideFirestore(() => getFirestore()),
    provideStorage(() => getStorage()),
  ],
});
