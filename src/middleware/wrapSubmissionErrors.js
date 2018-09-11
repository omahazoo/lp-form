import { withPropsOnChange } from 'recompose'
import { SubmissionError } from 'redux-form'
import isPromise from 'is-promise'
import { getOr } from 'lodash/fp'

// Wrap submission results in a redux-form SubmissionError
const wrapSubmissionErrors = withPropsOnChange(
  ['onSubmit'],
  ({ onSubmit }) => {
    return {
      onSubmit: (...args) => {
        const result = onSubmit(...args)
        if (!isPromise(result)) return result
        return result.catch(err => {
          const messages = getOr({}, 'errors', err)
          throw new SubmissionError(messages)
        })
      }
    }
  }
)

export default wrapSubmissionErrors