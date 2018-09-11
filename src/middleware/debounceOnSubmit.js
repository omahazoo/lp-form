import { withPropsOnChange } from 'recompose'
import { debounce } from 'lodash'

// Debounces the submit function if a debounce interval is provided
const debounceOnSubmit = withPropsOnChange(
  ['onSubmit', 'debounceSubmit'],
  ({ onSubmit, debounceSubmit }) => {
    if (!debounceSubmit) return {}
    return {
      onSubmit: debounce(onSubmit, debounceSubmit),
    }
  }
)

export default debounceOnSubmit