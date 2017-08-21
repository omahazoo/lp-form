import React from 'react'
import { reduxForm } from 'redux-form'
import submitWithFilter from './submit-with-filter'
import { createFilterFunction } from './utils'
import validate from './validate'

// Initialize a redux-forms controlled form and add additional options:
// 1. Submit filters
// 2. Submission error handling
// 3. Initial values filters
// 4. Alias "form" with "name"
// 5. Validation function

function lpForm (options={}) {
  return Wrapped =>
    function LpFormWrapper (props) {
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
      const WrappedWithForm = reduxForm({
        onSubmit: submitWithFilter(onSubmit, filterSubmitValues),
        initialValues: filterInitialValues(initialValues),
        validate: validate(constraints),
        form: name,
        ...rest,
      })(Wrapped)
      return <WrappedWithForm { ...props } />
    }
}

export default lpForm