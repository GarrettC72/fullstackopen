import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { Button, List, ListItem, ListItemText, TextField } from '@mui/material'
import ThumbUpIcon from '@mui/icons-material/ThumbUp'
import DeleteForeverIcon from '@mui/icons-material/DeleteForever'
import AddCommentIcon from '@mui/icons-material/AddComment'

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
      <div className="blog-details">
        <div>
          <a href={blog.url}>{blog.url}</a>
        </div>
        <div>
          {blog.likes} likes
          <Button
            className="like-button"
            variant="contained"
            color="primary"
            onClick={() => dispatch(likeBlog(blog))}
            sx={{ marginLeft: 1 }}
          >
            <ThumbUpIcon sx={{ paddingRight: 1 }} />
            like
          </Button>
        </div>
        <div>
          Added by&nbsp;
          <Link to={`/users/${blog.user.id}`}> {blog.user.name}</Link>
        </div>
        {canRemove && (
          <Button
            className="delete-button"
            onClick={handleDelete}
            variant="contained"
            color="warning"
          >
            <DeleteForeverIcon sx={{ paddingRight: 1 }} />
            remove
          </Button>
        )}
      </div>
      <form id="comment-form" onSubmit={handleComment}>
        <TextField
          label="Comment"
          id="comment"
          name="comment"
          {...comment}
          placeholder="Write blog comment here"
        />
        <Button
          id="comment-button"
          variant="contained"
          color="primary"
          type="submit"
          sx={{ height: 56 }}
        >
          <AddCommentIcon sx={{ paddingRight: 1 }} />
          add comment
        </Button>
      </form>
      <h3>Comments</h3>
      <List dense>
        {blog.comments.map((comment, index) => (
          <ListItem key={index} divider>
            <ListItemText primary={comment}></ListItemText>
          </ListItem>
        ))}
      </List>
    </div>
  )
}

export default Blog
