import { SubmissionError } from 'redux-form'
import isPromise from 'is-promise'
import { getOr } from 'lodash/fp'

function wrapSubmissionPromise (result) {
  return isPromise(result) ? result.catch(throwSubmissionError) : result
}

function throwSubmissionError (httpError) {
  const errors = getOr({}, 'errors', httpError)
  throw new SubmissionError(errors)
}

export default wrapSubmissionPromise