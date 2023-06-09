import { useMutation } from "@apollo/client"
import { useState, useEffect } from "react"
import Select from 'react-select'

import { ALL_AUTHORS, EDIT_BIRTH_YEAR } from "../queries"

const AuthorForm = ({ setError, authorNames }) => {
  const [selectedAuthor, setSelectedAuthor] = useState(null)
  const [born, setBorn] = useState('')

  const [ changeBirthYear ] = useMutation(EDIT_BIRTH_YEAR, {
    refetchQueries: [ { query: ALL_AUTHORS }],
    onError: (error) => {
      setError(error.graphQLErrors[0].message)
    }
  })

  const submit = async (event) => {
    event.preventDefault()

    console.log('update author...')
    const birthYear = Number(born)
    changeBirthYear({ variables: { name: selectedAuthor.value, born: birthYear } })

    setBorn('')
  }

  useEffect(() => {
    if (authorNames.length > 1) {
      const defaultAuthor = authorNames[0]
      setSelectedAuthor({
        value: defaultAuthor,
        label: defaultAuthor
      })
    }
  }, [authorNames])

  const options = authorNames.map(name => {
    return {
      value: name,
      label: name
    }
  })

  return (
    <div>
      <h3>Set birthyear</h3>
      <form onSubmit={submit} >
        <Select
          options={options}
          value={selectedAuthor}
          onChange={e => setSelectedAuthor(e)}
        />
        <div>
          born
          <input
            type="number"
            value={born}
            onChange={({ target }) => setBorn(target.value)}
          />
        </div>
        <button type="submit">update author</button>
      </form>
    </div>
  )
}

export default AuthorForm