const supertest = require('supertest')
const mongoose = require('mongoose')
const helper = require('./test_helper')
const app = require('../app')
const api = supertest(app)

const Blog = require('../models/blog')

const initialBlogs = [
    {
        _id: "5a422a851b54a676234d17f7",
        title: "React patterns",
        author: "Michael Chan",
        url: "https://reactpatterns.com/",
        likes: 7,
        __v: 0
    },
    {
        _id: "5a422aa71b54a676234d17f8",
        title: "Go To Statement Considered Harmful",
        author: "Edsger W. Dijkstra",
        url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
        likes: 5,
        __v: 0
    }
]

beforeEach(async () => {
    await Blog.deleteMany({})
    await Blog.insertMany(helper.initialBlogs)
})
describe('when there is initially some notes saved', () => {
test('blogs are returned as json', async () => {
    await api
        .get('/api/blogs')
        .expect(200)
        .expect('Content-Type', /application\/json/)
}, 100000)

test('all blogs are returned', async () => {
    const response = await api.get('/api/blogs')

    expect(response.body).toHaveLength(helper.initialBlogs.length)
})

test('a specific blog can be viewed', async () => {
    const blogsAtStart = await helper.blogsInDb()

    const blogToView = blogsAtStart[0]

    const resultBlog = await api
        .get(`/api/blogs/${blogToView.id}`)
        .expect(200)
        .expect('Content-Type', /application\/json/)

    expect(resultBlog.body).toEqual(blogToView)
})

test('the unique identifier property of the blog posts is named id', async () => {
    const response = await api.get('/api/blogs')

    for (const blog of response.body) {
        expect(blog.id).toBeDefined()
    }
})
})

describe('addition of a new note', () => {
    test('a valid blog can be added', async () => {
        const newBlog = {
            title: "Nose una prueba",
            author: "Sebastian Marrera",
            url: "https://reactpatterns.com/",
            likes: 2,
            __v: 0
        }

        await api
            .post('/api/blogs')
            .send(newBlog)
            .expect(201)
            .expect('Content-Type', /application\/json/)

        const blogsAtEnd = await helper.blogsInDb()
        expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1)

        const titles = blogsAtEnd.map(r => r.title)
        expect(titles).toContain(
            'Nose una prueba'
        )
    })

    test('if a blog is added with the likes property missing from the request it will be default to 0', async () => {
        const newBlog = {
            title: "Blog con likes sin definir",
            author: "Sebastian Marrera",
            url: "exampleurl.com",
            __v: 0
        }

        await api
            .post('/api/blogs')
            .send(newBlog)
            .expect(201)
            .expect('Content-Type', /application\/json/)

        const blogsAtEnd = await helper.blogsInDb()
        expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1)

        const blog = blogsAtEnd.filter(blog => blog.title === newBlog.title)
        expect(blog[0]).toBeDefined();
        expect(blog[0].likes).toEqual(0);
    })

    test('blog added without title send a 400 Bad Request', async () => {
        const newBlog = {
            // title: "Nose una prueba",
            author: "Sebastian Marrera",
            url: "https://reactpatterns.com/",
            likes: 2,
            __v: 0
        }

        await api
            .post('/api/blogs')
            .send(newBlog)
            .expect(400)

    })
})

describe('editing an existing blog', () => {
    test('the likes of a blog can be edited', async () => {
        const newBlog = {
            title: "blog to edit from 2 likes to 4 likes",
            author: "Sebastian Marrera",
            url: "https://reactpatterns.com/",
            likes: 2,
            __v: 0
        }

        await api
            .post('/api/blogs')
            .send(newBlog)

        const blogsAtEnd = await helper.blogsInDb()
        expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1)

        await api
        .put('/api/blogs')
        .send(newBlog)
    })
})

describe('deletion of a note', () => {
    test('a blog can be deleted', async () => {
        const blogsAtStart = await helper.blogsInDb()
        const blogToDelete = blogsAtStart[0]

        await api
            .delete(`/api/blogs/${blogToDelete.id}`)
            .expect(204)

        const blogsAtEnd = await helper.blogsInDb()

        expect(blogsAtEnd).toHaveLength(
            helper.initialBlogs.length - 1
        )

        const title = blogsAtEnd.map(r => r.title)

        expect(title).not.toContain(blogToDelete.title)
    })
})

afterAll(async () => {
    await mongoose.connection.close()
})