import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import Notification from './components/Notification'
import LoginForm from './components/LoginForm'
import BlogForm from './components/BlogForm'
import Toggleable from './components/Toggleable'

import blogService from './services/blogs'
import loginService from './services/login'

import { setNotification } from './reducers/notificationReducer'
import { useDispatch } from 'react-redux'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [user, setUser] = useState(null)

  const dispatch = useDispatch()

  useEffect(() => {
    blogService.getAll().then((blogs) => setBlogs(blogs))
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON) || null
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const blogFormRef = useRef()

  const handleLogin = async (username, password) => {
    try {
      const user = await loginService.login({
        username,
        password,
      })

      window.localStorage.setItem('loggedBlogappUser', JSON.stringify(user))
      blogService.setToken(user.token)
      setUser(user)
      dispatch(setNotification({ message: `Logged in as ${user.name}` }, 3))
    } catch (exception) {
      dispatch(
        setNotification(
          { message: 'wrong username or password', type: 'error' },
          3
        )
      )
    }
  }

  const handleLogout = () => {
    window.localStorage.removeItem('loggedBlogappUser')
    setUser(null)
    dispatch(setNotification({ message: 'logged out' }, 3))
  }

  const addBlog = async (blogObject) => {
    try {
      const returnedBlog = await blogService.create(blogObject)

      setBlogs(blogs.concat(returnedBlog))
      blogFormRef.current.toggleVisibility()
      dispatch(
        setNotification(
          {
            message: `a new blog ${blogObject.title} by ${blogObject.author} added`,
          },
          3
        )
      )
    } catch (exception) {
      dispatch(
        setNotification(
          {
            message: 'failed to add blog - title or url is missing',
            type: 'error',
          },
          3
        )
      )
    }
  }

  const likeBlog = async (blogObject) => {
    try {
      const blogUpdate = {
        ...blogObject,
        likes: blogObject.likes + 1,
        user: blogObject.user.id,
      }
      const updatedBlog = await blogService.update(blogUpdate)

      setBlogs(
        blogs.map((blog) => (blog.id !== blogObject.id ? blog : updatedBlog))
      )
      dispatch(
        setNotification(
          {
            message: `blog ${blogObject.title} by ${blogObject.author} was liked`,
          },
          3
        )
      )
    } catch (exception) {
      dispatch(
        setNotification(
          {
            message: `blog ${blogObject.title} by ${blogObject.author} has already been removed`,
            type: 'error',
          },
          3
        )
      )
    }
  }

  const deleteBlog = async (blog) => {
    if (window.confirm(`Remove blog ${blog.title} by ${blog.author}`)) {
      try {
        await blogService.deleteObject(blog.id)

        setBlogs(blogs.filter((b) => b.id !== blog.id))
        dispatch(
          setNotification(
            { message: `Removed ${blog.title} by ${blog.author}` },
            3
          )
        )
      } catch (exception) {
        dispatch(
          setNotification(
            { message: exception.response.data.error, type: 'error' },
            3
          )
        )
      }
    }
  }

  if (user === null) {
    return (
      <div>
        <h2>log in to application</h2>
        <Notification />
        <LoginForm createLogin={handleLogin} />
      </div>
    )
  }

  const sortedBlogs = blogs.sort((a, b) => b.likes - a.likes)

  return (
    <div>
      <h2>blogs</h2>
      <Notification />

      <p>
        {user.name} logged in<button onClick={handleLogout}>logout</button>
      </p>
      <Toggleable buttonLabel="create new blog" ref={blogFormRef}>
        <BlogForm createBlog={addBlog} />
      </Toggleable>
      {sortedBlogs.map((blog) => (
        <Blog
          key={blog.id}
          likeBlog={() => likeBlog(blog)}
          deleteBlog={() => deleteBlog(blog)}
          blog={blog}
          canRemove={user && blog.user.username === user.username}
        />
      ))}
    </div>
  )
}

export default App
