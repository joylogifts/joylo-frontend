export interface IOptionForm {
  _id?: string;
  title: Record<string, string> | string;
  description: Record<string, string> | string;
  price: number;
}

export interface IOptionErrors {
  _id?: string[];
  title: string[];
  description: string[];
  price: string[];
}
