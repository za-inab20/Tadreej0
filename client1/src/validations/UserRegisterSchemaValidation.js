import * as yup from 'yup';

export const UserRegisterSchemaValidation = yup.object().shape({
  uname: yup.string().required('Username is required'),
  email: yup.string().email('Not a valid email format').required('Email is required'),
  password: yup
    .string()
    .required('Password is required')
    .min(8, 'Minimum 8 characters required')
    .matches(
      /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])/, 
      'Password must contain at least one uppercase letter, one number, and one special character'
    ),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('password'), null], 'Passwords must match')
    .required('Confirm password is required'),
  accountType: yup.string().oneOf(['user', 'freelancer']).required('User type is required'),
});
