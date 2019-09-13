import { withPropsOnChange } from 'recompose'
import { SubmissionError } from 'redux-form'
import isPromise from 'is-promise'
import { get } from 'lodash/fp'

// Wrap submission results in a redux-form SubmissionError. 
// Also ensures that the return value of onSubmit is a promise.
const wrapSubmissionPromise = withPropsOnChange(
  ['onSubmit'],
  ({ onSubmit }) => {
    return {
      onSubmit: (...args) => {
        const result = onSubmit(...args)
        if (!isPromise(result)) return Promise.resolve(result)
        return result.catch(mapSubmissionError)
      }
    }
  }
)

function mapSubmissionError (error) {
  const messages = getErrorMessages(error)
  const submissionError = new SubmissionError(messages)
  
  // Retain metadata (e.g., status code) about the original error
  submissionError.meta = { error }
  throw submissionError
}

// Checks for an error that matches LPL's default standard for mapping error messages (HttpError).
// Else defaults to the standard error API and maps to a redux-form "form-wide" error key.
function getErrorMessages (err) {
  const messages = get('errors', err)
  
  if (messages) return messages
  
  const _error = get('message', err)
  return _error ? { _error } : {}
}

export default wrapSubmissionPromise
