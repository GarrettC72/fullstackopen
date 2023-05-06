import { useState } from 'react'
import PropTypes from 'prop-types'

const Blog = ({ likeBlog, deleteBlog, blog, canRemove }) => {
  const [fullView, setFullView] = useState(false)

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5,
  }

  const extraBlogDetails = () => {
    return (
      <div>
        <a href={blog.url}>{blog.url}</a>
        <div>
          likes {blog.likes}
          <button className="like-button" onClick={likeBlog}>
            like
          </button>
        </div>
        <div>{blog.user && blog.user.name}</div>
        {canRemove && (
          <button className="delete-button" onClick={deleteBlog}>
            remove
          </button>
        )}
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
  likeBlog: PropTypes.func.isRequired,
  deleteBlog: PropTypes.func.isRequired,
  blog: PropTypes.shape({
    title: PropTypes.string,
    author: PropTypes.string,
    url: PropTypes.string,
    likes: PropTypes.number,
  }),
  canRemove: PropTypes.bool,
}

export default Blog
