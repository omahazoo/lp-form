import { SubmissionError } from 'redux-form'
import isPromise from 'is-promise'

// Creates a submit function that runs a filter on submitted values
// and throws a SubmissionError if submission fails

function submitWithFilter (submitFunction, filterFunction) {
  return function submit (values) {
    const filteredValues = filterFunction(values)
    const result = submitFunction(filteredValues)
    if (!isPromise(result)) throw 'onSubmit function must return a promise.'
    return result.catch(error => { throw new SubmissionError(error.response.errors) })
  }
}

export default submitWithFilter