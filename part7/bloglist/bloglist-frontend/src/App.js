import { useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Routes, Route /*Link*/ } from 'react-router-dom'

import Notification from './components/Notification'
import LoginForm from './components/LoginForm'
import BlogForm from './components/BlogForm'
import Toggleable from './components/Toggleable'
import BlogList from './components/BlogList'
import UserList from './components/UserList'

import { initializeBlogs } from './reducers/blogReducer'
import { initializeLogin, logoutUser } from './reducers/loginReducer'
import { initializeUsers } from './reducers/userReducer'

const App = () => {
  const user = useSelector((state) => state.login)

  const dispatch = useDispatch()

  const blogFormRef = useRef()

  useEffect(() => {
    dispatch(initializeBlogs())
    dispatch(initializeUsers())
  }, [])

  useEffect(() => {
    dispatch(initializeLogin())
  }, [])

  if (user === null) {
    return (
      <div>
        <h2>log in to application</h2>
        <Notification />
        <LoginForm />
      </div>
    )
  }

  return (
    <div>
      <h2>blogs</h2>
      <Notification />
      <p>
        {user.name} logged in
        <button onClick={() => dispatch(logoutUser())}>logout</button>
      </p>
      <Routes>
        <Route
          path="/"
          element={
            <>
              <Toggleable buttonLabel="create new blog" ref={blogFormRef}>
                <BlogForm
                  hideBlogForm={() => blogFormRef.current.toggleVisibility()}
                />
              </Toggleable>
              <BlogList />
            </>
          }
        />
        <Route path="/users" element={<UserList />} />
      </Routes>
      {/* <Toggleable buttonLabel="create new blog" ref={blogFormRef}>
        <BlogForm hideBlogForm={() => blogFormRef.current.toggleVisibility()} />
      </Toggleable>
      <BlogList /> */}
    </div>
  )
}

export default App
