import { compose, mapProps } from 'recompose'
import { omit } from 'lodash/fp'
const omitProps = compose(mapProps, omit)

// Omit props that we only use internally
const omitCustomProps = omitProps([
  'initialValuesFilters',
  'debounceSubmit',
  'submitFilters',
  'beforeSubmit',
  'submitOnChange',
  'constraints',
])

export default omitCustomProps