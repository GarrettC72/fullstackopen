import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'

describe('<Blog />', () => {
  beforeEach(() => {
    const blog = {
      title: 'First class tests',
      author: 'Robert C. Martin',
      url: 'http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.html',
      likes: 15,
      user: {
        name: 'Garrett Chen',
        username: 'garrchen'
      }
    }

    const user = {
      username: 'garrchen'
    }

    render(<Blog blog={blog} user={user} />)
  })

  test('initially renders title and author, but not url and likes', () => {
    const element = screen.getByText('First class tests Robert C. Martin')
    expect(element).toBeDefined()

    const urlElement = screen.queryByText('http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.html')
    expect(urlElement).toBeNull()

    const likeElement = screen.queryByText('15', { exact: false })
    expect(likeElement).toBeNull()
  })

  test('renders url and likes after clicking view button', async () => {
    const user = userEvent.setup()

    const button = screen.getByText('view')
    await user.click(button)

    const urlElement = screen.getByText('http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.html')
    expect(urlElement).toBeDefined()

    const likeElement = screen.getByText('likes 15')
    expect(likeElement).toBeDefined()
  })
})