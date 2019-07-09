import { withPropsOnChange } from 'recompose'

// Skip onChange function when form is pristine
const enableSubmitOnChange = withPropsOnChange(
  ['onChange'],
  ({ onChange }) => {
    return {
      onChange: (params, dispatch, props, ...rest) => {
        if (props.pristine) return
        return onChange(params, dispatch, props, ...rest)
      }
    }
  }
)

export default enableSubmitOnChange