import AuthorForm from "./AuthorForm"

const Authors = ({ authors, show }) => {
  if (!show) {
    return null
  }

  const authorNames = authors ? authors.map(a => a.name) : []

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
          {authors.map((a) => (
            <tr key={a.name}>
              <td>{a.name}</td>
              <td>{a.born}</td>
              <td>{a.bookCount}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <AuthorForm authorNames={authorNames} />
    </div>
  )
}

export default Authors
