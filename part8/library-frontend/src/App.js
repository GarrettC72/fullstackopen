import { useState, useEffect } from 'react'
import { useApolloClient, useSubscription } from '@apollo/client'

import { ALL_BOOKS, ALL_GENRES, BOOK_ADDED } from './queries'

import Authors from './components/Authors'
import Books from './components/Books'
import NewBook from './components/NewBook'
import LoginForm from './components/LoginForm'
import Recommend from './components/Recommend'

const Notify = ({errorMessage}) => {
  if ( !errorMessage ) {
    return null
  }
  return (
    <div style={{color: 'red'}}>
      {errorMessage}
    </div>
  )
}

// function that takes care of manipulating cache
export const updateCache = (cache, query, addedBook) => {
  // helper that is used to eliminate saving same person twice
  const uniqByTitle = (a) => {
    let seen = new Set()
    return a.filter((item) => {
      let k = item.title
      return seen.has(k) ? false : seen.add(k)
    })
  }

  cache.updateQuery(query, (data) => {
    if (data) {
      return {
        allBooks: uniqByTitle(data.allBooks.concat(addedBook)),
      }
    }
  })
}

const App = () => {
  const [page, setPage] = useState('authors')
  const [errorMessage, setErrorMessage] = useState(null)
  const [token, setToken] = useState(null)

  const client = useApolloClient()

  useSubscription(BOOK_ADDED, {
    onData: ({ data, client }) => {
      const addedBook = data.data.bookAdded
      const { title, genres, __typename } = addedBook
      window.alert(`A new book '${addedBook.title}' by '${addedBook.author.name}' added`)
      addedBook.genres.forEach(bookGenre => {
        updateCache(client.cache, { query: ALL_BOOKS, variables: { genre: bookGenre } }, addedBook)
      })
      updateCache(client.cache, { query: ALL_BOOKS, variables: { genre: null } }, addedBook)
      updateCache(client.cache, { query: ALL_GENRES }, { title, genres, __typename })
    }
  })

  useEffect(() => {
    const token = localStorage.getItem('library-user-token')
    setToken(token)
  }, [])

  const notify = (message) => {
    setErrorMessage(message)
    setTimeout(() => {
      setErrorMessage(null)
    }, 10000)
  }

  const logout = async () => {
    setToken(null)
    localStorage.clear()
    client.resetStore()
    setPage('login')
  }

  return (
    <div>
      <Notify errorMessage={errorMessage} />
      <div>
        <button onClick={() => setPage('authors')}>authors</button>
        <button onClick={() => setPage('books')}>books</button>
        {token ?
          (
            <>
              <button onClick={() => setPage('add')}>add book</button>
              <button onClick={() => setPage('recommend')}>recommend</button>
              <button onClick={logout}>logout</button>
            </>
          ) :
          <button onClick={() => setPage('login')}>login</button>
        }
      </div>

      <Authors
        setError={notify}
        show={page === 'authors'}
      />

      <Books
        show={page === 'books'}
      />

      <NewBook setError={notify} show={page === 'add'} />

      <LoginForm
        setToken={setToken}
        setError={notify}
        setPage={() => setPage('authors')}
        show={page === 'login'}
      />

      <Recommend
        show={page === 'recommend'}
      />
    </div>
  )
}

export default App
