import { createSlice } from "@reduxjs/toolkit";

const notificationSlice = createSlice({
  name: 'notification',
  initialState: null,
  reducers: {
    displayNotification(state, action) {
      return action.payload
    },
    clearNotification(state, action) {
      return null
    }
  },
})

export const { displayNotification, clearNotification } = notificationSlice.actions

export const setNotification = (notification, seconds) => {
  return async dispatch => {
    dispatch(displayNotification(notification))
    setTimeout(() => {
      dispatch(clearNotification())
    }, 1000 * seconds)
  }
}

export default notificationSlice.reducer