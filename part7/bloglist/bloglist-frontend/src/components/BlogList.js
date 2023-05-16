import { useSelector, useDispatch } from 'react-redux'

import { likeBlog, removeBlog } from '../reducers/blogReducer'
import Blog from './Blog'

const BlogList = () => {
  const blogs = useSelector(({ blogs }) => {
    return blogs.slice().sort((a, b) => b.likes - a.likes)
  })
  const user = useSelector((state) => state.login)

  const dispatch = useDispatch()

  const handleDelete = (blog) => {
    if (window.confirm(`Remove blog ${blog.title} by ${blog.author}`)) {
      dispatch(removeBlog(blog))
    }
  }

  return (
    <div>
      {blogs.map((blog) => (
        <Blog
          key={blog.id}
          likeBlog={() => dispatch(likeBlog(blog))}
          deleteBlog={() => handleDelete(blog)}
          blog={blog}
          canRemove={user && blog.user.username === user.username}
        />
      ))}
    </div>
  )
}

export default BlogList
