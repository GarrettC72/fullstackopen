import { useState, useEffect, useRef } from 'react'
import { useMutation, useQuery, useQueryClient } from 'react-query'

import { useNotify } from './NotificationContext'

import Blog from './components/Blog'
import Notification from './components/Notification'
import LoginForm from './components/LoginForm'
import BlogForm from './components/BlogForm'
import Toggleable from './components/Toggleable'

import blogService from './services/blogs'
import loginService from './services/login'
import storageService from './services/storage'

const App = () => {
  const [user, setUser] = useState(null)

  const result = useQuery('blogs', blogService.getAll, {
    retry: 1,
    refetchOnWindowFocus: false,
  })

  const queryClient = useQueryClient()
  const notifyWith = useNotify()

  const blogFormRef = useRef()

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

  const likeMutation = useMutation(blogService.update, {
    onSuccess: (updatedBlog) => {
      const blogs = queryClient.getQueryData('blogs')
      queryClient.setQueryData(
        'blogs',
        blogs.map((b) => (b.id === updatedBlog.id ? updatedBlog : b))
      )
      notifyWith(`blog ${updatedBlog.title} by ${updatedBlog.author} was liked`)
    },
    onError: (error) => {
      queryClient.invalidateQueries('blogs')
      notifyWith(error.response.data.error, 'error')
    },
  })

  const handleLike = (blog) => {
    const likedBlog = { ...blog, likes: blog.likes + 1, user: blog.user.id }
    likeMutation.mutate(likedBlog)
  }

  const deleteMutation = useMutation(blogService.deleteObject, {
    onSuccess: () => {
      queryClient.invalidateQueries('blogs')
      notifyWith('Blog successfully removed')
    },
    onError: (error) => {
      if (error.response.status === 404) {
        queryClient.invalidateQueries('blogs')
      }
      notifyWith(error.response.data.error, 'error')
    },
  })

  const handleDelete = (blog) => {
    if (window.confirm(`Remove blog ${blog.title} by ${blog.author}`)) {
      deleteMutation.mutate(blog.id)
    }
  }

  if (result.isLoading) {
    return <div>loading data...</div>
  }

  if (result.isError) {
    return <div>blog service not available due to problems in server</div>
  }

  const blogs = result.data.sort((a, b) => b.likes - a.likes)

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
      {blogs.map((blog) => (
        <Blog
          key={blog.id}
          likeBlog={() => handleLike(blog)}
          deleteBlog={() => handleDelete(blog)}
          blog={blog}
          canRemove={user && blog.user.username === user.username}
        />
      ))}
    </div>
  )
}

export default App
