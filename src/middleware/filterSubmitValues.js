import { withPropsOnChange } from 'recompose'
import { createFilterFunction } from '../utils'

// Filter initial values if applicable
const filterSubmitValues = withPropsOnChange(
  ['onSubmit', 'submitFilters'],
  ({ onSubmit, submitFilters }) => {
    if (!submitFilters) return {}
    const filterSubmitValues = createFilterFunction(submitFilters)
    return {
      onSubmit: (values, ...rest) => {
        return onSubmit(filterSubmitValues(values), ...rest)
      }
    }
  }
)

export default filterSubmitValues