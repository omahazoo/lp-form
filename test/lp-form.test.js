import React from 'react'
import { lpForm } from '../src'
import { configure, mount } from 'enzyme'
import { SubmissionError } from 'redux-form'
import Adapter from 'enzyme-adapter-react-15'

configure({ adapter: new Adapter() })

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
  const wrapper = mount(<Form />)
  const formConfig = wrapper.find(Wrapped).props()
  expect(formConfig.initialValues).toEqual({ address: { street: 'Shady Lane' }})
})

test('lpForm: filters submitted values', () => {
  const submitFilters = { 'reject': ['name', 'address.zip'] }
  const onSubmit = jest.fn()
  const Wrapped = () => <div> Hi </div>
  const Form = lpForm({ submitFilters, onSubmit })(Wrapped)
  const wrapper = mount(<Form />)
  const formConfig = wrapper.find(Wrapped).props()
  formConfig.onSubmit(INITIAL_VALUES)
  expect(onSubmit).toHaveBeenCalledWith({ address: { street: 'Shady Lane' }})
})

test('lpForm: wraps rejected promises in a SubmissionError', () => {
  expect.assertions(2)
  const ERRORS = [ 'my', 'errors' ]
  const onSubmit = () => Promise.reject({ errors: ERRORS })
  const Wrapped = () => <div> Hi </div>
  const Form = lpForm({ onSubmit })(Wrapped)
  const wrapper = mount(<Form />)
  const formConfig = wrapper.find(Wrapped).props()

  return formConfig.onSubmit(INITIAL_VALUES).catch(e => {
    expect(e instanceof SubmissionError).toEqual(true)
    expect(e.errors).toEqual(ERRORS)
  })
})

test('lpForm: creates submitting onChange if submitOnChange is true', () => {
  const onChange = jest.fn()
  const submit = jest.fn()
  const Wrapped = () => <div> Hi </div>
  const Form = lpForm({ onChange, submitOnChange: true })(Wrapped)
  const wrapper = mount(<Form />)
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
  const onChange = new Function()
  const Wrapped = () => <div> Hi </div>
  const Form = lpForm({ onChange })(Wrapped)
  const wrapper = mount(<Form />)
  const formConfig = wrapper.find(Wrapped).props()
  expect(formConfig.onChange).toBe(onChange)
})

test('lpForm: provides a default onSubmit that submits successfully', () => {
  expect.assertions(1)
  const Wrapped = () => <div> Hi </div>
  const Form = lpForm()(Wrapped)
  const wrapper = mount(<Form />)
  const formConfig = wrapper.find(Wrapped).props()

  return formConfig.onSubmit(INITIAL_VALUES).then(values => {
    expect(values).toEqual(INITIAL_VALUES)
  })

})

test('lpForm: creates validation function with constraints', () => {
  const constraints = { 'foo': { presence: true } }
  const Wrapped = () => <div> Hi </div>
  const Form = lpForm({ constraints })(Wrapped)
  const wrapper = mount(<Form />)
  const formConfig = wrapper.find(Wrapped).props()
  const errors = formConfig.validate({})
  expect(errors).toEqual({ foo: [ "Foo can't be blank" ] })
})

test('lpForm: aliases "form" with "name"', () => {
  const Wrapped = () => <div> Hi </div>
  const Form = lpForm({ name: 'foo' })(Wrapped)
  const wrapper = mount(<Form />)
  const formConfig = wrapper.find(Wrapped).props()
  expect(formConfig.form).toEqual('foo')
})

test('lpForm: can recieve config as props', () => {
  const Wrapped = () => <div> Hi </div>
  const Form = lpForm()(Wrapped)
  const wrapper = mount(<Form name="foo" />)
  const formConfig = wrapper.find(Wrapped).props()
  expect(formConfig.form).toEqual('foo')
})

test('lpForm: props override config', () => {
  const Wrapped = () => <div> Hi </div>
  const Form = lpForm({ name: 'from-config' })(Wrapped)
  const wrapper = mount(<Form name="from-props" />)
  const formConfig = wrapper.find(Wrapped).props()
  expect(formConfig.form).toEqual('from-props')
})

test('lpForm: can override validate function', () => {
  const Wrapped = () => <div> Hi </div>
  const Form = lpForm({ validate: null })(Wrapped)
  const wrapper = mount(<Form />)
  const formConfig = wrapper.find(Wrapped).props()
  expect(formConfig.validate).toEqual(null)
})


