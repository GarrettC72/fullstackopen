import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, screen } from '@testing-library/react'
import Blog from './Blog'

describe('<Blog />', () => {
  test('renders title and author, but not url and likes', () => {
    const blog = {
      title: 'First class tests',
      author: 'Robert C. Martin',
      url: 'http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.html',
      likes: 15,
      user: {
        name: 'Garrett Chen'
      }
    }

    render(<Blog blog={blog} />)

    const titleElement = screen.queryByText('First class tests', { exact: false })
    expect(titleElement).toBeDefined()

    const AuthorElement = screen.queryByText('Robert C. Martin', { exact: false })
    expect(AuthorElement).toBeDefined()

    const urlElement = screen.queryByText('http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.html')
    expect(urlElement).toBeNull()

    const likeElement = screen.queryByText('15', { exact: false })
    expect(likeElement).toBeNull()
  })
})