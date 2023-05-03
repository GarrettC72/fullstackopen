import { useState } from 'react'
import PropTypes from 'prop-types'
import { useDispatch } from 'react-redux'

import { createBlog } from '../reducers/blogReducer'

const BlogForm = ({ hideBlogForm }) => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

  const dispatch = useDispatch()

  const addBlog = (event) => {
    event.preventDefault()

    dispatch(createBlog({ title, author, url }))
    hideBlogForm()

    setTitle('')
    setAuthor('')
    setUrl('')
  }

  return (
    <div className="blogForm">
      <h2>create new</h2>

      <form onSubmit={addBlog}>
        <div>
          title:
          <input
            id="title"
            type="text"
            value={title}
            name="title"
            onChange={({ target }) => setTitle(target.value)}
            placeholder="write blog title here"
          />
        </div>
        <div>
          author:
          <input
            id="author"
            type="text"
            value={author}
            name="author"
            onChange={({ target }) => setAuthor(target.value)}
            placeholder="write blog author here"
          />
        </div>
        <div>
          url:
          <input
            id="url"
            type="text"
            value={url}
            name="url"
            onChange={({ target }) => setUrl(target.value)}
            placeholder="write blog url here"
          />
        </div>
        <button id="create-blog-button" type="submit">
          create
        </button>
      </form>
    </div>
  )
}

BlogForm.propTypes = {
  hideBlogForm: PropTypes.func.isRequired,
}

export default BlogForm
