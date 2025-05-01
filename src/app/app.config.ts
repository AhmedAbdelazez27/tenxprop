import { HttpClient, HttpClientModule, provideHttpClient, withFetch } from '@angular/common/http';
import { routes } from './app.routes';
import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideClientHydration } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { authGuard } from './shared/guards/auth.guard';
import { ToastModule } from 'primeng/toast';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { HttpLoaderFactory } from './translation.config';
export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    // provideHttpClient(),
    provideClientHydration(),
    provideHttpClient(withFetch()),
    ConfirmationService,
    MessageService,
    DialogService,
    importProvidersFrom(
      HttpClientModule, // Ensure this module is imported
      BrowserAnimationsModule,
      ToastModule,
      TranslateModule.forRoot({
        defaultLanguage: 'en', // Default language
        loader: { // Loader for translation files
          provide: TranslateLoader,
          useFactory: HttpLoaderFactory,
          deps: [HttpClient]
        }
      })
    )
  ]
};