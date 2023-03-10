import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'

describe('<Blog />', () => {
  test('initially renders title and author, but not url and likes', () => {
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

    render(<Blog blog={blog} />)

    const element = screen.getByText('First class tests Robert C. Martin')
    expect(element).toBeDefined()

    const urlElement = screen.queryByText('http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.html')
    expect(urlElement).toBeNull()

    const likeElement = screen.queryByText('15', { exact: false })
    expect(likeElement).toBeNull()
  })

  test('renders url and likes after clicking view button', async () => {
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

    const initialUser = {
      username: 'garrchen'
    }

    render(<Blog blog={blog} user={initialUser} />)

    const user = userEvent.setup()

    const viewButton = screen.getByText('view')
    await user.click(viewButton)

    const urlElement = screen.getByText('http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.html')
    expect(urlElement).toBeDefined()

    const likeElement = screen.getByText('likes 15')
    expect(likeElement).toBeDefined()
  })

  test('clicking the like button twice calls the event handler twice', async () => {
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

    const initialUser = {
      username: 'garrchen'
    }

    const mockHandler = jest.fn()

    render(<Blog blog={blog} user={initialUser} updateBlog={mockHandler} />)

    const user = userEvent.setup()

    const viewButton = screen.getByText('view')
    await user.click(viewButton)

    const likeButton = screen.getByText('like')
    await user.click(likeButton)
    await user.click(likeButton)

    expect(mockHandler.mock.calls).toHaveLength(2)
  })
})