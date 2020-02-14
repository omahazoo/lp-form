[![npm version](https://badge.fury.io/js/%40launchpadlab%2Flp-form.svg)](https://badge.fury.io/js/%40launchpadlab%2Flp-form)

# lp-form

A drop-in replacemement for the [`reduxForm()`](https://redux-form.com/8.3.0/docs/api/reduxform.md/) Higher-Order Component from [redux-form](https://redux-form.com/) that adds extra options and functionality.

```jsx
import React from 'react'
import { Field } from 'redux-form'
import { lpForm } from 'lp-form'
import { Input, SubmitButton } from 'lp-components'

function MyForm({ handleSubmit }) {
  return (
    <form onSubmit={handleSubmit}>
      <Field name="name" component={Input} />
      <SubmitButton> Submit </SubmitButton>
    </form>
  )
}

export default lpForm({
  name: 'MyForm',
  // Constraints is a special option that adds validations to the form.
  constraints: { name: { presence: true } },
})(MyForm)
```

All available options and enhancements can be found in the [documentation](#documentation).

## Documentation

Documentation and usage info can be found in [docs.md](docs.md).

## Migration Guides

- [v2.0.0](migration-guides/v2.0.0.md)

## Contribution

This package follows the Opex [NPM package guidelines](https://github.com/LaunchPadLab/opex/blob/master/gists/npm-package-guidelines.md). Please refer to the linked document for information on contributing, testing and versioning.
