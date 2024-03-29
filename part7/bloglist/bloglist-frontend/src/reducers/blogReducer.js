import { createSlice } from '@reduxjs/toolkit'

import { setNotification } from './notificationReducer'
import { appendBlogToUser, removeBlogFromUser } from './userReducer'
import blogService from '../services/blogs'

const blogSlice = createSlice({
  name: 'blogs',
  initialState: [],
  reducers: {
    updateBlog(state, action) {
      const updatedBlog = action.payload
      return state.map((b) => (b.id === updatedBlog.id ? updatedBlog : b))
    },
    appendBlog(state, action) {
      return state.concat(action.payload)
    },
    deleteBlog(state, action) {
      const id = action.payload
      return state.filter((b) => b.id !== id)
    },
    setBlogs(state, action) {
      return action.payload
    },
  },
})

export const { updateBlog, appendBlog, deleteBlog, setBlogs } =
  blogSlice.actions

export const initializeBlogs = () => {
  return async (dispatch) => {
    const blogs = await blogService.getAll()
    dispatch(setBlogs(blogs))
  }
}

export const createBlog = (blog) => {
  return async (dispatch) => {
    try {
      const newBlog = await blogService.create(blog)
      dispatch(appendBlog(newBlog))
      dispatch(appendBlogToUser(newBlog))
      dispatch(
        setNotification(`a new blog ${blog.title} by ${blog.author} added`)
      )
    } catch (exception) {
      dispatch(
        setNotification('failed to add blog - title or url is missing', 'error')
      )
    }
  }
}

export const commentBlog = (blog, comment) => {
  return async (dispatch) => {
    try {
      const updatedBlog = await blogService.comment(blog.id, comment)
      dispatch(updateBlog(updatedBlog))
      dispatch(
        setNotification(
          `new comment on blog ${blog.title} by ${blog.author}: ${comment}`
        )
      )
    } catch (exception) {
      dispatch(
        setNotification(
          `blog ${blog.title} by ${blog.author} has already been removed`,
          'error'
        )
      )
      dispatch(deleteBlog(blog))
    }
  }
}

export const likeBlog = (blog) => {
  const blogToUpdate = {
    ...blog,
    likes: blog.likes + 1,
    user: blog.user.id,
  }
  return async (dispatch) => {
    try {
      const updatedBlog = await blogService.update(blogToUpdate)
      dispatch(updateBlog(updatedBlog))
      dispatch(
        setNotification(`blog ${blog.title} by ${blog.author} was liked`)
      )
    } catch (exception) {
      dispatch(
        setNotification(
          `blog ${blog.title} by ${blog.author} has already been removed`,
          'error'
        )
      )
      dispatch(deleteBlog(blog))
    }
  }
}

export const removeBlog = (blog) => {
  return async (dispatch) => {
    try {
      await blogService.deleteObject(blog.id)
      dispatch(deleteBlog(blog.id))
      dispatch(removeBlogFromUser(blog.id, blog.user.id))
      dispatch(setNotification(`Removed ${blog.title} by ${blog.author}`))
    } catch (exception) {
      if (exception.response.status === 404) {
        dispatch(deleteBlog(blog))
      }
      dispatch(setNotification(exception.response.data.error, 'error'))
    }
  }
}

export default blogSlice.reducer
