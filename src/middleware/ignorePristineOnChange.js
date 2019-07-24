import { withPropsOnChange } from 'recompose'

// Skip onChange function when form is pristine
const ignorePristineOnChange = withPropsOnChange(
  ['onChange'],
  ({ onChange }) => {
    return {
      onChange: (params, dispatch, props, ...rest) => {
        if (!onChange) return
        if (props.pristine && !props.anyTouched) return
        return onChange(params, dispatch, props, ...rest)
      }
    }
  }
)

export default ignorePristineOnChange