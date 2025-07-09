import { loadDevMessages, loadErrorMessages } from "@apollo/client/dev";
import * as Updates from "expo-updates";
import { useContext } from "react";
import { ConfigurationContext } from "./lib/context/global/configuration.context";
const getEnvVars = (env = Updates.channel) => {
  const configuration = useContext(ConfigurationContext);
  if (__DEV__) {
    loadDevMessages();
    loadErrorMessages();
  }
  if (!__DEV__) {
    return {
      GRAPHQL_URL: 'http://192.168.18.27:8001/graphql',
      WS_GRAPHQL_URL: 'ws://192.168.18.27:8001/graphql',
      SERVER_URL: 'http://192.168.18.27:8001/',
      // GRAPHQL_URL: "https://base.clobit.com/graphql",
      // WS_GRAPHQL_URL: "wss://base.clobit.com/graphql",
      SENTRY_DSN:
        configuration?.riderAppSentryUrl ??
        "https://458c34c24ec38dad214559e6742b6755@o4509427784744960.ingest.us.sentry.io/4509430525263872",
      GOOGLE_MAPS_KEY: configuration?.googleApiKey,
      ENVIRONMENT: "production",
    };
  }

  return {
    GRAPHQL_URL: 'http://192.168.18.27:8001/graphql',
    WS_GRAPHQL_URL: 'ws://192.168.18.27:8001/graphql',
    SERVER_URL: 'http://192.168.18.27:8001/',
    // GRAPHQL_URL: "https://base.clobit.com/graphql",
    // WS_GRAPHQL_URL: "wss://base.clobit.com/graphql",
    SENTRY_DSN:
      configuration?.riderAppSentryUrl ??
      "https://458c34c24ec38dad214559e6742b6755@o4509427784744960.ingest.us.sentry.io/4509430525263872",
    GOOGLE_MAPS_KEY: configuration?.googleApiKey,
    ENVIRONMENT: "development",
  };
};

export default getEnvVars;
