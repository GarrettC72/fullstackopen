import { useState } from 'react'
import PropTypes from 'prop-types'

const Blog = ({ updateBlog, deleteBlog, blog, canRemove }) => {
  const [fullView, setFullView] = useState(false)

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  const likeBlog = () => {
    updateBlog({
      ...blog,
      likes: blog.likes + 1,
      user: blog.user.id
    })
  }

  const handleDelete = () => {
    if(window.confirm(`Remove blog ${blog.title} by ${blog.author}`)) {
      deleteBlog(blog)
    }
  }

  const extraBlogDetails = () => {
    return (
      <div>
        <a href={blog.url}>{blog.url}</a>
        <div>likes {blog.likes}<button className="like-button" onClick={likeBlog}>like</button></div>
        <div>{blog.user && blog.user.name}</div>
        {canRemove && <button className="delete-button" onClick={handleDelete}>remove</button>}
      </div>
    )
  }

  return (
    <div className="blog" style={blogStyle}>
      <div>
        {blog.title} {blog.author}
        <button onClick={() => setFullView(!fullView)}>
          {fullView ? 'hide' : 'view'}
        </button>
      </div>
      {fullView && extraBlogDetails()}
    </div>
  )
}

Blog.propTypes = {
  updateBlog: PropTypes.func.isRequired,
  deleteBlog: PropTypes.func.isRequired,
  blog: PropTypes.shape({
    title: PropTypes.string,
    author: PropTypes.string,
    url: PropTypes.string,
    likes: PropTypes.number
  }),
  canRemove: PropTypes.bool.isRequired
}

export default Blog