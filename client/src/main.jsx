import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx'
import './index.css'
import * as Sentry from "@sentry/react";

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

// Remove static SEO tags from index.html that are marked with data-rh="true"
// This prevents duplication since react-helmet-async v3 uses React 19's native head support (which doesn't clean them up)
document.querySelectorAll('[data-rh="true"]').forEach(el => el.remove());

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Sentry.ErrorBoundary fallback={<p>An error has occurred</p>}>
      <App />
    </Sentry.ErrorBoundary>
  </React.StrictMode>,
)