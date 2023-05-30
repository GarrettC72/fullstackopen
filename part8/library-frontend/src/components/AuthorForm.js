import { useMutation } from "@apollo/client"
import { useState } from "react"
import { EDIT_BIRTH_YEAR } from "../queries"

const AuthorForm = () => {
  const [name, setName] = useState('')
  const [born, setBorn] = useState('')

  const [ changeBirthYear ] = useMutation(EDIT_BIRTH_YEAR)

  const submit = async (event) => {
    event.preventDefault()

    console.log('update author...')
    const birthYear = Number(born)
    changeBirthYear({ variables: { name, born: birthYear } })

    setName('')
    setBorn('')
  }

  return (
    <div>
      <h3>Set birthyear</h3>
      <form onSubmit={submit}>
        <div>
          name
          <input
            value={name}
            onChange={({ target }) => setName(target.value)}
          />
        </div>
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