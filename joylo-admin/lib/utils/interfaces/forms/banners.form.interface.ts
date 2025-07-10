import { IDropdownSelectItem } from '../global.interface';

export type IBannersForm = {
  title: Record<string, string> | string;
  description: Record<string, string> | string;
  action: IDropdownSelectItem | null;
  screen: IDropdownSelectItem | null;
  file: string;
};

export interface IBannersErrors {
  title: string[];
  description: string[];
  action: string[];
  screen: string[];
  file: string[];
}
