import { IDropdownSelectItem } from '../global.interface';

// Errors
export interface IFoodErrors {
  title: string[];
  description: string[];
  image: string[];
  category: string[];
  subCategory: string[];
}

export interface IFoodDetailsForm {
  _id: string | null;
  title: Record<string, string> | string;
  description: Record<string, string> | string;
  image: string;
  category: IDropdownSelectItem | null;
  subCategory: IDropdownSelectItem | null;
}
