import { renameProp } from 'recompose'

// Alias "form" prop with "name"
const renameFormProp = renameProp('name', 'form')

export default renameFormProp