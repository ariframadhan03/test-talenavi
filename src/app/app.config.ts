import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideHttpClient } from '@angular/common/http';
import { id_ID, provideNzI18n } from 'ng-zorro-antd/i18n';
import { registerLocaleData } from '@angular/common';
import id from '@angular/common/locales/id';
import { FormsModule } from '@angular/forms';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

registerLocaleData(id);

export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes), provideHttpClient(), provideNzI18n(id_ID), importProvidersFrom(FormsModule), provideAnimationsAsync(), provideHttpClient()],
};
