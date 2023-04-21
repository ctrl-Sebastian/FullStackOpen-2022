import React, { useState, useEffect, useRef } from 'react'

import Filter from './components/Filter'
import Blogs from './components/Blog'
import LoginForm from './components/Login'
import BlogForm from './components/BlogForm'
import Toggleable from './components/Toggleable'
import Notification from './components/Notification'

import userService from './services/users'

import { useDispatch, useSelector } from 'react-redux'
import { login } from './reducers/loginReducer'
import { initializeBlogs } from './reducers/blogReducer'
import { initializeUsers } from './reducers/userReducer'
import { logUserOut } from './reducers/loginReducer'

const App = () => {
    const dispatch = useDispatch()
    const user = useSelector((state) => state.login)

    useEffect(() => {
        const userFromStorage = userService.getUser()
        if (userFromStorage) {
            dispatch(login(userFromStorage))
        }
    }, [])

    useEffect(() => {
        dispatch(initializeUsers())
        dispatch(initializeBlogs())
    }, [dispatch])

    const blogFormRef = useRef()
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')

    const handleLogout = async () => {
        dispatch(logUserOut())
    }

    return (
        <div>
            <h1>Blogs app</h1>

            <Notification />
            <Filter />
            {user === null ?
                <Toggleable buttonLabel='log in'>
                    <LoginForm
                        username={username}
                        password={password}
                        handleUsernameChange={({ target }) => setUsername(target.value)}
                        handlePasswordChange={({ target }) => setPassword(target.value)}
                    />
                </Toggleable> :
                <div>
                    <p>{user.name} logged in<button onClick={handleLogout}>log out</button></p>

                    <Toggleable buttonLabel="new blog" ref={blogFormRef}>
                        <BlogForm />
                    </Toggleable>

                </div>
            }
            <Blogs user={ user }/>
        </div>
    )
}

export default App