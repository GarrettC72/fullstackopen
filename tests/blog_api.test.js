const mongoose = require('mongoose')
const supertest = require('supertest')
const bcrypt = require('bcryptjs')
const app = require('../app')

const api = supertest(app)

const Blog = require('../models/blog')
const User = require('../models/user')
const helper = require('./blog_test_helper')

beforeEach(async () => {
  await Blog.deleteMany({})
  await Blog.insertMany(helper.initialBlogs)
})

describe('when there is initially some blogs saved', () => {
  test('all blogs are returned as json', async () => {
    const response = await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)

    // console.log(response.body)
    expect(response.body).toHaveLength(helper.initialBlogs.length)
  })

  test('all blogs have a property named \'id\'', async () => {
    const response = await api.get('/api/blogs')

    response.body.forEach((blog) => expect(blog.id).toBeDefined())
  })

  describe('addition of a new blog', () => {
    test('succeeds with valid data', async () => {
      const newBlog = {
        title: 'Dijkstra\'s Algorithm',
        author: 'Robert C. Martin',
        url: 'http://blog.cleancoder.com/uncle-bob/2016/10/26/DijkstrasAlg.html',
        likes: 6,
      }

      await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)

      const blogsAtEnd = await helper.blogsInDb()

      expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1)

      const titles = blogsAtEnd.map(blog => blog.title)
      const urls = blogsAtEnd.map(blog => blog.url)

      expect(titles).toContain(
        'Dijkstra\'s Algorithm'
      )
      expect(urls).toContain(
        'http://blog.cleancoder.com/uncle-bob/2016/10/26/DijkstrasAlg.html'
      )
    })

    test('with missing likes data will default to zero likes', async () => {
      const blogWithoutLikes = {
        title: 'Integers and Estimates',
        author: 'Robert C. Martin',
        url: 'http://blog.cleancoder.com/uncle-bob/2018/06/21/IntegersAndEstimates.html',
      }

      const response = await api
        .post('/api/blogs')
        .send(blogWithoutLikes)
        .expect(201)
        .expect('Content-Type', /application\/json/)

      const savedBlog = response.body

      expect(savedBlog.likes).toBeDefined()
      expect(savedBlog.likes).toBe(0)
    })

    test('will fail with status code 400 if title is missing', async () => {
      const blogWithoutTitle = {
        author: 'Robert C. Martin',
        url: 'http://blog.cleancoder.com/uncle-bob/2018/06/21/IntegersAndEstimates.html',
        likes: 8
      }

      await api
        .post('/api/blogs')
        .send(blogWithoutTitle)
        .expect(400)

      const blogsAtEnd = await helper.blogsInDb()
      expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length)
    })

    test('will fail with status code 400 if url is missing', async () => {
      const blogWithoutUrl = {
        title: 'Integers and Estimates',
        author: 'Robert C. Martin',
        likes: 8
      }

      await api
        .post('/api/blogs')
        .send(blogWithoutUrl)
        .expect(400)

      const blogsAtEnd = await helper.blogsInDb()
      expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length)
    })
  })

  describe('deletion of a blog', () => {
    test('succeeds with status code 204 if id is valid', async () => {
      const blogsAtStart = await helper.blogsInDb()
      const blogToDelete = blogsAtStart[0]

      await api
        .delete(`/api/blogs/${blogToDelete.id}`)
        .expect(204)

      const notesAtEnd = await helper.blogsInDb()
      expect(notesAtEnd).toHaveLength(
        helper.initialBlogs.length - 1
      )
    })

    test('with a nonexistant id to have status code 204 and have no effect', async () => {
      const nonExistingId = await helper.nonExistingId()

      await api
        .delete(`/api/blogs/${nonExistingId}`)
        .expect(204)

      const notesAtEnd = await helper.blogsInDb()
      expect(notesAtEnd).toHaveLength(
        helper.initialBlogs.length
      )
    })

    test('fails with status code 400 if id is invalid', async () => {
      const invalidId = '63cf6713c13ffbd98c31463'

      await api
        .delete(`/api/blogs/${invalidId}`)
        .expect(400)

      const notesAtEnd = await helper.blogsInDb()
      expect(notesAtEnd).toHaveLength(
        helper.initialBlogs.length
      )
    })
  })

  describe('updating a blog', () => {
    test('succeeds with status code 200 if id is valid', async () => {
      const blogsAtStart = await helper.blogsInDb()
      const blogToUpdate = blogsAtStart[0]
      const blogUpdate = {
        title: 'Space War',
        author: 'Robert C. Martin',
        url: 'http://blog.cleancoder.com/uncle-bob/2021/11/28/Spacewar.html',
        likes: blogToUpdate.likes + 11
      }

      const updatedBlog = await api
        .put(`/api/blogs/${blogToUpdate.id}`)
        .send(blogUpdate)
        .expect(200)
        .expect('Content-Type', /application\/json/)

      expect(updatedBlog.body).toEqual({
        title: 'Space War',
        author: 'Robert C. Martin',
        url: 'http://blog.cleancoder.com/uncle-bob/2021/11/28/Spacewar.html',
        likes: blogToUpdate.likes + 11,
        id: blogToUpdate.id
      })
      expect(updatedBlog.body).not.toEqual({
        title: blogToUpdate.title,
        author: blogToUpdate.author,
        url: blogToUpdate.url,
        likes: blogToUpdate.likes,
        id: blogToUpdate.id
      })
    })

    test('with a nonexistant id to have status code 200 and have no effect', async () => {
      const blogsAtStart = await helper.blogsInDb()
      const nonExistingId = await helper.nonExistingId()

      const blogUpdate = {
        title: 'Space War',
        author: 'Robert C. Martin',
        url: 'http://blog.cleancoder.com/uncle-bob/2021/11/28/Spacewar.html',
        likes: 11
      }

      await api
        .put(`/api/blogs/${nonExistingId}`)
        .send(blogUpdate)
        .expect(200)

      const blogsAtEnd = await helper.blogsInDb()
      expect(blogsAtEnd).toEqual(blogsAtStart)
    })

    test('will fail with status code 400 if id is invalid', async () => {
      const invalidId = '63cf6713c13ffbd98c31463'

      const blogsAtStart = await helper.blogsInDb()
      const blogUpdate = {
        title: 'Space War',
        author: 'Robert C. Martin',
        url: 'http://blog.cleancoder.com/uncle-bob/2021/11/28/Spacewar.html',
        likes: 11
      }

      await api
        .put(`/api/blogs/${invalidId}`)
        .send(blogUpdate)
        .expect(400)

      const blogsAtEnd = await helper.blogsInDb()
      expect(blogsAtEnd).toEqual(blogsAtStart)
    })
  })
})

describe('when there is initially one user in db', () => {
  beforeEach(async () => {
    await User.deleteMany({})

    const passwordHash = await bcrypt.hash('secret', 10)
    const user = new User({ username: 'root', passwordHash })

    await user.save()
  })

  test('creation succeeds with a fresh username', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'garrchen',
      name: 'Garrett Chen',
      password: 'salainen'
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toHaveLength(usersAtStart.length + 1)

    const usernames = usersAtEnd.map(u => u.username)
    expect(usernames).toContain(newUser.username)
  })
})

afterAll(() => {
  mongoose.connection.close()
})