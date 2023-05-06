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

export const setNotification = (message, type) => {
  return async (dispatch) => {
    dispatch(display({ message, type }))
    setTimeout(() => {
      dispatch(clear())
    }, 3000)
  }
}

export default notificationSlice.reducer
