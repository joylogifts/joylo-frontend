/*****************************
 * environment.js
 * path: '/environment.js' (root of your project)
 ******************************/

import * as Updates from "expo-updates";
import { useContext } from "react";
import { ConfigurationContext } from "./lib/context/global/configuration.context";

const getEnvVars = (env = Updates.channel) => {
  const configuration = useContext(ConfigurationContext);

  if (env === "production" || env === "staging") {
    return {
      GRAPHQL_URL: "https://base.clobit.com/graphql",
      WS_GRAPHQL_URL: "wss://base.clobit.com/graphql",
      SENTRY_DSN:
        configuration?.restaurantAppSentryUrl ??
        "https://599cde43bafba02a81bd13214b0d4097@o4509427784744960.ingest.us.sentry.io/4509430486859776",
    };
  }
  return {
    GRAPHQL_URL: "https://base.clobit.com/graphql",
    WS_GRAPHQL_URL: "wss://base.clobit.com/graphql",

    SENTRY_DSN:
      configuration?.restaurantAppSentryUrl ??
      "https://599cde43bafba02a81bd13214b0d4097@o4509427784744960.ingest.us.sentry.io/4509430486859776",
  };
};

export default getEnvVars;
