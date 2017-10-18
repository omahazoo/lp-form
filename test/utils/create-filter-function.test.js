import createFilterFunction from '../../src/utils/create-filter-function'

const VALUES = {
  foo: 'foo',
  bar: 'bar',
}

test('createFilterFunction: rejects indicated values', () => {
  const constraints = { reject: ['foo'] }
  const filter = createFilterFunction(constraints)
  expect(filter(VALUES)).toEqual({ bar: 'bar' })
})

test('createFilterFunction: allows indicated values', () => {
  const constraints = { allow: ['foo'] }
  const filter = createFilterFunction(constraints)
  expect(filter(VALUES)).toEqual({ foo: 'foo' })
})

test('createFilterFunction: returns identity if allow/reject is not specified', () => {
  const constraints = {}
  const filter = createFilterFunction(constraints)
  expect(filter(VALUES)).toEqual(VALUES)
})