import PropTypes from 'prop-types'
import { useDispatch } from 'react-redux'

import { createBlog } from '../reducers/blogReducer'
import { useField } from '../hooks'
import { Button, TextField } from '@mui/material'

const BlogForm = ({ hideBlogForm }) => {
  const { reset: resetTitle, ...title } = useField('text')
  const { reset: resetAuthor, ...author } = useField('text')
  const { reset: resetUrl, ...url } = useField('text')

  const dispatch = useDispatch()

  const addBlog = (event) => {
    event.preventDefault()
    dispatch(
      createBlog({
        title: title.value,
        author: author.value,
        url: url.value,
      })
    )
    hideBlogForm()

    resetTitle()
    resetAuthor()
    resetUrl()
  }

  return (
    <div className="blogForm">
      <h2>create new</h2>

      <form onSubmit={addBlog}>
        <div>
          <TextField
            label="title"
            id="title"
            name="title"
            {...title}
            placeholder="write blog title here"
          />
        </div>
        <div>
          <TextField
            label="author"
            id="author"
            name="author"
            {...author}
            placeholder="write blog author here"
          />
        </div>
        <div>
          <TextField
            label="url"
            id="url"
            name="url"
            {...url}
            placeholder="write blog url here"
          />
        </div>
        <Button
          id="create-blog-button"
          variant="contained"
          color="primary"
          type="submit"
        >
          create
        </Button>
      </form>
    </div>
  )
}

BlogForm.propTypes = {
  hideBlogForm: PropTypes.func.isRequired,
}

export default BlogForm
