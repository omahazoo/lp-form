import { validateWithOptions } from '../src'

const VALUES = {
  address: {
    zip: '12'
  }
}

const CONSTRAINTS = {
  name: {
    presence: true
  },
  'address.zip': {
    presence: true,
    length: { is: 5 }
  }
}

const OPTIONS = {
  fullMessages: false,
}

test('validateWithOptions validates and formats errors correctly', () => {
  const results = validateWithOptions(CONSTRAINTS, VALUES)
  expect(results).toEqual({
    name: ['Name can\'t be blank'],
    address: {
      zip: ['Zip is the wrong length (should be 5 characters)']
    }
  })
})

test('validateWithOptions formats errors with options', () => {
  const results = validateWithOptions(CONSTRAINTS, VALUES, OPTIONS)
  expect(results).toEqual({
    name: ['can\'t be blank'],
    address: {
      zip: ['Is the wrong length (should be 5 characters)']
    }
  })
})

