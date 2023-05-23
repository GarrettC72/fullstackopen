import { useDispatch } from 'react-redux'
import { Button, TextField } from '@mui/material'

import { useField } from '../hooks'
import { loginUser } from '../reducers/loginReducer'

const LoginForm = () => {
  const { reset: resetUsername, ...username } = useField('text')
  const { reset: resetPassword, ...password } = useField('password')

  const dispatch = useDispatch()

  const handleLogin = (event) => {
    event.preventDefault()
    dispatch(loginUser(username.value, password.value))

    resetUsername()
    resetPassword()
  }

  return (
    <form onSubmit={handleLogin}>
      <div>
        <TextField
          label="username"
          id="username"
          name="username"
          {...username}
        />
      </div>
      <div>
        <TextField
          label="password"
          id="password"
          name="password"
          {...password}
        />
      </div>
      <Button
        id="login-button"
        variant="contained"
        color="primary"
        type="submit"
      >
        login
      </Button>
    </form>
  )
}

export default LoginForm
