import { useQuery } from "@apollo/client"

import { ALL_AUTHORS } from "../queries"
import AuthorForm from "./AuthorForm"

const Authors = ({ setError, show }) => {
  const authorsResult = useQuery(ALL_AUTHORS)

  if (!show) {
    return null
  }

  if (authorsResult.loading) {
    return <div>loading...</div>
  }

  const authorNames = authorsResult.data.allAuthors.map(a => a.name)

  return (
    <div>
      <h2>authors</h2>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>born</th>
            <th>books</th>
          </tr>
          {authorsResult.data.allAuthors.map((a) => (
            <tr key={a.name}>
              <td>{a.name}</td>
              <td>{a.born}</td>
              <td>{a.bookCount}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <AuthorForm setError={setError} authorNames={authorNames} />
    </div>
  )
}

export default Authors
