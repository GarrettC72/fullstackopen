const Recommend = ({ books, genre, show }) => {
  if (!show) {
    return null
  }

  return (
    <div>
      <h2>recommendations</h2>

      <div>books in your favorite genre&nbsp;<strong>{genre}</strong></div>

      <table>
        <tbody>
          <tr>
            <th></th>
            <th>author</th>
            <th>published</th>
          </tr>
          {books.map((a) => (
            <tr key={a.title}>
              <td>{a.title}</td>
              <td>{a.author.name}</td>
              <td>{a.published}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default Recommend