import { withPropsOnChange } from 'recompose'
import { SubmissionError } from 'redux-form'
import isPromise from 'is-promise'
import { getOr } from 'lodash/fp'

// Wrap submission results in a redux-form SubmissionError. 
// Also ensures that the return value of onSubmit is a promise.
const wrapSubmissionErrors = withPropsOnChange(
  ['onSubmit'],
  ({ onSubmit }) => {
    return {
      onSubmit: (...args) => {
        const result = onSubmit(...args)
        if (!isPromise(result)) return Promise.resolve(result)
        return result.catch(err => {
          const messages = getOr({}, 'errors', err)
          const submissionError = new SubmissionError(messages)
          
          // Retain metadata (e.g., status code) about the original error
          submissionError.meta = { error: err }
          throw submissionError
        })
      }
    }
  }
)

export default wrapSubmissionErrors
