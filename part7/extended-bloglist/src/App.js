import { useState, useEffect, useRef } from 'react'

import Blog from './components/Blog'
import LoginForm from './components/Login'
import BlogForm from './components/BlogForm'
import Toggleable from './components/Toggleable'
import Notification from './components/Notification'

import blogService from './services/blogs'
import loginService from './services/login'

import { initializeBlogs } from './reducers/blogReducer'
import { useDispatch } from 'react-redux'
import { setNotification } from './reducers/notificationReducer'

const App = () => {
    const dispatch = useDispatch()
    const [blogs, setBlogs] = useState([])

    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [user, setUser] = useState(null)

    const blogFormRef = useRef()

    useEffect(() => {
        blogService.getAll().then(blogs =>
            setBlogs( blogs )
        )
    }, [])

    useEffect(() => {
        dispatch(initializeBlogs())
    }, [dispatch])

    useEffect(() => {
        const loggedUserJSON = window.localStorage.getItem('loggedBlogsappUser')
        if (loggedUserJSON) {
            const user = JSON.parse(loggedUserJSON)
            setUser(user)
            blogService.setToken(user.token)
        }
    }, [])

    const handleLogin = async (event) => {
        event.preventDefault()

        try {
            const user = await loginService.login({
                username, password,
            })

            window.localStorage.setItem(
                'loggedBlogsappUser', JSON.stringify(user)
            )
            blogService.setToken(user.token)
            setUser(user)
            setUsername('')
            setPassword('')
        } catch (exception) {

            dispatch(setNotification('Wrong credentials', 5))
        }

    }

    const handleLogout = async () => {
        window.localStorage.removeItem('loggedBlogsappUser')
        window.location.reload()
    }

    const addBlog = (blogObject) => {
        blogFormRef.current.toggleVisibility()
        blogService
            .create(blogObject)
            .then(returnedBlog => {
                setBlogs(blogs.concat(returnedBlog))
            })

        dispatch(setNotification(`A new blog '${blogObject.title}' by ${blogObject.author}`, 5))
    }

    return (
        <div>
            <h1>Blogs app</h1>

            <Notification />
            {user === null ?
                <Toggleable buttonLabel='log in'>
                    <LoginForm
                        username={username}
                        password={password}
                        handleUsernameChange={({ target }) => setUsername(target.value)}
                        handlePasswordChange={({ target }) => setPassword(target.value)}
                        handleSubmit={handleLogin}
                    />
                </Toggleable> :
                <div>
                    <p>{user.name} logged in<button onClick={handleLogout}>log out</button></p>

                    <Toggleable buttonLabel="new blog" ref={blogFormRef}>
                        <BlogForm createBlog={addBlog}/>
                    </Toggleable>

                </div>
            }

            <h2>blogs</h2>
            {blogs.sort((b1, b2) => b2.likes - b1.likes).map(blog =>
                <Blog key={blog.id} blog={blog} user={user} />
            )}
        </div>
    )
}

export default App