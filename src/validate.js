import validateJs from 'validate.js'
import {
  capitalize,
  curry,
  lowerCase,
  mapValues,
} from 'lodash'
import { 
  flatToNested,
} from './utils'

/**
 * A wrapper around the `validate` function exported from
 * {@link https://validatejs.org/|Validate JS} to make it work seamlessly with
 * {@link http://redux-form.com/|Redux Form}.
 * 
 * @param {Object} constraints - A 'flat' object containing constraints in the
 * format specified by Validate JS. These are key-value pairs where the keys
 * correspond to keys in the data that will be validated. This is a 'flat'
 * object in that nested data must be accessed using a string path
 * (ex. 'foo.bar') as the key.
 * @param {Object} values - A nested object containing values to be validated.
 * 
 * @returns {Object} errors - A nested object of errors that will be passed to redux form.
 * 
 * @example
 * 
 * const values = {
 *   name: 'Foo',
 *   address: {
 *     zip: '12'
 *   }
 * }
 * 
 * const constraints = {
 *   name: {
 *     presence: true
 *   },
 *   'address.zip': {
 *     presence: true,
 *     length: { is: 5 }
 *   }
 * }
 * 
 * // Function is curried so this call will work
 * validate(constraints)(values) 
 * 
 * // {
 * //   address: {
 * //     zip: ['Zip is the wrong length (should be 5 characters)']
 * //   }
 * // }
 */

function validate (constraints, values) {
  // validate the data using Validate JS and our custom format
  const errors = validateJs(values, constraints, { format: 'lp' })
  // transform the errors from a 'flat' structure to a 'nested' structure
  return flatToNested(errors)
}

// Our custom format function strips the namespace from each attribute name
// E.g. person.profile.firstName -> FirstName
function formatErrors (errors) {
  return mapValues(validateJs.formatters.grouped(errors), stripNamespace)
}

validateJs.formatters.lp = formatErrors

function stripNamespace (errors, attribute) {
  const namespaces = attribute.split('.').slice(0, -1)
  // If attr is not namespaced, no need to format
  if (!namespaces.length) return errors
  // Otherwise, exclude namespace from formatted error
  const excludeString = capitalize(namespaces.map(lowerCase).join(' ')) + ' '
  return errors.map(error => capitalize(error.replace(excludeString, '')))
}

export default curry(validate)
