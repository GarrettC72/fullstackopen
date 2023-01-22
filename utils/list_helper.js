const _ = require('lodash')

const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  return blogs.reduce((sum, blog) => sum + blog.likes, 0)
}

const favoriteBlog = (blogs) => {
  const favoriteBlog = blogs.reduce((result, blog) => !result || result.likes < blog.likes ? blog : result, null)
  return !favoriteBlog ? favoriteBlog : {
    title: favoriteBlog.title,
    author: favoriteBlog.author,
    likes: favoriteBlog.likes
  }
}

const mostBlogs = (blogs) => {
  const groupedAuthors = _.countBy(blogs, blog => blog.author)
  const authors = _.map(Object.entries(groupedAuthors), (author) => {
    return {
      author: author[0],
      blogs: author[1]
    }
  })
  return authors.reduce((result, author) => !result || result.blogs < author.blogs ? author : result, null)
}

const mostLikes = (blogs) => {
  const groupedAuthors = _.groupBy(blogs, blog => blog.author)
  const authors = _.map(Object.entries(groupedAuthors), (author) => {
    return {
      author: author[0],
      likes: author[1].reduce((sum, blog) => sum + blog.likes, 0)
    }
  })
  return authors.reduce((result, author) => !result || result.likes < author.likes ? author : result, null)
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes
}