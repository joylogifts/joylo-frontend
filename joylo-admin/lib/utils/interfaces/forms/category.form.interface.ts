
export interface ICategoryForm {
  _id?: string;
  title: string;
  isActive?: boolean
}

export interface ICategoryErrors {
  _id?: string[];
  title: string[];
  image: string[];
}
