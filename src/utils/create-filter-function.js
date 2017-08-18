import { omit, pick } from 'lodash/fp'

// Creates a function that takes an object and filters values based on a "filter" object
// Filter objects contain arrays of "allowed" or "rejected" values

function createFilterFunction (filters={}) {
  return function filter (values) {
    if (filters.allow) return pick(filters.allow, values)
    if (filters.reject) return omit(filters.reject, values)
    return values
  }
}

export default createFilterFunction