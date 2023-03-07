import { useState } from 'react'
import Notification from './Notification'
import PropTypes from 'prop-types'

const LoginForm = ({ createLogin, info }) => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const handleLogin = (event) => {
    event.preventDefault()
    createLogin(username, password)

    setUsername('')
    setPassword('')
  }

  return (
    <div>
      <h2>log in to application</h2>
      <Notification info={info} />

      <form onSubmit={handleLogin}>
        <div>
          username
          <input
            type="text"
            value={username}
            name="Username"
            onChange={({ target }) => setUsername(target.value)}
          />
        </div>
        <div>
          password
          <input
            type="password"
            value={password}
            name="Password"
            onChange={({ target }) => setPassword(target.value)}
          />
        </div>
        <button type="submit">login</button>
      </form>
    </div>
  )
}

LoginForm.propTypes = {
  createLogin: PropTypes.func.isRequired,
  info: PropTypes.object.isRequired
}

export default LoginForm