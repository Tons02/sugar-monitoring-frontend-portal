import { yupResolver } from "@hookform/resolvers/yup";
import dayjs from "dayjs";
import * as yup from "yup";

export const loginSchema = yup
  .object({
    username: yup.string().required('Username is required'),
    password: yup.string().required('Password is required'),
  })
  .required();

export const userSchema = yup.object().shape({
    first_name: yup.string().required('First Name is required'),
    middle_name: yup.string().nullable(), // Optional
    last_name: yup.string().required('Last Name is required'),
    gender: yup.string().oneOf(['male', 'female'], 'Gender is required'),
    mobile_number: yup
    .string()
    .matches(/^\+63\d{10}$/, 'Mobile Number must start with +63 and have 13 digits') // Regex for +63 and 10 additional digits
    .required('Mobile Number is required'),  
    email: yup.string().email('Invalid email address').required('Email is required'),
    username: yup.string().required('Username is required'),
    userType: yup.string().oneOf(['admin', 'user'], 'User Type is required'),
});

export const sugarMonitoring = yup.object().shape({
  mgdl: yup.number().integer().required('mgdl is required'), // Corrected to yup.number().integer()
  description: yup.string().nullable(), // Optional
  date: yup
  .date()
  .transform((value) => (value instanceof dayjs ? value.toDate() : value)) // Convert dayjs to native Date
  .required('Date is required'), 
});


export default { loginSchema, userSchema, sugarMonitoring };
