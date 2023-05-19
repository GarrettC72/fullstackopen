import { createSlice } from '@reduxjs/toolkit'

import userService from '../services/users'

const userSlice = createSlice({
  name: 'users',
  initialState: [],
  reducers: {
    appendBlogToUser(state, action) {
      const { user: blogCreator, ...blog } = action.payload
      const toAdd = state.find((u) => u.id === blogCreator.id)
      const added = { ...toAdd, blogs: toAdd.blogs.concat(blog) }
      return state.map((u) => (u.id === blogCreator.id ? added : u))
    },
    deleteBlogFromUser(state, action) {
      const { blogId, userId } = action.payload
      const toRemove = state.find((u) => u.id === userId)
      const removed = {
        ...toRemove,
        blogs: toRemove.blogs.filter((b) => b.id !== blogId),
      }
      return state.map((u) => (u.id === userId ? removed : u))
    },
    setUsers(state, action) {
      return action.payload
    },
  },
})

export const { appendBlogToUser, deleteBlogFromUser, setUsers } =
  userSlice.actions

export const initializeUsers = () => {
  return async (dispatch) => {
    const users = await userService.getAll()
    dispatch(setUsers(users))
  }
}

export const removeBlogFromUser = (blogId, userId) => {
  return async (dispatch) => {
    dispatch(deleteBlogFromUser({ blogId, userId }))
  }
}

export default userSlice.reducer
