import { withProps } from 'recompose'

// Merge HOC options with props
function mergeOptionsWithProps (options) {
  return withProps(props => ({ ...options, ...props }))
}

export default mergeOptionsWithProps