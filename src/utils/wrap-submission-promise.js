import { SubmissionError } from 'redux-form'
import isPromise from 'is-promise'

function wrapSubmissionPromise (result) {
  return isPromise(result) ? result.catch(throwSubmissionError) : result
}

function throwSubmissionError (error) {
  throw new SubmissionError(error.response.errors)
}

export default wrapSubmissionPromise