import { withPropsOnChange } from 'recompose'
import defaultValidate from '../validate'

// Adds a default validate function that uses provided constraints
const addConstraints = withPropsOnChange(
  ['validate', 'constraints'],
  ({ validate, constraints={} }) => {
    return {
      validate: validate || defaultValidate(constraints)
    }
  }
)

export default addConstraints