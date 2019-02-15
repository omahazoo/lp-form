// import React from 'react'
import { reduxForm } from 'redux-form'
import { 
  compose,
  wrapDisplayName,
} from 'recompose'
import {
  addBeforeSubmitHook,
  addDefaultValidate,
  addDefaultOnSubmit,
  debounceOnSubmit,
  filterInitialValues,
  filterSubmitValues,
  enableSubmitOnChange,
  mergeOptionsWithProps,
  renameFormProp,
  wrapSubmissionErrors,
  omitCustomProps,
} from './middleware'

/**
 * A wrapper around the `reduxForm` HOC exported from
 * {@link https://www.npmjs.com/package/redux-form|redux-form} that gives it some extra functionality:
 *
 * 1. Makes extra options available for configuring the form
 * 2. Wraps every rejected `onSubmit` in a `SubmissionError`. If the thrown error has an `errors` property, its value will be passed to `SubmissionError`. The original error will be accessible via the `SubmissionError`s `meta.error` property. This enables developers to access useful information regarding the origin of the failure, e.g., HTTP status.
 * 3. Provides a default `onSubmit` function that resolves successfully and logs a warning.
 *
 * The extra options that can be provided to `lpForm` are as follows:
 * 
 * @name lpForm
 * @type Function
 * @param {String} name - An alias for `"form"` - a unique identifier for the form. 
 * @param {Object} initialValuesFilters - An object with an `allow` or `reject` key pointing to an array of attribute names. 
 * The indicated attributes will be omitted from the form's `initialValues`.
 * @param {Object} submitFilters - Another filter object that will be used to filter the form values that are submitted.
 * @param {Object} constraints - Contraints that will be used to validate the form using the {@link validateWithOptions} function.
 * @param {Boolean=false} submitOnChange - A flag indicating whether the form should submit every time it's changed.
 * @param {Object} validationOptions - An object to pass in any options specified by `validateJS`.
 * @param {Function} beforeSubmit - A function that will be called with the form values before `onSubmit`.
 * @param {Integer} debounceSubmit - An integer representing the time in milliseconds to wait before submitting the form.
 * 
 * @example
 *
 * import { Field } from 'redux-form'
 * import { lpForm } from 'lp-form'
 * import { Input, SubmitButton } from 'lp-components'
 * 
 * function MyForm ({ handleSubmit }) {
 *    return (
 *      <form onSubmit={ handleSubmit }>
 *        <Field name="name" component={ Input } />
 *        <SubmitButton> I'll submit the form! </SubmitButton>
 *      </form>
 *    )
 * }
 * 
 * export default compose(
 *    lpForm({
 *      name: 'my-form',
 *      initialValuesFilters: { reject: ['id'] },
 *      constraints: { name: { presence: true } },
 *    })
 * )(MyForm)
 * 
 */

function lpForm (options={}) {
  return Wrapped => {
    const Wrapper = compose(
      // Modify props using middleware
      mergeOptionsWithProps(options),
      renameFormProp,
      filterInitialValues,
      addDefaultOnSubmit,
      debounceOnSubmit,
      filterSubmitValues,
      addBeforeSubmitHook,
      wrapSubmissionErrors,
      enableSubmitOnChange,
      addDefaultValidate,
      omitCustomProps,
      reduxForm(),
    )(Wrapped)
    Wrapper.displayName = wrapDisplayName(Wrapped, 'lpForm')
    return Wrapper
  }
}

export default lpForm
