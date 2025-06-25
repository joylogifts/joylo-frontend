import * as Yup from 'yup';

export const LanguageSchema = Yup.object().shape({
  label: Yup.string()
    .max(35)
    .trim()
    .required('Required'),
  code: Yup.string()
    .max(35)
    .trim()
    .required('Required'),
});
