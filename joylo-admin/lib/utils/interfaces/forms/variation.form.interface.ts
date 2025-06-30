
export interface IVariationForm {
  _id?: string;
  title: string;
  price: number;
  discounted: number;
  isOutOfStock: boolean;
  __typename?: string;
}

export interface IVariationErrors {
  _id?: string[];
  title: string[];
  discounted: string[];
  price: string[];

  isOutOfStock: string[];
}
