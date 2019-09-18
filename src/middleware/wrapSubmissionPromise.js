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
        return result.catch(wrapSubmissionError)
      }
    }
  }
)

// Attempts to grab the errors or error message provided and wraps it in a redux-form SubmissionError
// The original error is stored in the error's `meta` key to retain metadata (e.g., status code)
function wrapSubmissionError (error) {
  const messages = getErrorMessages(error)
  const submissionError = new SubmissionError(messages)
  
  submissionError.meta = { error }
  throw submissionError
}

// Checks for an error that matches LPL's default standard for mapping error messages (HttpError).
// Else defaults to the standard error API and maps to a redux-form "form-wide" error key.
function getErrorMessages (err) {
  const messages = get('errors', err)
  
  if (messages) return messages
  
  const formWideError = get('message', err)
  return formWideError ? { _error: formWideError } : {}
}

export default wrapSubmissionPromise
