import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { provideRouter } from '@angular/router';
import { importProvidersFrom } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { provideAuth, getAuth, browserLocalPersistence, initializeAuth } from '@angular/fire/auth';
import { provideFirestore, getFirestore } from '@angular/fire/firestore';
import { provideStorage, getStorage } from '@angular/fire/storage';
import { provideHttpClient } from '@angular/common/http';  // ✅ Add this
import { firebaseConfig } from './environments/firebase.config';
import { routes } from './app/routes';

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes),
    provideHttpClient(),  // ✅ Fix HttpClient error
    importProvidersFrom(FormsModule),
    provideFirebaseApp(() => {
      const app = initializeApp(firebaseConfig);
      const auth = initializeAuth(app, { persistence: browserLocalPersistence });
      return app;
    }),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore()),
    provideStorage(() => getStorage()),
  ],
});
