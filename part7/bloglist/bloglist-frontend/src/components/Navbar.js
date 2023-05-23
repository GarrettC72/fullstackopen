import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import { AppBar, Button, IconButton, Toolbar } from '@mui/material'

import { logoutUser } from '../reducers/loginReducer'

const Navbar = () => {
  const user = useSelector((state) => state.login)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const handleLogout = () => {
    dispatch(logoutUser())
    navigate('/')
  }

  return (
    <AppBar position="static">
      <Toolbar>
        <IconButton edge="start" color="inherit" aria-label="menu"></IconButton>
        <Button color="inherit" component={Link} to="/">
          blogs
        </Button>
        <Button color="inherit" component={Link} to="/users">
          users
        </Button>
        <em>{user.name} logged in</em>
        <Button color="inherit" onClick={handleLogout}>
          logout
        </Button>
      </Toolbar>
    </AppBar>
  )
}

export default Navbar
