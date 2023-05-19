import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'

import { logoutUser } from '../reducers/loginReducer'

const Navbar = () => {
  const user = useSelector((state) => state.login)
  const dispatch = useDispatch()

  const navbarStyle = {
    padding: 5,
    background: 'lightgrey',
  }
  const padding = {
    paddingRight: 5,
  }

  return (
    <div style={navbarStyle}>
      <Link style={padding} to="/">
        blogs
      </Link>
      <Link style={padding} to="/users">
        users
      </Link>
      {user.name} logged in
      <button style={{ marginLeft: 5 }} onClick={() => dispatch(logoutUser())}>
        logout
      </button>
    </div>
  )
}

export default Navbar
