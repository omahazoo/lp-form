import compose from 'lodash/fp/compose'
import { reduxForm } from 'redux-form'
import { modifyProps } from '@launchpadlab/lp-utils'
import createFilterFunction from './create-filter-function'
import submitWithFilter from './submit-with-filter'
import validate from './validate'

// Initialize a redux-forms controlled form and add additional options:
// 1. Submit filters
// 2. Submission error handling
// 3. Initial values filters
// 4. Alias "form" with "name"
// 5. Validation function

function lpForm (options={}) {
  return function (WrappedComponent) {
    return compose(
      modifyProps((props) => {
        const config = { ...options, ...props }
        const {
          onSubmit,
          initialValues,
          submitFilters,
          initialValuesFilters,
          constraints={},
          name,
          ...rest,
        } = config
        const filterSubmitValues = createFilterFunction(submitFilters)
        const filterInitialValues = createFilterFunction(initialValuesFilters)
        return {
          onSubmit: submitWithFilter(onSubmit, filterSubmitValues),
          initialValues: filterInitialValues(initialValues),
          validate: validate(constraints),
          form: name,
          ...rest,
        }
      }),
      reduxForm({}),
    )(WrappedComponent)
  }
}

export default lpForm