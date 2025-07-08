import { Dispatch, SetStateAction } from 'react';
import { TSideBarFormPosition } from '../types/sidebar';
import {
  IGlobalComponentProps,
  IGlobalTableHeaderProps,
} from './global.interface';
import { IOptions } from './options.interface';
import { ICategory } from './category.interface';

export interface IAddonHeaderProps extends IGlobalComponentProps {
  setIsAddAddonVisible: (visible: boolean) => void;
}
export interface IAddonTableHeaderProps extends IGlobalTableHeaderProps {}

export interface IAddonAddFormComponentProps extends IGlobalComponentProps {
  position?: TSideBarFormPosition;
  isAddAddonVisible: boolean;
  onHide: () => void;
  addon: IAddon | null;
  isAddOptionsVisible?: boolean;
  setIsAddOptionsVisible?: Dispatch<SetStateAction<boolean>>;
  option?: IOptions | null;
  setOption?: Dispatch<SetStateAction<IOptions | null>>;
}

export interface IAddonMainComponentsProps extends IGlobalComponentProps {
  setIsAddAddonVisible: React.Dispatch<React.SetStateAction<boolean>>;
  setAddon: React.Dispatch<React.SetStateAction<IAddon | null>>;
}

/*  */

export interface IAddon {
  _id: string;
  options: string[];
  title: string;
  description: string;
  categoryIds?: string[] | null;
  isActive: boolean;
}

export interface IAddonPopulated {
  _id: string;
  options: IOptions[];
  title: string;
  description: string;
  categoryIds?: ICategory[] | null;
  isActive: boolean;
}

export interface IAddonByRestaurantResponse {
  restaurant: {
    _id: string;
    addons: IAddon[];
    __typename: string;
  };
}

export interface IGetAddonsResponse {
  addons: IAddon[];
}
