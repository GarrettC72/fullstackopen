import { createSlice } from '@reduxjs/toolkit'

import loginService from '../services/login'
import storageService from '../services/storage'
import { setNotification } from './notificationReducer'

const userSlice = createSlice({
  name: 'user',
  initialState: null,
  reducers: {
    setUser(state, action) {
      return action.payload
    },
    clearUser() {
      return null
    },
  },
})

export const { setUser, clearUser } = userSlice.actions

export const loginUser = (username, password) => {
  return async (dispatch) => {
    try {
      const user = await loginService.login({
        username,
        password,
      })

      storageService.saveUser(user)
      dispatch(setUser(user))
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
}

export const logoutUser = () => {
  return async (dispatch) => {
    storageService.removeUser()
    dispatch(clearUser())
    dispatch(setNotification({ message: 'logged out' }, 3))
  }
}

export default userSlice.reducer
