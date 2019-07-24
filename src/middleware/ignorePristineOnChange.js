import { withPropsOnChange } from 'recompose'

// Skip onChange function when form is pristine
const ignorePristineOnChange = withPropsOnChange(
  ['onChange'],
  ({ onChange }) => {
    if (!onChange) return {}
    return {
      onChange: (params, dispatch, props, ...rest) => {
        if (props.pristine && !props.anyTouched) return
        return onChange(params, dispatch, props, ...rest)
      }
    }
  }
)

export default ignorePristineOnChange