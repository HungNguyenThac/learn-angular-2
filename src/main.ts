import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

import * as Sentry from "@sentry/angular";
import { Integrations } from "@sentry/tracing";

Sentry.init({
  dsn: "https://13f18b48c55246a2a3d65a3572b3cea5@o818430.ingest.sentry.io/5807970",
  environment: environment.PRODUCTION ? 'production' : 'dev',
  integrations: [
    new Integrations.BrowserTracing({
      tracingOrigins: ["http://hmg.monex.vn/", "https://api-aws.epay.vn", /^\//],
      routingInstrumentation: Sentry.routingInstrumentation,
    }),
  ],

  // Set tracesSampleRate to 1.0 to capture 100%
  // of transactions for performance monitoring.
  // We recommend adjusting this value in production
  tracesSampleRate: 0,
});


if (environment.PRODUCTION) {
  enableProdMode();
}

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));
