import * as yup from 'yup'

export const validationSchema = yup.object({
    username: yup
      .string()
      .min(3, 'errors.minMax')
      .max(20, 'errors.minMax')
      .required('errors.required'),
    password: yup
      .string()
      .min(6, 'errors.passwordLength')
      .required('errors.required'),
    confirmPassword: yup
      .string()
      .required('errors.required')
      .oneOf([yup.ref('password')], 'errors.passwordsMustMatch'),
  });