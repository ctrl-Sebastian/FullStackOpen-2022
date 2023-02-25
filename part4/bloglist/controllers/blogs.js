const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')


blogsRouter.get('/', async (request, response) => {
    const blogs = await Blog
        .find({}).populate('user', {username: 1, name: 1})

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

    if(!request.user){
        return response.status(401).json({error: 'must be logged in'})
    } 

    const user = await User.findById(request.user.id)
    if (!user) return response.status(401).json({ error: 'must be logged in' })

    const blog = new Blog({
        ...request.body,
        likes: request.body.likes ?? 0,
        user: user.id
    })
    const savedBlog = await blog.save()

    user.blogs = user.blogs.concat(savedBlog._id)
    await user.save()

    response.status(201).json(savedBlog)
})

blogsRouter.delete('/:id', async (request, response) => {
    if(!request.user) return response.status(401).json({error: 'must be logged in'})

    const blog = await Blog.findById(request.params.id)

    if(blog?.user?.toString() !== request.user.id) return response.status(401).json({ error: 'you can not delete others blogs' })

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