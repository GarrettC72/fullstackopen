const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const { userExtractor } = require('../utils/middleware')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog
    .find({})
    .populate('user', { username: 1, name: 1 })

  response.json(blogs)
})

blogsRouter.get('/:id', async (request, response) => {
  const blog = await Blog
    .findById(request.params.id)
    .populate('user', { username: 1, name: 1 })

  if (blog) {
    response.json(blog)
  } else {
    response.status(404).end()
  }
})

blogsRouter.post('/', userExtractor, async (request, response) => {
  const { title, author, url, likes } = request.body

  const blog = new Blog({
    title, author, url,
    likes: likes ?? 0,
  })

  const user = request.user

  if (!user) {
    return response.status(401).json({ error: 'operation not permitted' })
  }

  blog.user = user._id

  let createdBlog = await blog.save()

  user.blogs = user.blogs.concat(createdBlog._id)
  await user.save()

  createdBlog = await Blog.findById(createdBlog._id).populate('user', { username: 1, name: 1 })

  response.status(201).json(createdBlog)
})

blogsRouter.delete('/:id', userExtractor, async (request, response) => {
  const user = request.user

  const blog = await Blog.findById(request.params.id)

  if (!blog) {
    return response.status(404).json({ error: 'blog not in database' })
  }
  if (!user || blog.user.toString() !== user.id.toString()) {
    return response.status(401).json({ error: 'operation not permitted' })
  }

  user.blogs = user.blogs.filter(otherBlog => otherBlog.toString() !== blog.id.toString())

  await user.save()
  await blog.remove()

  response.status(204).end()
})

blogsRouter.put('/:id', async (request, response) => {
  const { title, author, url, likes } = request.body

  let updatedBlog = await Blog.findByIdAndUpdate(
    request.params.id,
    { title, author, url, likes },
    { new: true, runValidators: true, context: 'query' }
  )

  if (!updatedBlog) {
    return response.status(404).json({ error: 'blog not in database' })
  }

  updatedBlog = await Blog.findById(updatedBlog._id).populate('user', { username: 1, name: 1 })

  response.json(updatedBlog)
})

module.exports = blogsRouter