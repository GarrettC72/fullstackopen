import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import BlogForm from './BlogForm'

test('<BlogForm /> updates parent state and calls onSubmit', async () => {
  const user = userEvent.setup()
  const createBlog = jest.fn()

  render(<BlogForm createBlog={createBlog} />)

  const titleInput = screen.getByPlaceholderText('write blog title here')
  const authorInput = screen.getByPlaceholderText('write blog author here')
  const urlInput = screen.getByPlaceholderText('write blog url here')
  const sendButton = screen.getByText('create')

  await user.type(titleInput, 'First class tests')
  await user.type(authorInput, 'Robert C. Martin')
  await user.type(urlInput, 'http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.html')
  await user.click(sendButton)

  expect(createBlog.mock.calls).toHaveLength(1)
  expect(createBlog.mock.calls[0][0].title).toBe('First class tests')
  expect(createBlog.mock.calls[0][0].author).toBe('Robert C. Martin')
  expect(createBlog.mock.calls[0][0].url).toBe('http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.html')
})