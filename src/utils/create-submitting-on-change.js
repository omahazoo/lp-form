
// Creates an onChange function that calls an existing onChange function, then submits the form.

function createSubmittingOnChange(onChange) {
    return function wrappedOnChange (params, dispatch, props, ...rest) {
        onChange(params, dispatch, props, ...rest)
        return props.submit()
    }
}

export default createSubmittingOnChange
