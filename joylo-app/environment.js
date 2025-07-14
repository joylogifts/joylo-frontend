// /*****************************
//  * environment.js
//  * path: '/environment.js' (root of your project)
//  ******************************/

import { useContext } from 'react'
import ConfigurationContext from './src/context/Configuration'
import * as Updates from 'expo-updates'

const useEnvVars = (env = Updates.channel) => {
  const configuration = useContext(ConfigurationContext)
  if (env === 'production' || env === 'staging') {
    return {

      GRAPHQL_URL: 'http://192.168.18.28:8001/graphql',
      WS_GRAPHQL_URL: 'ws://192.168.18.28:8001/graphql',
      SERVER_URL: 'http://192.168.18.28:8001/',
      // GRAPHQL_URL: 'https://base.clobit.com/graphql',
      // WS_GRAPHQL_URL: 'wss://base.clobit.com/graphql',
      // SERVER_URL: 'https://base.clobit.com/',
      IOS_CLIENT_ID_GOOGLE: configuration?.iOSClientID,
      ANDROID_CLIENT_ID_GOOGLE: configuration?.androidClientID,
      AMPLITUDE_API_KEY: configuration?.appAmplitudeApiKey,
      GOOGLE_MAPS_KEY: configuration?.googleApiKey,
      EXPO_CLIENT_ID: configuration?.expoClientID,
      SENTRY_DSN: configuration?.customerAppSentryUrl ?? 'https://f1aad492b85fe5b1bac1c59f0bf163a9@o4509427784744960.ingest.us.sentry.io/4509430343467008',
      TERMS_AND_CONDITIONS: configuration?.termsAndConditions,
      PRIVACY_POLICY: configuration?.privacyPolicy,
      TEST_OTP: configuration?.testOtp,
      GOOGLE_PACES_API_BASE_URL: configuration?.googlePlacesApiBaseUrl
    }
  }

  return {
    GRAPHQL_URL: 'http://192.168.18.28:8001/graphql',
    WS_GRAPHQL_URL: 'ws://192.168.18.28:8001/graphql',
    SERVER_URL: 'http://192.168.18.28:8001/',
    // GRAPHQL_URL: 'https://base.clobit.com/graphql',
    // WS_GRAPHQL_URL: 'wss://base.clobit.com/graphql',
    // SERVER_URL: 'https://base.clobit.com/',
    IOS_CLIENT_ID_GOOGLE: configuration?.iOSClientID,
    ANDROID_CLIENT_ID_GOOGLE: configuration?.androidClientID,
    AMPLITUDE_API_KEY: configuration?.appAmplitudeApiKey,
    GOOGLE_MAPS_KEY: configuration?.googleApiKey,
    EXPO_CLIENT_ID: configuration?.expoClientID,
    SENTRY_DSN: configuration?.customerAppSentryUrl ?? 'https://f1aad492b85fe5b1bac1c59f0bf163a9@o4509427784744960.ingest.us.sentry.io/4509430343467008',
    TERMS_AND_CONDITIONS: configuration?.termsAndConditions,
    PRIVACY_POLICY: configuration?.privacyPolicy,
    TEST_OTP: configuration?.testOtp,
    GOOGLE_PACES_API_BASE_URL: configuration?.googlePlacesApiBaseUrl
  }
}

export default useEnvVars
