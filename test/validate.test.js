import { validate } from '../src'

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

test('Validate validates and formats errors correctly', () => {
  const results = validate(CONSTRAINTS)(VALUES)
  expect(results).toEqual({
    name: ['Name can\'t be blank'],
    address: {
      zip: ['Zip is the wrong length (should be 5 characters)']
    }
  })
})

test('Validate is curried', () => {
  const results1 = validate(CONSTRAINTS)(VALUES)
  const results2 = validate(CONSTRAINTS, VALUES)
  expect(results1).toEqual(results2)
})