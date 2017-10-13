import React from 'react'

export { SubmissionError } from 'redux-form'

export const reduxForm = function (args) {
  return Wrapped =>
    function Wrapper (props) {
      const config = { ...args, ...props }
      return <Wrapped { ...config } />
    }
}
