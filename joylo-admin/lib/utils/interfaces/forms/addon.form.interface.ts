import { IDropdownSelectItem } from '../global.interface';

export interface IAddonForm {
  _id?: string;
  title: string;
  description: string;
  options: IDropdownSelectItem[] | null;
  categoryIds: IDropdownSelectItem[] | null;
}

export interface IAddonsErrors {
  _id?: string[];
  title: string[];
  description: string[];
  options: string[];
  categoryIds: string[];
}
