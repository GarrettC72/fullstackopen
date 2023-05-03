import { createSlice } from '@reduxjs/toolkit'

import blogService from '../services/blogs'
import { setNotification } from './notificationReducer'

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
      const blog = action.payload
      return state.filter((b) => b.id !== blog.id)
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
      dispatch(
        setNotification(
          { message: `a new blog ${blog.title} by ${blog.author} added` },
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
}

export const likeBlog = (blog) => {
  return async (dispatch) => {
    try {
      const blogToUpdate = {
        ...blog,
        likes: blog.likes + 1,
        user: blog.user.id,
      }
      const updatedBlog = await blogService.update(blogToUpdate)
      dispatch(updateBlog(updatedBlog))
      dispatch(
        setNotification(
          { message: `blog ${blog.title} by ${blog.author} was liked` },
          3
        )
      )
    } catch (exception) {
      dispatch(
        setNotification(
          {
            message: `blog ${blog.title} by ${blog.author} has already been removed`,
            type: 'error',
          },
          3
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
      dispatch(deleteBlog(blog))
      dispatch(
        setNotification(
          { message: `Removed ${blog.title} by ${blog.author}` },
          3
        )
      )
    } catch (exception) {
      if (exception.response.status === 404) {
        dispatch(deleteBlog(blog))
      }
      dispatch(
        setNotification(
          { message: exception.response.data.error, type: 'error' },
          3
        )
      )
    }
  }
}

export default blogSlice.reducer
