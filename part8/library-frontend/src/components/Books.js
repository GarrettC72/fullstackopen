import { useState } from 'react'
import { useQuery } from "@apollo/client"

import { ALL_BOOKS, ALL_GENRES } from "../queries"

const Books = ({ show }) => {
  const [genreFilter, setGenreFilter] = useState(null)

  const genresResult = useQuery(ALL_GENRES)
  const filteredBooksResult = useQuery(ALL_BOOKS, {
    variables: { genre: genreFilter }
  })

  if (!show) {
    return null
  }

  if (genresResult.loading || filteredBooksResult.loading) {
    return <div>loading...</div>
  }

  const genres = genresResult.data.allBooks.reduce((genres, book) => {
    book.genres.forEach(genre => {
      if (!genres.includes(genre)) {
        genres.push(genre)
      }
    })
    return genres
  }, [])

  return (
    <div>
      <h2>books</h2>

      <div>in genre&nbsp;<strong>{genreFilter ?? 'all genres'}</strong></div>

      <table>
        <tbody>
          <tr>
            <th></th>
            <th>author</th>
            <th>published</th>
          </tr>
          {filteredBooksResult.data.allBooks.map((a) => (
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
      <button onClick={() => setGenreFilter(null)}>all genres</button>
    </div>
  )
}

export default Books
