import validateJs from 'validate.js'
import validate from './validate'
import {
  formatErrors,
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
 * @param {Object} options - An object to pass in any options specified by `validateJS`.
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
 * const options = {
 *   fullMessages: true,
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
 * validate(constraints, options, values)
 * 
 * // {
 * //   address: {
 * //     zip: ['Zip is the wrong length (should be 5 characters)']
 * //   }
 * // }
 */

function validateWithOptions (constraints, values, options={}) {
  // validate the data using Validate JS and our custom format
  const errors = validateJs(values, constraints, { format: 'lp', ...options })
  // transform the errors from a 'flat' structure to a 'nested' structure
  return flatToNested(errors)
}

validateJs.formatters.lp = formatErrors

export default validateWithOptions