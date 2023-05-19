import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'

import { likeBlog, removeBlog } from '../reducers/blogReducer'

const Blog = () => {
  const id = useParams().id
  const blog = useSelector(({ blogs }) => blogs.find((blog) => blog.id === id))
  const user = useSelector((state) => state.login)

  const dispatch = useDispatch()
  const navigate = useNavigate()
  if (!blog) return null

  const canRemove = user && blog.user.username === user.username

  const handleDelete = () => {
    if (window.confirm(`Remove blog ${blog.title} by ${blog.author}`)) {
      dispatch(removeBlog(blog))
      navigate('/')
    }
  }

  return (
    <div className="blog">
      <h2>
        {blog.title} {blog.author}
      </h2>
      <div>
        <a href={blog.url}>{blog.url}</a>
      </div>
      <div>
        {blog.likes} likes
        <button
          className="like-button"
          onClick={() => dispatch(likeBlog(blog))}
        >
          like
        </button>
      </div>
      <div>added by {blog.user.name}</div>
      {canRemove && (
        <button className="delete-button" onClick={handleDelete}>
          remove
        </button>
      )}
    </div>
  )
}

export default Blog
