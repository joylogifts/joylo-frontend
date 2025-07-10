import * as Yup from 'yup';
import { MAX_PRICE, MIN_PRICE } from '../constants';
import { IDropdownSelectItem } from '../interfaces';

export const VariationSchema = Yup.object({
  variations: Yup.array()
    .of(
      Yup.object().shape({
        _id: Yup.string().nullable(),
        title: Yup.mixed<string | object>()
          .test(
            'is-string-or-json',
            'Title must be a string or a valid JSON object',
            (value) => {
              if (typeof value === 'string') {
                return /\S/.test(value.trim());
              }
              if (typeof value === 'object' && value !== null) {
                return true;
              }
              return false;
            }
          )
          .required('Required'),
        price: Yup.number()
          .min(MIN_PRICE, 'Minimum value must be greater than 0')
          .max(MAX_PRICE)
          .required('Required'),
        discounted: Yup.number().min(0).required('Required'),
        addons: Yup.array()
          .of(Yup.mixed<IDropdownSelectItem>())
          .required('Required')
          .test(
            'at-least-one-addon',
            'Addons field must have at least 1 items',
            (value) => value && value.length > 0
          ),
        isOutOfStock: Yup.boolean(),
      })
    )
    .min(1)
    .required('Required'),
});
