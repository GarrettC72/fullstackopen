import PropTypes from 'prop-types'

import { useField } from '../hooks'

const LoginForm = ({ createLogin }) => {
  const { reset: resetUsername, ...username } = useField('text')
  const { reset: resetPassword, ...password } = useField('password')

  const handleLogin = async (event) => {
    event.preventDefault()
    await createLogin(username.value, password.value)

    resetUsername()
    resetPassword()
  }

  return (
    <form onSubmit={handleLogin}>
      <div>
        username
        <input id="username" name="username" {...username} />
      </div>
      <div>
        password
        <input id="password" name="password" {...password} />
      </div>
      <button id="login-button" type="submit">
        login
      </button>
    </form>
  )
}

LoginForm.propTypes = {
  createLogin: PropTypes.func.isRequired,
}

export default LoginForm
