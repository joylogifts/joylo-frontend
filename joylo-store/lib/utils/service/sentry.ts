import * as Sentry from "@sentry/react-native";

// Sentry Handler
export const initSentry = () => {
  console.log("Initializing Sentry");
  // if (!SENTRY_DSN) return;
  Sentry.init({
    dsn: "https://599cde43bafba02a81bd13214b0d4097@o4509427784744960.ingest.us.sentry.io/4509430486859776",
    environment: "development",
    debug: false,
    // enableTracing: false, // Disables tracing completely
    tracesSampleRate: 0.3, // Prevents sampling any traces
  });
};