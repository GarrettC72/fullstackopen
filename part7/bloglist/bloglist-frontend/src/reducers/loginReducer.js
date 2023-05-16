import { createSlice } from '@reduxjs/toolkit'

import { setNotification } from './notificationReducer'
import loginService from '../services/login'
import storageService from '../services/storage'

const loginSlice = createSlice({
  name: 'login',
  initialState: null,
  reducers: {
    setLogin(state, action) {
      return action.payload
    },
    clearLogin() {
      return null
    },
  },
})

export const { setLogin, clearLogin } = loginSlice.actions

export const initializeLogin = () => {
  return async (dispatch) => {
    const user = storageService.loadUser()
    dispatch(setLogin(user))
  }
}

export const loginUser = (username, password) => {
  return async (dispatch) => {
    try {
      const user = await loginService.login({
        username,
        password,
      })

      storageService.saveUser(user)
      dispatch(setLogin(user))
      dispatch(setNotification(`Logged in as ${user.name}`))
    } catch (exception) {
      dispatch(setNotification('wrong username or password', 'error'))
    }
  }
}

export const logoutUser = () => {
  return async (dispatch) => {
    storageService.removeUser()
    dispatch(clearLogin())
    dispatch(setNotification('logged out'))
  }
}

export default loginSlice.reducer
