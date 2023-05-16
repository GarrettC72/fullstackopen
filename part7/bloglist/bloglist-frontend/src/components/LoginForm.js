import { useField } from '../hooks'
import { useLogin } from '../LoginContext'

const LoginForm = () => {
  const { reset: resetUsername, ...username } = useField('text')
  const { reset: resetPassword, ...password } = useField('password')

  const loginUser = useLogin()

  const handleLogin = async (event) => {
    event.preventDefault()
    await loginUser(username.value, password.value)

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

export default LoginForm
