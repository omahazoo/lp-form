import set from 'lodash/fp/set'
import map from 'lodash/map'
import merge from 'lodash/merge'

// Maps an iterable and merges the objects that are returned into a single object
const reduceToObject = (obj, func) => merge(...map(obj, func))

 // Returns an object where the keys are converted from string paths to nested objects.
function flatToNested (obj) {
  if (!obj) return obj
  return reduceToObject(obj, (value, key) => set(key, value, {}))
}

export default flatToNested