import PropTypes from 'prop-types'
import { useDispatch } from 'react-redux'
import { Button, TextField } from '@mui/material'

import { createBlog } from '../reducers/blogReducer'
import { useField } from '../hooks'

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
      <h2>Create New Blog</h2>

      <form onSubmit={addBlog} id="blog-form">
        <div>
          <TextField
            label="Title"
            id="title"
            name="title"
            {...title}
            placeholder="Write blog title here"
          />
        </div>
        <div>
          <TextField
            label="Author"
            id="author"
            name="author"
            {...author}
            placeholder="Write blog author here"
          />
        </div>
        <div>
          <TextField
            label="Url"
            id="url"
            name="url"
            {...url}
            placeholder="Write blog url here"
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
