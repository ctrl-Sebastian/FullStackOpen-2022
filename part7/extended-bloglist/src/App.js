import React, { useEffect } from 'react'

import { Routes, Route } from 'react-router-dom'

import Blogs from './components/Blogs'
import Blog from './components/Blog'
import Users from './components/Users'
import User from './components/User'
import Login from './components/Login'
import Notification from './components/Notification'
import Navbar from './components/Navbar'

import userService from './services/users'

import { useDispatch, useSelector } from 'react-redux'
import { login } from './reducers/loginReducer'
import { initializeBlogs } from './reducers/blogReducer'
import { initializeUsers } from './reducers/userReducer'


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

    return (
        <div>
            <h1>Blogs app</h1>
            <Navbar />
            <Notification />
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/" element={<Blogs user={ user }/>} />
                <Route path="/blogs/:id" element={<Blog />} />
                <Route path="/users" element={<Users />} />
                <Route path="/users/:id" element={<User />} />
            </Routes>
        </div>
    )
}

export default App