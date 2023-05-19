import { createSlice } from '@reduxjs/toolkit'

import userService from '../services/users'

const userSlice = createSlice({
  name: 'users',
  initialState: [],
  reducers: {
    updateUser(state, action) {
      const updatedUser = action.payload
      return state.map((u) => (u.id === updatedUser.id ? updatedUser : u))
    },
    setUsers(state, action) {
      return action.payload
    },
  },
})

export const { setUsers } = userSlice.actions

export const initializeUsers = () => {
  return async (dispatch) => {
    const users = await userService.getAll()
    dispatch(setUsers(users))
  }
}

export default userSlice.reducer
