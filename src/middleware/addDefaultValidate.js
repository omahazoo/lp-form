import { withPropsOnChange } from 'recompose'
import validateWithOptions from '../validateWithOptions'

// Adds a default validate function that uses provided constraints
const addDefaultValidate = withPropsOnChange(
  ['validate', 'constraints', 'validationOptions'],
  ({ validate, constraints={}, validationOptions }) => {
    if (validate) return {}
    return {
      validate: values => validateWithOptions(constraints, values, validationOptions)
    }
  }
)

export default addDefaultValidate
