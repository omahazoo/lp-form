import { withPropsOnChange } from 'recompose'

// Adds a before hook to onSubmit if provided
const addBeforeSubmitHook = withPropsOnChange(
  ['onSubmit', 'beforeSubmit'],
  ({ onSubmit, beforeSubmit }) => {
    if (!beforeSubmit) return {}
    return {
      onSubmit: (values, ...rest) => {
        return onSubmit(beforeSubmit(values), ...rest)
      }
    }
  }
)

export default addBeforeSubmitHook