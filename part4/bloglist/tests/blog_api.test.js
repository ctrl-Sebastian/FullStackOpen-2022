const supertest = require('supertest')
const mongoose = require('mongoose')
const helper = require('./test_helper')
const app = require('../app')
const api = supertest(app)

const bcrypt = require('bcrypt')
const User = require('../models/user')

const Blog = require('../models/blog')

const initialBlogs = [
    {
        id: "5a422a851b54a676234d17f7",
        title: "React patterns",
        author: "Michael Chan",
        url: "https://reactpatterns.com/",
        likes: 7,
        __v: 0
    },
    {
        id: "5a422aa71b54a676234d17f8",
        title: "Go To Statement Considered Harmful",
        author: "Edsger W. Dijkstra",
        url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
        likes: 5,
        __v: 0
    }
]

let testUser
let testUserToken

beforeEach(async () => {
    await User.deleteMany({})

    const passwordHash = await bcrypt.hash('sekret', 10)
    const user = new User({ username: 'root', passwordHash })

    await user.save()

    const initialUsers = await helper.usersInDb()
    testUser = initialUsers[0]

    const tokenRes = await api
        .post('/api/login')
        .send({
            username: 'root',
            password: 'sekret'
        })

    testUserToken = tokenRes.body.token

    await Blog.deleteMany({})

    const blogObjects = helper.initialBlogs
        .map(blog => new Blog(blog))

    const promiseArray = blogObjects.map(blog => {
        blog.userId = testUser.id
        blog.save()
    })
    await Promise.all(promiseArray)
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
            .set('Authorization', 'bearer ' + testUserToken)
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

    test('if a blog is added without the likes property it will be default to 0', async () => {
        const newBlog = {
            title: "Blog con likes sin definir",
            author: "Sebastian Marrera",
            url: "exampleurl.com",
            __v: 0
        }

        await api
            .post('/api/blogs')
            .set('Authorization', 'bearer ' + testUserToken)
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
            .set('Authorization', 'bearer ' + testUserToken)
            .send(newBlog)
            .expect(400)

    })
})

describe('editing an existing blog', () => { 

})

describe('deletion of a note', () => {
})

afterAll(async () => {
    await mongoose.connection.close()
})