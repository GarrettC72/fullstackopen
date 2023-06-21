import { useMutation } from '@apollo/client'
import { useState } from 'react'

import { ALL_AUTHORS, ALL_BOOKS, ALL_GENRES, CREATE_BOOK } from '../queries'
import { updateCache } from '../App'

const NewBook = ({ setError, show }) => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [published, setPublished] = useState('')
  const [genre, setGenre] = useState('')
  const [genres, setGenres] = useState([])

  const [ createBook ] = useMutation(CREATE_BOOK, {
    refetchQueries: [ { query: ALL_AUTHORS } ],
    onError: (error) => {
      setError(error.graphQLErrors[0].message)
    },
    update: (cache, response) => {
      const addedBook = response.data.addBook
      const { title, genres, __typename } = addedBook
      addedBook.genres.forEach(bookGenre => {
        updateCache(cache, { query: ALL_BOOKS, variables: { genre: bookGenre } }, addedBook)
      })
      updateCache(cache, { query: ALL_BOOKS, variables: { genre: null } }, addedBook)
      updateCache(cache, { query: ALL_GENRES }, { title, genres, __typename })
    }
  })

  if (!show) {
    return null
  }

  const submit = async (event) => {
    event.preventDefault()

    console.log('add book...')
    const publishedYear = Number(published)
    createBook({ variables: { title, author, published: publishedYear, genres } })

    setTitle('')
    setPublished('')
    setAuthor('')
    setGenres([])
    setGenre('')
  }

  const addGenre = () => {
    setGenres(genres.concat(genre))
    setGenre('')
  }

  return (
    <div>
      <form onSubmit={submit}>
        <div>
          title
          <input
            value={title}
            onChange={({ target }) => setTitle(target.value)}
          />
        </div>
        <div>
          author
          <input
            value={author}
            onChange={({ target }) => setAuthor(target.value)}
          />
        </div>
        <div>
          published
          <input
            type="number"
            value={published}
            onChange={({ target }) => setPublished(target.value)}
          />
        </div>
        <div>
          <input
            value={genre}
            onChange={({ target }) => setGenre(target.value)}
          />
          <button onClick={addGenre} type="button">
            add genre
          </button>
        </div>
        <div>genres: {genres.join(' ')}</div>
        <button type="submit">create book</button>
      </form>
    </div>
  )
}

export default NewBook