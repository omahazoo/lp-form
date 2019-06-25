import { withPropsOnChange } from 'recompose'

// Adds a before hook to onSubmit if provided
const addBeforeSubmitHook = withPropsOnChange(
  ['onSubmit', 'beforeSubmit'],
  ({ onSubmit, beforeSubmit, ...options }) => {
    if (!beforeSubmit) return {}
    return {
      onSubmit: (values, ...rest) => {
        return onSubmit(beforeSubmit(values, options), ...rest)
      }
    }
  }
)

export default addBeforeSubmitHook