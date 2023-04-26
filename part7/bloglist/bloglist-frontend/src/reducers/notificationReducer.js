import { createSlice } from '@reduxjs/toolkit'

const notificationSlice = createSlice({
  name: 'notification',
  initialState: { message: null },
  reducers: {
    display(state, action) {
      return action.payload
    },
    clear() {
      return { message: null }
    },
  },
})

export const { display, clear } = notificationSlice.actions

export const setNotification = (notification, seconds) => {
  return async (dispatch) => {
    dispatch(display(notification))
    setTimeout(() => {
      dispatch(clear())
    }, 1000 * seconds)
  }
}

export default notificationSlice.reducer
