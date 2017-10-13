import { omit, pick, identity } from 'lodash/fp'

// Creates a function that takes an object and filters values based on a "filter" object
// Filter objects contain arrays of "allowed" or "rejected" values

function createFilterFunction (filters={}) {
  if (filters.allow) return pick(filters.allow)
  if (filters.reject) return omit(filters.reject)
  return identity
}

export default createFilterFunction