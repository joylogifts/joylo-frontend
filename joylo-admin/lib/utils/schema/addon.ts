import * as Yup from 'yup';
import { IDropdownSelectItem } from '../interfaces';

export const AddonSchema = Yup.object({
  addons: Yup.array()
    .of(
      Yup.object().shape({
        _id: Yup.string().nullable(),
        title: Yup.string()
          .max(50)
          .trim()
          .matches(/\S/, 'Name cannot be only spaces')
          .required('Required'),
        description: Yup.string()
          .max(50)
          .trim()
          .matches(/\S/, 'Name cannot be only spaces')
          .optional(),
        options: Yup.array()
          .of(Yup.mixed<IDropdownSelectItem>())
          .min(1, 'Option field must have at least 1 items')
          .required('Required'),
        categoryIds: Yup.mixed<IDropdownSelectItem>().required('Required'),
      })
    )
    .min(1)
    .required('Required'),
});
