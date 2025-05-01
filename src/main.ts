import { bootstrapApplication, provideClientHydration } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { importProvidersFrom } from '@angular/core';
import { routes } from './app/app.routes';
import { provideRouter, withInMemoryScrolling } from '@angular/router';
import { HttpClient, HttpClientModule, provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { authInterceptor } from './app/shared/interceptors/auth.interceptor';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { HttpLoaderFactory } from './app/translation.config';

bootstrapApplication(AppComponent, {
  // providers: [
  //   provideRouter(routes),
  //    provideHttpClient(withInterceptors([authInterceptor])),
  //   importProvidersFrom(BrowserAnimationsModule),
  // ]
  providers: [
    provideRouter(routes, withInMemoryScrolling({ 
      scrollPositionRestoration: 'enabled', // Restores scroll to top on navigation
      // anchorScrolling: 'enabled',   
    })),
    provideClientHydration(),
    provideHttpClient(
      withFetch(),
      withInterceptors([authInterceptor]) 
    ),
    importProvidersFrom(
      HttpClientModule,
      BrowserAnimationsModule,
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
}).catch(err => console.error(err));
