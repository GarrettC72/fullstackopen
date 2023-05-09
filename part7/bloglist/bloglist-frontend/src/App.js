import { useState, useEffect, useRef } from 'react'
import { useQuery } from 'react-query'

import Blog from './components/Blog'
import Notification from './components/Notification'
import LoginForm from './components/LoginForm'
import BlogForm from './components/BlogForm'
import Toggleable from './components/Toggleable'

import blogService from './services/blogs'
import loginService from './services/login'
import storageService from './services/storage'

import { useNotify } from './NotificationContext'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [user, setUser] = useState(null)

  const result = useQuery('blogs', blogService.getAll, {
    retry: 1,
    refetchOnWindowFocus: false,
  })

  const notifyWith = useNotify()

  const blogFormRef = useRef()

  useEffect(() => {
    blogService.getAll().then((blogs) => setBlogs(blogs))
  }, [])

  useEffect(() => {
    const user = storageService.loadUser()
    setUser(user)
  }, [])

  const handleLogin = async (username, password) => {
    try {
      const user = await loginService.login({
        username,
        password,
      })

      storageService.saveUser(user)
      setUser(user)
      notifyWith(`Logged in as ${user.name}`)
    } catch (exception) {
      notifyWith('wrong username or password', 'error')
    }
  }

  const handleLogout = async () => {
    storageService.removeUser()
    setUser(null)
    notifyWith('logged out')
  }

  const likeBlog = async (blog) => {
    try {
      const blogUpdate = { ...blog, likes: blog.likes + 1, user: blog.user.id }
      const updatedBlog = await blogService.update(blogUpdate)

      setBlogs(blogs.map((b) => (b.id === blog.id ? updatedBlog : b)))
      notifyWith(`blog ${blog.title} by ${blog.author} was liked`)
    } catch (exception) {
      notifyWith(
        `blog ${blog.title} by ${blog.author} has already been removed`,
        'error'
      )
    }
  }

  const deleteBlog = async (blog) => {
    if (window.confirm(`Remove blog ${blog.title} by ${blog.author}`)) {
      try {
        await blogService.deleteObject(blog.id)

        setBlogs(blogs.filter((b) => b.id !== blog.id))
        notifyWith(`Removed ${blog.title} by ${blog.author}`)
      } catch (exception) {
        notifyWith(exception.response.data.error, 'error')
      }
    }
  }

  if (result.isLoading) {
    return <div>loading data...</div>
  }

  if (result.isError) {
    return <div>blog service not available due to problems in server</div>
  }

  const sortedBlogs = result.data.sort((a, b) => b.likes - a.likes)

  if (user === null) {
    return (
      <div>
        <h2>log in to application</h2>
        <Notification />
        <LoginForm createLogin={handleLogin} />
      </div>
    )
  }

  return (
    <div>
      <h2>blogs</h2>
      <Notification />
      <p>
        {user.name} logged in<button onClick={handleLogout}>logout</button>
      </p>
      <Toggleable buttonLabel="create new blog" ref={blogFormRef}>
        <BlogForm hideBlogForm={() => blogFormRef.current.toggleVisibility()} />
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
