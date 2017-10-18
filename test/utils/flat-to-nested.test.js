import flatToNested from '../../src/utils/flat-to-nested'

test('flatToNested: converts objects correctly', () => {
  
  const obj = {
    foo: 'bar',
    'baz.ryan.dave': 9,
    'baz.dave': 'ryan',
    'baz.ifat': ['foo', 'bar'],
  }

  expect(flatToNested(obj)).toEqual({
    foo: 'bar',
    baz: {
      ryan: {
        dave: 9,
      },
      dave: 'ryan',
      ifat: [
        'foo', 'bar',
      ],
    },
  })
})

test('flatToNested: leaves falsey arguments alone', () => {
  expect(flatToNested(null)).toEqual(null)
})