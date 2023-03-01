import { useState } from 'react'

const Blog = ({ blog }) => {
  const [fullView, setFullView] = useState(false)
  
  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  const extraBlogDetails = () => {
    return (
      <div>
        <a href={blog.url}>{blog.url}</a>
        <div>likes {blog.likes}<button>like</button></div>
        <div>{blog.user.name}</div>
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