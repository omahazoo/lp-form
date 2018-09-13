import validateJs from 'validate.js'
import { 
  capitalize,
  lowerCase,
  mapValues,
} from 'lodash'

function stripNamespace (errors, attribute) {
  const namespaces = attribute.split('.').slice(0, -1)
  // If attr is not namespaced, no need to format
  if (!namespaces.length) return errors
  // Otherwise, exclude namespace from formatted error
  const excludeString = capitalize(namespaces.map(lowerCase).join(' ')) + ' '
  return errors.map(error => capitalize(error.replace(excludeString, '')))
}

// Our custom format function strips the namespace from each attribute name
// E.g. person.profile.firstName -> FirstName
function formatErrors (errors) {
  return mapValues(validateJs.formatters.grouped(errors), stripNamespace)
}

export default formatErrors
