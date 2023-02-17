const mongoose = require('mongoose')
const supertest = require('supertest')
const bcrypt = require('bcryptjs')
const app = require('../app')

const api = supertest(app)

const Blog = require('../models/blog')
const User = require('../models/user')
const helper = require('./blog_test_helper')

describe('when there is initially some blogs saved', () => {
  beforeEach(async () => {
    await Blog.deleteMany({})
    await User.deleteMany({})

    const passwordHash = await bcrypt.hash('secret', 10)
    const user = new User({ username: 'initialUser', passwordHash })

    const savedUser = await user.save()
    const initialUserBlogs = helper.initialBlogs.map(blog => ({ ...blog, user: savedUser._id }))
    await Blog.insertMany(initialUserBlogs)
  })

  test('all blogs are returned as json', async () => {
    const response = await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)

    expect(response.body).toHaveLength(helper.initialBlogs.length)
  })

  test('all blogs have a property named \'id\'', async () => {
    const response = await api.get('/api/blogs')

    response.body.forEach((blog) => expect(blog.id).toBeDefined())
  })

  describe('addition of a new blog', () => {
    test('succeeds with valid data', async () => {
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

      const loginResponse = await api
        .post('/api/login')
        .send({ username: 'garrchen', password: 'salainen' })
        .expect(200)
        .expect('Content-Type', /application\/json/)

      const user = loginResponse.body
      const userDoc = await User.findOne({ username: user.username })

      const newBlog = {
        title: 'Dijkstra\'s Algorithm',
        author: 'Robert C. Martin',
        url: 'http://blog.cleancoder.com/uncle-bob/2016/10/26/DijkstrasAlg.html',
        likes: 6,
      }

      await api
        .post('/api/blogs')
        .send(newBlog)
        .set('Authorization', `Bearer ${user.token}`)
        .expect(201)
        .expect('Content-Type', /application\/json/)

      const blogsAtEnd = await helper.blogsInDb()

      expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1)

      const titles = blogsAtEnd.map(blog => blog.title)
      const urls = blogsAtEnd.map(blog => blog.url)
      const users = blogsAtEnd.map(blog => blog.user)

      expect(titles).toContain(
        'Dijkstra\'s Algorithm'
      )
      expect(urls).toContain(
        'http://blog.cleancoder.com/uncle-bob/2016/10/26/DijkstrasAlg.html'
      )
      expect(users).toContainEqual(
        userDoc._id
      )
    })

    test('with missing likes data will default to zero likes', async () => {
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

      const loginResponse = await api
        .post('/api/login')
        .send({ username: 'garrchen', password: 'salainen' })
        .expect(200)
        .expect('Content-Type', /application\/json/)

      const user = loginResponse.body
      const userDoc = await User.findOne({ username: user.username })

      const blogWithoutLikes = {
        title: 'Integers and Estimates',
        author: 'Robert C. Martin',
        url: 'http://blog.cleancoder.com/uncle-bob/2018/06/21/IntegersAndEstimates.html',
      }

      const response = await api
        .post('/api/blogs')
        .send(blogWithoutLikes)
        .set('Authorization', `Bearer ${user.token}`)
        .expect(201)
        .expect('Content-Type', /application\/json/)

      const blogsAtEnd = await helper.blogsInDb()

      expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1)

      const titles = blogsAtEnd.map(blog => blog.title)
      const urls = blogsAtEnd.map(blog => blog.url)
      const users = blogsAtEnd.map(blog => blog.user)

      expect(titles).toContain(
        'Integers and Estimates'
      )
      expect(urls).toContain(
        'http://blog.cleancoder.com/uncle-bob/2018/06/21/IntegersAndEstimates.html'
      )
      expect(users).toContainEqual(
        userDoc._id
      )

      const savedBlog = response.body

      expect(savedBlog.likes).toBeDefined()
      expect(savedBlog.likes).toBe(0)
    })

    test('will fail with status code 400 if title is missing', async () => {
      const loginResponse = await api
        .post('/api/login')
        .send({ username: 'initialUser', password: 'secret' })
        .expect(200)
        .expect('Content-Type', /application\/json/)

      const user = loginResponse.body

      const blogWithoutTitle = {
        author: 'Robert C. Martin',
        url: 'http://blog.cleancoder.com/uncle-bob/2018/06/21/IntegersAndEstimates.html',
        likes: 8
      }

      const result = await api
        .post('/api/blogs')
        .send(blogWithoutTitle)
        .set('Authorization', `Bearer ${user.token}`)
        .expect(400)

      expect(result.body.error).toContain('Path `title` is required')

      const blogsAtEnd = await helper.blogsInDb()
      expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length)
    })

    test('will fail with status code 400 if url is missing', async () => {
      const loginResponse = await api
        .post('/api/login')
        .send({ username: 'initialUser', password: 'secret' })
        .expect(200)
        .expect('Content-Type', /application\/json/)

      const user = loginResponse.body

      const blogWithoutUrl = {
        title: 'Integers and Estimates',
        author: 'Robert C. Martin',
        likes: 8
      }

      const result = await api
        .post('/api/blogs')
        .send(blogWithoutUrl)
        .set('Authorization', `Bearer ${user.token}`)
        .expect(400)

      expect(result.body.error).toContain('Path `url` is required')

      const blogsAtEnd = await helper.blogsInDb()
      expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length)
    })

    test('will fail with status code 401 if token is not provided', async () => {
      const newBlog = {
        title: 'Dijkstra\'s Algorithm',
        author: 'Robert C. Martin',
        url: 'http://blog.cleancoder.com/uncle-bob/2016/10/26/DijkstrasAlg.html',
        likes: 6,
      }

      const result = await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(401)

      expect(result.body.error).toContain('token missing or invalid')

      const blogsAtEnd = await helper.blogsInDb()
      expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length)
    })
  })

  describe('deletion of a blog', () => {
    test('succeeds with status code 204 if id is valid', async () => {
      const loginResponse = await api
        .post('/api/login')
        .send({ username: 'initialUser', password: 'secret' })
        .expect(200)
        .expect('Content-Type', /application\/json/)

      const user = loginResponse.body

      const blogsAtStart = await helper.blogsInDb()
      const blogToDelete = blogsAtStart[0]

      await api
        .delete(`/api/blogs/${blogToDelete.id}`)
        .set('Authorization', `Bearer ${user.token}`)
        .expect(204)

      const notesAtEnd = await helper.blogsInDb()
      expect(notesAtEnd).toHaveLength(
        helper.initialBlogs.length - 1
      )
    })

    test('with a nonexistant id to fail with status code 404 and have no effect', async () => {
      const loginResponse = await api
        .post('/api/login')
        .send({ username: 'initialUser', password: 'secret' })
        .expect(200)
        .expect('Content-Type', /application\/json/)

      const user = loginResponse.body

      const nonExistingId = await helper.nonExistingId()

      const result = await api
        .delete(`/api/blogs/${nonExistingId}`)
        .set('Authorization', `Bearer ${user.token}`)
        .expect(404)

      expect(result.body.error).toContain('blog not in database')

      const notesAtEnd = await helper.blogsInDb()
      expect(notesAtEnd).toHaveLength(
        helper.initialBlogs.length
      )
    })

    test('fails with status code 400 if id is invalid', async () => {
      const loginResponse = await api
        .post('/api/login')
        .send({ username: 'initialUser', password: 'secret' })
        .expect(200)
        .expect('Content-Type', /application\/json/)

      const user = loginResponse.body

      const invalidId = '63cf6713c13ffbd98c31463'

      const result = await api
        .delete(`/api/blogs/${invalidId}`)
        .set('Authorization', `Bearer ${user.token}`)
        .expect(400)

      expect(result.body.error).toContain('malformatted id')

      const notesAtEnd = await helper.blogsInDb()
      expect(notesAtEnd).toHaveLength(
        helper.initialBlogs.length
      )
    })

    test('fails with status code 401 if token is not provided', async () => {
      const blogsAtStart = await helper.blogsInDb()
      const blogToDelete = blogsAtStart[0]

      const result = await api
        .delete(`/api/blogs/${blogToDelete.id}`)
        .expect(401)

      expect(result.body.error).toContain('token missing or invalid')

      const notesAtEnd = await helper.blogsInDb()
      expect(notesAtEnd).toHaveLength(
        helper.initialBlogs.length
      )
    })

    test('fails with status code 403 if user did not create blog', async () => {
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

      const loginResponse = await api
        .post('/api/login')
        .send({ username: 'garrchen', password: 'salainen' })
        .expect(200)
        .expect('Content-Type', /application\/json/)

      const user = loginResponse.body

      const blogsAtStart = await helper.blogsInDb()
      const blogToDelete = blogsAtStart[0]

      const result = await api
        .delete(`/api/blogs/${blogToDelete.id}`)
        .set('Authorization', `Bearer ${user.token}`)
        .expect(403)

      expect(result.body.error).toContain('user not authorized to delete blog')

      const notesAtEnd = await helper.blogsInDb()
      expect(notesAtEnd).toHaveLength(
        helper.initialBlogs.length
      )
    })
  })

  describe('updating a blog', () => {
    test('succeeds with status code 200 if id is valid', async () => {
      const loginResponse = await api
        .post('/api/login')
        .send({ username: 'initialUser', password: 'secret' })
        .expect(200)
        .expect('Content-Type', /application\/json/)

      const user = loginResponse.body
      const userDoc = await User.findOne({ username: user.username })

      const blogsAtStart = await helper.blogsInDb()
      const blogToUpdate = blogsAtStart[0]
      const blogUpdate = {
        title: 'Space War',
        author: 'Robert C. Martin',
        url: 'http://blog.cleancoder.com/uncle-bob/2021/11/28/Spacewar.html',
        likes: blogToUpdate.likes + 11,
        user: userDoc._id
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
        id: blogToUpdate.id,
        user: userDoc._id.toString()
      })
      expect(updatedBlog.body).not.toEqual({
        title: blogToUpdate.title,
        author: blogToUpdate.author,
        url: blogToUpdate.url,
        likes: blogToUpdate.likes,
        id: blogToUpdate.id,
        user: userDoc._id.toString()
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

  test('all users are returned as json', async () => {
    const response = await api
      .get('/api/users')
      .expect(200)
      .expect('Content-Type', /application\/json/)

    expect(response.body).toHaveLength(1)
  })

  test('all users have a property named \'id\'', async () => {
    const response = await api.get('/api/users')

    response.body.forEach((user) => expect(user.id).toBeDefined())
  })

  describe('creation of a user', () => {
    test('succeeds with a fresh username and password', async () => {
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

    test('fails with proper statuscode and message if username already taken', async () => {
      const usersAtStart = await helper.usersInDb()

      const newUser = {
        username: 'root',
        name: 'Superuser',
        password: 'salainen',
      }

      const result = await api
        .post('/api/users')
        .send(newUser)
        .expect(400)
        .expect('Content-Type', /application\/json/)

      expect(result.body.error).toContain('expected `username` to be unique')

      const usersAtEnd = await helper.usersInDb()
      expect(usersAtEnd).toEqual(usersAtStart)
    })

    test('fails with proper statuscode and message if username is not given', async () => {
      const usersAtStart = await helper.usersInDb()

      const newUser = {
        name: 'Superuser',
        password: 'salainen',
      }

      const result = await api
        .post('/api/users')
        .send(newUser)
        .expect(400)
        .expect('Content-Type', /application\/json/)

      expect(result.body.error).toContain('Please provide both a username and password')

      const usersAtEnd = await helper.usersInDb()
      expect(usersAtEnd).toEqual(usersAtStart)
    })

    test('fails with proper statuscode and message if password is not given', async () => {
      const usersAtStart = await helper.usersInDb()

      const newUser = {
        username: 'testroot',
        name: 'Superuser',
      }

      const result = await api
        .post('/api/users')
        .send(newUser)
        .expect(400)
        .expect('Content-Type', /application\/json/)

      expect(result.body.error).toContain('Please provide both a username and password')

      const usersAtEnd = await helper.usersInDb()
      expect(usersAtEnd).toEqual(usersAtStart)
    })

    test('fails with proper statuscode and message if username is too short', async () => {
      const usersAtStart = await helper.usersInDb()

      const newUser = {
        username: 'ro',
        name: 'Superuser',
        password: 'salainen',
      }

      const result = await api
        .post('/api/users')
        .send(newUser)
        .expect(400)
        .expect('Content-Type', /application\/json/)

      expect(result.body.error).toContain(`Path \`username\` (\`${newUser.username}\`) is shorter than the minimum allowed length`)

      const usersAtEnd = await helper.usersInDb()
      expect(usersAtEnd).toEqual(usersAtStart)
    })

    test('fails with proper statuscode and message if password is too short', async () => {
      const usersAtStart = await helper.usersInDb()

      const newUser = {
        username: 'root',
        name: 'Superuser',
        password: 'sa',
      }

      const result = await api
        .post('/api/users')
        .send(newUser)
        .expect(400)
        .expect('Content-Type', /application\/json/)

      expect(result.body.error).toContain('Password must be at least 3 characters long')

      const usersAtEnd = await helper.usersInDb()
      expect(usersAtEnd).toEqual(usersAtStart)
    })
  })

})

afterAll(() => {
  mongoose.connection.close()
})