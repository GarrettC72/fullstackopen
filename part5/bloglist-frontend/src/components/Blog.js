import { useState } from 'react'

const Blog = ({ updateBlog, deleteBlog, blog, user }) => {
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
    if(window.confirm(`Remove ${blog.title} by ${blog.author}`)) {
      deleteBlog(blog)
    }
  }

  const extraBlogDetails = () => {
    return (
      <div>
        <a href={blog.url}>{blog.url}</a>
        <div>likes {blog.likes}<button onClick={likeBlog}>like</button></div>
        <div>{blog.user.name}</div>
        {blog.user.username === user.username && <button onClick={handleDelete}>remove</button>}
      </div>
    )
  }

  return (
    <div style={blogStyle}>
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

export default Blog