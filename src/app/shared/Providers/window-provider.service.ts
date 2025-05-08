
import { InjectionToken } from '@angular/core';

export const WINDOW = new InjectionToken<Window>('WindowToken');

export function WindowProviderService(): Window {
  return window;
}

export const WindowProvider = {
  provide: WINDOW,
  useFactory: WindowProviderService
};
