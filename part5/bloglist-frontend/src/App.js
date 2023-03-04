import { useState, useEffect, useRef } from 'react'

import Blog from './components/Blog'
import LoginForm from './components/Login'
import BlogForm from './components/BlogForm'
import Toggleable from './components/Toggleable'


import blogService from './services/blogs'
import loginService from './services/login'

const Notification = ({ message, type }) => {
    if (message === null) {
        return null
    }
    return (
        <div className={type}>
            {message}
        </div>
    )
}

const App = () => {
    const [blogs, setBlogs] = useState([])

    const [notifMessage, setNotifMessage] = useState('')
    const [messageType, setMessageType] = useState('')

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

            setMessageType('error')
            setNotifMessage(
                'Wrong credentials'
            )
            setTimeout(() => {
                setNotifMessage(null)
            }, 5000).catch(error => {
                console.log(error)
            })
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

        setMessageType('success')
        setNotifMessage(
            `A new blog '${blogObject.title}' by ${blogObject.author}`
        )
        setTimeout(() => {
            setNotifMessage(null)
        }, 5000).catch(error => {
            console.log(error)
        })
    }

    return (
        <div>
            <h1>Blogs app</h1>

            <Notification message={notifMessage} type={messageType}/>

            {user === null ?
                <Toggleable buttonLabel='login'>
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