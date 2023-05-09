import PropTypes from 'prop-types'
import { useMutation, useQueryClient } from 'react-query'

import { useField } from '../hooks'
import { useNotify } from '../NotificationContext'
import blogService from '../services/blogs'

const BlogForm = ({ hideBlogForm }) => {
  const { reset: resetTitle, ...title } = useField('text')
  const { reset: resetAuthor, ...author } = useField('text')
  const { reset: resetUrl, ...url } = useField('text')

  const queryClient = useQueryClient()
  const notifyWith = useNotify()

  const blogMutation = useMutation(blogService.create, {
    onSuccess: (newBlog) => {
      const blogs = queryClient.getQueryData('blogs')
      queryClient.setQueryData('blogs', blogs.concat(newBlog))
      notifyWith(`a new blog ${newBlog.title} by ${newBlog.author} added`)
    },
    onError: () => {
      notifyWith('failed to add blog - title or url is missing', 'error')
    },
  })

  const addBlog = (event) => {
    event.preventDefault()
    blogMutation.mutate({
      title: title.value,
      author: author.value,
      url: url.value,
    })
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
  hideBlogForm: PropTypes.func.isRequired,
}

export default BlogForm
