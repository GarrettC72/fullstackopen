import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import { AppBar, Box, Button, Toolbar } from '@mui/material'
import LogoutIcon from '@mui/icons-material/Logout'

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
        <Button color="inherit" component={Link} to="/">
          blogs
        </Button>
        <Button color="inherit" component={Link} to="/users">
          users
        </Button>
        <Box sx={{ flexGrow: 1 }} />
        <em>{user.name} logged in</em>
        <Button color="inherit" onClick={handleLogout}>
          <LogoutIcon sx={{ paddingRight: 1 }} />
          logout
        </Button>
      </Toolbar>
    </AppBar>
  )
}

export default Navbar
