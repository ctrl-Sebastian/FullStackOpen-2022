const blogsRouter = require('express').Router()
const Blog = require('../models/blog')

blogsRouter.get('/', async (request, response) => {
    const blogs = await Blog.find({})
    response.json(blogs)
})

blogsRouter.get('/:id', async (request, response) => {
    const blog = await Blog.findById(request.params.id)
    if (blog) {
        response.json(blog)
    } else {
        response.status(404).end()
    }
})

blogsRouter.post('/', async (request, response) => {
    if (!request.body.title || !request.body.url) {
        return response.status(400).end()
    }

    const blog = new Blog({
        ...request.body,
        likes: request.body.likes ?? 0,
    })
    const result = await blog.save()
    response.status(201).json(result)
})

blogsRouter.delete('/:id', async (request, response) => {
    await Blog.findByIdAndRemove(request.params.id)
    response.status(204).end()
})

blogsRouter.put('/:id', async (request, response) => {
    const previousBlog = await Blog.findById(request.params.id)
    const body = request.body

    const newBlog = {
        title: body.title ?? previousBlog.title,
        likes: body.likes ?? previousBlog.likes,
    }

    Blog.findByIdAndUpdate(request.params.id, newBlog, { new: true })
        .then(updatedBlog => {
        response.status(200).json(updatedBlog)
        })
        .catch(error => console.log(error))
})

module.exports = blogsRouter