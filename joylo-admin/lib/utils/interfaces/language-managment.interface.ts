/* eslint-disable @typescript-eslint/no-explicit-any */


import { IGlobalComponentProps, IQueryResult } from './global.interface';
import { TLanguageManagementMobileTabs } from '../types/language-management';

export interface ILanguageManagementContextProps {
  language: ILanguageReponse | null;
  isLangFormVisible: boolean;
  onToggleLangFormVisibility: (status: boolean) => void;
  onSetLanguage: (val: ILanguageReponse | null) => void;
  languageResponse: IQueryResult<
    ILanguageResponseGraphQL | undefined,
    undefined
  >;
}

export interface ILanguageManagementHeaderComponentsProps
  extends IGlobalComponentProps {}

export interface ILanguageManagementMobileTabsComponentProps
  extends IGlobalComponentProps {
  activeTab: TLanguageManagementMobileTabs;
  setActiveTab: (val: TLanguageManagementMobileTabs) => void;
}

export interface ILanguageManagementMainComponentsProps
  extends ILanguageManagementHeaderComponentsProps,
    ILanguageManagementMobileTabsComponentProps {}

// Form
export interface ILanguageForm {
  label: string;
  code: string;
}

// Language Card
export interface ILanguageCardProps extends IGlobalComponentProps {
  lng: ILanguageReponse;
  isLast: boolean;
}



// Language Respone
export interface ILanguageReponse {
  _id: string;
  label: string;
  code: string;
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ILanguageResponseGraphQL {
  languages: ILanguageReponse[];
}

// Translation Response
export interface ITranslationResponse {
  languageCode: string;
  translations: any;
  createdAt: string;
  updatedAt: string;
}

export interface ITranslationResponseGraphQL {
  translations: ITranslationResponse;
}
