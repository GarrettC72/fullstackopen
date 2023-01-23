const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')

const api = supertest(app)

const Blog = require('../models/Blog')
const helper = require('./blog_test_helper')

beforeEach(async () => {
  await Blog.deleteMany({})
  await Blog.insertMany(helper.initialBlogs)
})

test('all blogs are returned as json', async () => {
  const response = await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)

  // console.log(response.body)
  expect(response.body).toHaveLength(helper.initialBlogs.length)
})

test('blogs have a property named \'id\'', async () => {
  const response = await api.get('/api/blogs')

  response.body.forEach((blog) => expect(blog.id).toBeDefined())
})

test('a valid blog can be added', async () => {
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

test('adding test with no likes property will default to zero likes', async () => {
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
  expect(savedBlog.likes).toEqual(0)
})

test('blog without title is not added', async () => {
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

test('blog without url is not added', async () => {
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

afterAll(() => {
  mongoose.connection.close()
})