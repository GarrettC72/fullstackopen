import { useState } from 'react'

const Books = ({ books, show }) => {
  const [genreFilter, setGenreFilter] = useState('all genres')

  if (!show) {
    return null
  }

  const genres = books.reduce((genres, book) => {
    book.genres.forEach(genre => {
      if (!genres.includes(genre)) {
        genres.push(genre)
      }
    })
    return genres
  }, [])

  const booksToShow = genreFilter !== 'all genres' ? books.filter(book => book.genres.includes(genreFilter)) : books

  return (
    <div>
      <h2>books</h2>

      <div>in genre&nbsp;<strong>{genreFilter}</strong></div>

      <table>
        <tbody>
          <tr>
            <th></th>
            <th>author</th>
            <th>published</th>
          </tr>
          {booksToShow.map((a) => (
            <tr key={a.title}>
              <td>{a.title}</td>
              <td>{a.author.name}</td>
              <td>{a.published}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {genres.map(genre => (
        <button key={genre} onClick={() => setGenreFilter(genre)}>{genre}</button>
      ))}
      <button onClick={() => setGenreFilter('all genres')}>all genres</button>
    </div>
  )
}

export default Books
