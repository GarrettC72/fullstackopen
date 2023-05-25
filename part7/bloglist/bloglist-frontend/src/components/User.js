import { useParams } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { List, ListItem } from '@mui/material'

const User = () => {
  const id = useParams().id
  const user = useSelector(({ users }) => users.find((user) => user.id === id))
  if (!user) return null

  return (
    <div>
      <h2>{user.name}</h2>
      <h3>Added Blogs</h3>
      <List dense>
        {user.blogs.map((blog) => (
          <ListItem key={blog.id} divider>
            <Link to={`/blogs/${blog.id}`}>{blog.title}</Link>
          </ListItem>
        ))}
      </List>
    </div>
  )
}

export default User
