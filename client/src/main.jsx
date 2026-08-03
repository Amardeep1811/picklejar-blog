import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import * as Sentry from "@sentry/react";
import { HelmetProvider } from 'react-helmet-async';

if (import.meta.env.VITE_SENTRY_DSN) {
  Sentry.init({
    dsn: import.meta.env.VITE_SENTRY_DSN,
    integrations: [
      Sentry.browserTracingIntegration(),
      Sentry.replayIntegration(),
    ],
    tracesSampleRate: 1.0,
    replaysSessionSampleRate: 0.1,
    replaysOnErrorSampleRate: 1.0,
  });
} else {
  console.error(
    "=========================================\n" +
    "CRITICAL ERROR: SENTRY DSN IS MISSING!\n" +
    "Error tracking is completely disabled.\n" +
    "Make sure VITE_SENTRY_DSN is set in your .env or Netlify settings.\n" +
    "========================================="
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <HelmetProvider>
      <Sentry.ErrorBoundary fallback={<p>An error has occurred</p>}>
        <App />
      </Sentry.ErrorBoundary>
    </HelmetProvider>
  </React.StrictMode>,
)