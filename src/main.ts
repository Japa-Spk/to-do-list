import { bootstrapApplication } from '@angular/platform-browser';
import { RouteReuseStrategy, provideRouter, withPreloading, PreloadAllModules } from '@angular/router';
import { IonicRouteStrategy, provideIonicAngular } from '@ionic/angular/standalone';
import { IonicStorageModule } from '@ionic/storage-angular';
import { Drivers } from '@ionic/storage';
import { importProvidersFrom } from '@angular/core';

import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { provideRemoteConfig, getRemoteConfig } from '@angular/fire/remote-config';
import { environment } from './environments/environment';

import { routes } from './app/app.routes';
import { AppComponent } from './app/app.component';

bootstrapApplication(AppComponent, {
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    provideIonicAngular(),
    provideRouter(routes, withPreloading(PreloadAllModules)),
    importProvidersFrom(IonicStorageModule.forRoot({
      driverOrder: [
        Drivers.IndexedDB,
        Drivers.LocalStorage
      ]
    }),
    ),
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideRemoteConfig(() => {
      const rc = getRemoteConfig();
      rc.settings = {
        minimumFetchIntervalMillis: 30000,
        fetchTimeoutMillis: 60000
      };
      rc.defaultConfig = {
        enable_categories: false
      };
      return rc;
    })
  ],
});
