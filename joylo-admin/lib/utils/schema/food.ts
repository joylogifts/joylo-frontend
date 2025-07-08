import * as Yup from 'yup';
import { IDropdownSelectItem } from '../interfaces';

export const FoodSchema = Yup.object().shape({
  title: Yup.mixed()
    .test(
      'is-string-or-json',
      'Title must be a string or a valid JSON object',
      (value) => {
        if (typeof value === 'string') {
          return value.trim().length > 0 && value.trim().length <= 35;
        }
        if (typeof value === 'object' && value !== null) {
          // Optionally, add more validation for object shape
          return true;
        }
        return false;
      }
    )
    .required('Required'),
  description: Yup.mixed()
    .test(
      'is-string-or-json',
      'Description must be a string or a valid JSON object',
      (value) => {
        if (value === null || value === undefined) return true;
        if (typeof value === 'string') {
          return value.trim().length <= 200;
        }
        if (typeof value === 'object' && value !== null) {
          // Optionally, add more validation for object shape
          return true;
        }
        return false;
      }
    )
    .nullable(),
  category: Yup.mixed<IDropdownSelectItem>().required('Required'),
  subCategory: Yup.mixed<IDropdownSelectItem>().nullable().optional(),
  image: Yup.string().url('Invalid image URL').required('Required'),
});
