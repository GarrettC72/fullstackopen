import { useRef } from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
} from '@mui/material'

import Toggleable from './Toggleable'
import BlogForm from './BlogForm'
import StyledTableRow from './StyledTableRow'

const BlogList = () => {
  const blogs = useSelector(({ blogs }) => {
    return blogs.slice().sort((a, b) => b.likes - a.likes)
  })

  const blogFormRef = useRef()

  return (
    <div>
      <Toggleable buttonLabel="create new blog" ref={blogFormRef}>
        <BlogForm hideBlogForm={() => blogFormRef.current.toggleVisibility()} />
      </Toggleable>
      <h2>Blogs</h2>
      <TableContainer component={Paper}>
        <Table>
          <TableBody>
            {blogs.map((blog) => (
              <StyledTableRow key={blog.id}>
                <TableCell>
                  <Link to={`/blogs/${blog.id}`}>
                    {blog.title} {blog.author}
                  </Link>
                </TableCell>
                <TableCell>{blog.user.name}</TableCell>
              </StyledTableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  )
}

export default BlogList
