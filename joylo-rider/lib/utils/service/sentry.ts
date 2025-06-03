import * as Sentry from "@sentry/react-native";

// Sentry Handler
export const initSentry = () => {
  console.log("Initializing Sentry");
  // if (!SENTRY_DSN) return;
  Sentry.init({
    dsn: "https://458c34c24ec38dad214559e6742b6755@o4509427784744960.ingest.us.sentry.io/4509430525263872",
    environment: "development",
    debug: false,
    // enableTracing: false, // Disables tracing completely
    tracesSampleRate: 0.3, // Prevents sampling any traces
  });
};

