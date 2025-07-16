import { gql } from "@apollo/client";

export const RIDER_LOGIN = gql`
  mutation RiderLogin(
    $username: String
    $password: String
    $notificationToken: String
    $timeZone: String!
  ) {
    riderLogin(
      username: $username
      password: $password
      notificationToken: $notificationToken
      timeZone: $timeZone
    ) {
      userId
      token
    }
  }
`;

export const DEFAULT_RIDER_CREDS = gql`
  query LastOrderCreds {
    lastOrderCreds {
      riderUsername
      riderPassword
    }
  }
`;


export const SET_USER_LANGUAGE = gql`
  mutation SetUserLanguage($languageCode: String!) {
    setUserLanguage(languageCode: $languageCode)
  }
`;