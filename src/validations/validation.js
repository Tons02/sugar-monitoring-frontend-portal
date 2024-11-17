import { yupResolver } from "@hookform/resolvers/yup"
import * as yup from "yup"

const loginSchema = yup
  .object({
    username: yup.string().required(),
    password: yup.string().required(),
  })
  .required()

  

export default loginSchema;
