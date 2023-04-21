import { configureStore } from '@reduxjs/toolkit'
import blogService from './services/blogs'
import blogReducer, { setBlogs } from './reducers/blogReducer'
import notificationReducer from './reducers/notificationReducer'
import userReducer from './reducers/userReducer'

const store = configureStore({
    reducer: {
        blogs: blogReducer,
        notification: notificationReducer,
        user: userReducer
    }
})

blogService.getAll().then(blog =>
    store.dispatch(setBlogs(blog))
)
console.log(store.getState())

export default store