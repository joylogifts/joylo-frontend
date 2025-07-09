export interface ILanguage {
  _id: string;
  label: string;
  code: string;
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ITranslations {
  [key: string]: string;
}

// Responses
export interface IDefaultLanguageResponse {
  defaultLanguage: ILanguage;
}

export interface ITranslationsResponse {
  translations: {
    languageCode: string;
    translations: ITranslations;
    createdAt: string;
    updatedAt: string;
  };
}
