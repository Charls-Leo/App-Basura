import { BootstrapContext, bootstrapApplication } from '@angular/platform-browser';
import { App } from './app/app';
import { appConfig } from './app/app.config';   // 👈 aquí está el fix

const bootstrap = (context: BootstrapContext) =>
  bootstrapApplication(App, appConfig, context); // 👈 usar appConfig

export default bootstrap;
