import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Routes, Route } from 'react-router-dom'
import { Container } from '@mui/material'

import Notification from './components/Notification'
import LoginForm from './components/LoginForm'
import BlogList from './components/BlogList'
import UserList from './components/UserList'
import User from './components/User'
import Blog from './components/Blog'
import Navbar from './components/Navbar'

import { initializeBlogs } from './reducers/blogReducer'
import { initializeLogin } from './reducers/loginReducer'
import { initializeUsers } from './reducers/userReducer'

const App = () => {
  const user = useSelector((state) => state.login)

  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(initializeBlogs())
    dispatch(initializeUsers())
  }, [])

  useEffect(() => {
    dispatch(initializeLogin())
  }, [])

  if (user === null) {
    return (
      <Container maxWidth="xl">
        <h2 className="login-heading">Log in to application</h2>
        <Notification />
        <LoginForm />
      </Container>
    )
  }

  return (
    <Container maxWidth="xl">
      <Navbar />
      <h1>Blog App</h1>
      <Notification />
      <Routes>
        <Route path="/" element={<BlogList />} />
        <Route path="/users" element={<UserList />} />
        <Route path="/users/:id" element={<User />} />
        <Route path="/blogs/:id" element={<Blog />} />
      </Routes>
    </Container>
  )
}

export default App
