import React from 'react'
import { createStore } from 'redux'
import { Provider } from 'react-redux'
import { configure, mount } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import debounce from 'lodash/debounce'
import { SubmissionError } from 'redux-form'
import isPromise from 'is-promise'
import { lpForm } from '../src'

jest.mock('lodash/debounce', () => jest.fn(fn => fn))

configure({ adapter: new Adapter() })

function mountWithProvider (node) {
  const mockStore = createStore(() => ({}))
  return mount(<Provider store={ mockStore }>{ node }</Provider>)
}

const INITIAL_VALUES = {
  name: 'Test Person',
  address: {
    zip: '02540',
    street: 'Shady Lane'
  }
}

test('lpForm: wrapper has correct displayName', () => {
  const Wrapped = () => <div> Hi </div>
  const Wrapper = lpForm()(Wrapped)
  expect(Wrapper.displayName).toEqual('lpForm(Wrapped)')
})

// These tests rely on our mock reduxForm, which passes down its config as props to the wrapped component

test('lpForm: filters initial values', () => {
  const initialValuesFilters = { 'reject': ['name', 'address.zip'] }
  const Wrapped = () => <div> Hi </div>
  const Form = lpForm({ initialValuesFilters, initialValues: INITIAL_VALUES })(Wrapped)
  const wrapper = mountWithProvider(<Form />)
  const formConfig = wrapper.find(Wrapped).props()
  expect(formConfig.initialValues).toEqual({ address: { street: 'Shady Lane' }})
})

test('lpForm: filters submitted values', () => {
  const submitFilters = { 'reject': ['name', 'address.zip'] }
  const onSubmit = jest.fn()
  const Wrapped = () => <div> Hi </div>
  const Form = lpForm({ submitFilters, onSubmit })(Wrapped)
  const wrapper = mountWithProvider(<Form />)
  const formConfig = wrapper.find(Wrapped).props()
  formConfig.onSubmit(INITIAL_VALUES)
  expect(onSubmit).toHaveBeenCalledWith({ address: { street: 'Shady Lane' }})
})

test('lpForm: wraps synchronous onSubmits in a promise', () => {
  const syncResult = 'a synchronous result'
  const onSubmit = () => syncResult
  const Wrapped = () => <div> Hi </div>
  const Form = lpForm({ onSubmit })(Wrapped)
  const wrapper = mountWithProvider(<Form />)
  const formConfig = wrapper.find(Wrapped).props()
  const result = formConfig.onSubmit(INITIAL_VALUES)
  expect(isPromise(result)).toBe(true)
  return result.then(resolvedResult => {
    expect(resolvedResult).toEqual(syncResult)
  })
})

test('lpForm: wraps rejected promises in a SubmissionError', () => {
  expect.assertions(2)
  const ERRORS = [ 'my', 'errors' ]
  const onSubmit = () => Promise.reject({ errors: ERRORS })
  const Wrapped = () => <div> Hi </div>
  const Form = lpForm({ onSubmit })(Wrapped)
  const wrapper = mountWithProvider(<Form />)
  const formConfig = wrapper.find(Wrapped).props()

  return formConfig.onSubmit(INITIAL_VALUES).catch(e => {
    expect(e instanceof SubmissionError).toEqual(true)
    expect(e.errors).toEqual(ERRORS)
  })
})

test('lpForm: retains information about the originating error during submit', () => {
  expect.assertions(3)
  const ERROR = "Invalid authentication"
  const onSubmit = () => {
    const error = new Error('unauthorized')
    error.errors = { message: ERROR }
    error.status = 401
    return Promise.reject(error)
  }
  const Wrapped = () => <div>Hi</div>
  const Form = lpForm({ onSubmit })(Wrapped)
  const wrapper = mountWithProvider(<Form />)
  const formConfig = wrapper.find(Wrapped).props()
  
  return formConfig.onSubmit(INITIAL_VALUES).catch(e => {
    expect(e.errors.message).toEqual(ERROR)
    expect(e.meta.error).toBeInstanceOf(Error)
    expect(e.meta.error.status).toBe(401)
  })
})

test('lpForm: creates submitting onChange if submitOnChange is true', () => {
  const onChange = jest.fn()
  const submit = jest.fn()
  const Wrapped = () => <div> Hi </div>
  const Form = lpForm({ onChange, submitOnChange: true })(Wrapped)
  const wrapper = mountWithProvider(<Form />)
  const formConfig = wrapper.find(Wrapped).props()
  const wrappedOnChange = formConfig.onChange
  // Call new onChange with typical arguments
  const onChangeArgs = [
    {},             // Params
    () => {},       // Dispatch
    { submit }      // Props
  ]
  wrappedOnChange(...onChangeArgs)
  expect(submit).toHaveBeenCalled()
  expect(onChange).toHaveBeenCalledWith(...onChangeArgs)
})

