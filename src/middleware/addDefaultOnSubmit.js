import { withPropsOnChange } from 'recompose'

function defaultOnSubmit (...args) {
  // eslint-disable-next-line no-console
  console.warn('WARNING: no onSubmit function specified. Form will submit successfully by default.')
  return Promise.resolve(...args)
}

// Adds a default submit function that submits automatically
const addDefaultOnSubmit = withPropsOnChange(
  ['onSubmit'],
  ({ onSubmit }) => {
    return {
      onSubmit: onSubmit || defaultOnSubmit
    }
  }
)

export default addDefaultOnSubmit
