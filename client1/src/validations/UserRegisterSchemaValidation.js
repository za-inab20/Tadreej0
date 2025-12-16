import * as yup from 'yup';

export const UserRegisterSchemaValidation = yup.object().shape({
    uname: yup.string().required('Username is required!!!'),
    email: yup.string().email('Not a Valid Email Format!!').required('Email is Required..'),
    password: yup
  .string()
  .required('Password is Required..')
  .min(8, 'Minimum 8 characters required..')
  .matches(
    /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])/,
    'Password must contain at least one uppercase letter, one number, and one special character'
  ),

    confirmPassword: yup.string().oneOf([yup.ref('password'), null], 'Passwords must match').required('Confirm password is required'),
    role: yup.string().required('Role is required')
});