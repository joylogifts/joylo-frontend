export default function getEnv(env: "DEV" | "STAGE" | "PROD") {
  switch (env) {
    case "DEV":
      return {
        SERVER_URL:
          "https://base.clobit.com/",
        WS_SERVER_URL:
          "wss://base.clobit.com/",
      };
    case "STAGE":
      return {
        SERVER_URL: "https://base.clobit.com/",
        WS_SERVER_URL: "wss://base.clobit.com/",
      };
    case "PROD":
      return {
        SERVER_URL: "https://base.clobit.com/",
        WS_SERVER_URL: "wss://base.clobit.com/",
      };
    default:
      return {
        SERVER_URL: "https://base.clobit.com/",
        WS_SERVER_URL: "wss://base.clobit.com/",

        // SERVER_URL: "http://localhost:8001/",
        // WS_SERVER_URL: "ws://localhost:8001/",
      };
  }
}
