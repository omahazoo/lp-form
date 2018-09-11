import { withPropsOnChange } from 'recompose'
import { createFilterFunction } from '../utils'

// Filter initial values if applicable
const filterInitialValues = withPropsOnChange(
  ['initialValues', 'initialValuesFilters'],
  ({ initialValues, initialValuesFilters }) => {
    if (!initialValuesFilters) return {}
    const filterInitialValues = createFilterFunction(initialValuesFilters)
    return { 
      initialValues: filterInitialValues(initialValues) 
    }
  }
)

export default filterInitialValues