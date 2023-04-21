import { configureStore } from '@reduxjs/toolkit'
import blogService from './services/blogs'
import blogReducer, { setBlogs } from './reducers/blogReducer'
import filterReducer from './reducers/filterReducer'
import notificationReducer from './reducers/notificationReducer'
import loginReducer from './reducers/loginReducer'
import userReducer from './reducers/userReducer'

const store = configureStore({
    reducer: {
        blogs: blogReducer,
        notification: notificationReducer,
        login: loginReducer,
        filter: filterReducer,
        users: userReducer
    }
})

blogService.getAll().then(blog =>
    store.dispatch(setBlogs(blog))
)
console.log(store.getState())

export default store