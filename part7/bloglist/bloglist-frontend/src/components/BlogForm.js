import PropTypes from 'prop-types'

import { useField } from '../hooks'

const BlogForm = ({ createBlog }) => {
  const { reset: resetTitle, ...title } = useField('text')
  const { reset: resetAuthor, ...author } = useField('text')
  const { reset: resetUrl, ...url } = useField('text')

  const addBlog = async (event) => {
    event.preventDefault()
    await createBlog({
      title: title.value,
      author: author.value,
      url: url.value,
    })

    resetTitle()
    resetAuthor()
    resetUrl()
  }

  return (
    <div className="blogForm">
      <h2>create new</h2>

      <form onSubmit={addBlog}>
        <div>
          title:
          <input
            id="title"
            name="title"
            {...title}
            placeholder="write blog title here"
          />
        </div>
        <div>
          author:
          <input
            id="author"
            name="author"
            {...author}
            placeholder="write blog author here"
          />
        </div>
        <div>
          url:
          <input
            id="url"
            name="url"
            {...url}
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
  createBlog: PropTypes.func.isRequired,
}

export default BlogForm
