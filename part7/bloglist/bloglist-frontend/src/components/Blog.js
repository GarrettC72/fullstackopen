import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import { Button, TextField } from '@mui/material'

import { commentBlog, likeBlog, removeBlog } from '../reducers/blogReducer'
import { useField } from '../hooks'

const Blog = () => {
  const id = useParams().id
  const blog = useSelector(({ blogs }) => blogs.find((blog) => blog.id === id))
  const user = useSelector((state) => state.login)
  const { reset: resetComment, ...comment } = useField('text')

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

  const handleComment = (event) => {
    event.preventDefault()
    dispatch(commentBlog(blog, comment.value))

    resetComment()
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
      <h3>comments</h3>
      <form onSubmit={handleComment}>
        <TextField
          label="comment"
          id="comment"
          name="comment"
          {...comment}
          placeholder="write blog comment here"
        />
        <Button
          id="comment-button"
          variant="contained"
          color="primary"
          type="submit"
        >
          add comment
        </Button>
      </form>
      <ul>
        {blog.comments.map((comment, index) => (
          <li key={index}>{comment}</li>
        ))}
      </ul>
    </div>
  )
}

export default Blog
