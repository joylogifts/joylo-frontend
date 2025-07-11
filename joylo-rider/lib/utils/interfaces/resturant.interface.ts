import { TPolygonPoints } from "../types/restaurant";

export interface IRestaurantProfile {
  _id: string;
  orderId: number;
  orderPrefix: string;
  slug: string;
  name: string;
  image?: string;
  logo: string;
  address: string;
  location: {
    coordinates: string[];
    __typename: string;
  };
  deliveryBounds: {
    coordinates: number[][][];
    __typename: string;
  };
  username: string;
  password: string;
  deliveryTime: number;
  minimumOrder: number;
  tax: number;
  isAvailable: boolean;
  stripeDetailsSubmitted: boolean;
  openingTimes: {
    day: string;
    times: {
      startTime: string[];
      endTime: string[];
      __typename: string;
    }[];
    __typename: string;
  }[];
  owner: {
    _id: string;
    email: string;
    __typename: string;
  };
  shopType: string;
  cuisines: JSON;
  __typename: string;
}

export interface IRestaurantLocation {
  coordinates: TPolygonPoints;
}
