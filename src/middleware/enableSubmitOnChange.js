import { withPropsOnChange } from 'recompose'
import { noop } from 'lodash'

// Create auto-submitting onChange if applicable
const enableSubmitOnChange = withPropsOnChange(
  ['onChange', 'submitOnChange'],
  ({ onChange=noop, submitOnChange }) => {
    if (!submitOnChange) return {}
    return {
      onChange: (params, dispatch, props, ...rest) => {
        onChange(params, dispatch, props, ...rest) // Call passed onChange
        return props.submit() // Submit form
      }
    }
  }
)

export default enableSubmitOnChange