test('lpForm: passes through given onChange if submitOnChange is false', () => {
  const onChange = () => 'result'
  const Wrapped = () => <div> Hi </div>
  const Form = lpForm({ onChange })(Wrapped)
  const wrapper = mountWithProvider(<Form />)
  const formConfig = wrapper.find(Wrapped).props()
  // Call new onChange with typical arguments
  const onChangeArgs = [
    {},       // Params
    () => {}, // Dispatch
    {}        // Props
  ]
  expect(formConfig.onChange(...onChangeArgs)).toBe(onChange(...onChangeArgs))
})

test('lpForm: provides a default onSubmit that submits successfully', () => {
  expect.assertions(1)
  const Wrapped = () => <div> Hi </div>
  const Form = lpForm()(Wrapped)
  const wrapper = mountWithProvider(<Form />)
  const formConfig = wrapper.find(Wrapped).props()

  return formConfig.onSubmit(INITIAL_VALUES).then(values => {
    expect(values).toEqual(INITIAL_VALUES)
  })

})

test('lpForm: creates validation function with constraints', () => {
  const constraints = { 'foo': { presence: true } }
  const Wrapped = () => <div> Hi </div>
  const Form = lpForm({ constraints })(Wrapped)
  const wrapper = mountWithProvider(<Form />)
  const formConfig = wrapper.find(Wrapped).props()
  const errors = formConfig.validate({})
  expect(errors).toEqual({ foo: [ "Foo can't be blank" ] })
})

test('lpForm: aliases "form" with "name"', () => {
  const Wrapped = () => <div> Hi </div>
  const Form = lpForm({ name: 'foo' })(Wrapped)
  const wrapper = mountWithProvider(<Form />)
  const formConfig = wrapper.find(Wrapped).props()
  expect(formConfig.form).toEqual('foo')
})

test('lpForm: can recieve config as props', () => {
  const Wrapped = () => <div> Hi </div>
  const Form = lpForm()(Wrapped)
  const wrapper = mountWithProvider(<Form name="foo" />)
  const formConfig = wrapper.find(Wrapped).props()
  expect(formConfig.form).toEqual('foo')
})

test('lpForm: props override config', () => {
  const Wrapped = () => <div> Hi </div>
  const Form = lpForm({ name: 'from-config' })(Wrapped)
  const wrapper = mountWithProvider(<Form name="from-props" />)
  const formConfig = wrapper.find(Wrapped).props()
  expect(formConfig.form).toEqual('from-props')
})

test('lpForm: can override validate function', () => {
  const Wrapped = () => <div> Hi </div>
  const validate = () => 'result'
  const Form = lpForm({ validate })(Wrapped)
  const wrapper = mountWithProvider(<Form />)
  const formConfig = wrapper.find(Wrapped).props()
  expect(formConfig.validate()).toEqual(validate())
})

test('lpForm: can pass in options through `validationOptions`', () => {
  const constraints = { 'foo': { presence: true } }
  const Wrapped = () => <div> Hi </div>
  const Form = lpForm({ constraints, validationOptions: { fullMessages: false }})(Wrapped)
  const wrapper = mountWithProvider(<Form />)
  const formConfig = wrapper.find(Wrapped).props()
  const errors = formConfig.validate({})
  expect(errors).toEqual({ foo: ["can't be blank"] })
})

test('lpForm: calls `beforeSubmit` with form values and options', () => {
  const onSubmit = jest.fn()
  const option = 'some option'
  const prop = 'some prop'
  const beforeSubmit = jest.fn(values => ({ ...values, name: 'Rachel' }))
  const Wrapped = () => <div> Hi </div>
  const Form = lpForm({ onSubmit, beforeSubmit, option })(Wrapped)
  const wrapper = mountWithProvider(<Form prop={ prop } />)
  const formConfig = wrapper.find(Wrapped).props()
  formConfig.onSubmit(INITIAL_VALUES)
  expect(beforeSubmit).toHaveBeenCalledWith(INITIAL_VALUES, { option, prop })
  expect(onSubmit).toHaveBeenCalledWith({ ...INITIAL_VALUES, name: 'Rachel' })
})

test('lpForm: can debounce onSubmit function', () => {
  debounce.mockClear()
  const Wrapped = () => <div> Hi </div>
  const onSubmit = jest.fn()
  const Form = lpForm({ debounceSubmit: 200, onSubmit })(Wrapped)
  const wrapper = mountWithProvider(<Form />)
  const formConfig = wrapper.find(Wrapped).props()
  formConfig.onSubmit(INITIAL_VALUES)
  expect(debounce).toHaveBeenCalledTimes(1)
  expect(onSubmit).toHaveBeenCalledTimes(1)
})

test('lpForm: will ignore onChange when the form is pristine and untouched', () => {
  const onChange = jest.fn()
  const Wrapped = () => <div> Hi </div>
  const Form = lpForm({ onChange })(Wrapped)
  const wrapper = mountWithProvider(<Form />)
  const formConfig = wrapper.find(Wrapped).props()
  const wrappedOnChange = formConfig.onChange
  // Call new onChange with pristine form arguments
  const onChangeArgs = [
    {},                // Params
    () => {},          // Dispatch
    { pristine: true, anyTouched: false } // Props
  ]
  wrappedOnChange(...onChangeArgs)
  expect(onChange).not.toHaveBeenCalled()
})
