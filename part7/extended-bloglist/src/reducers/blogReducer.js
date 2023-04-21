import { createSlice } from '@reduxjs/toolkit'
import blogService from '../services/blogs'

const initialState = []

const blogSlice = createSlice({
    name: 'blogs',
    initialState,
    reducers: {
        vote(state, action) {
            const id = action.payload
            const blogToChange = state.find(n => n.id === id)
            const changedBlog = {
                ...blogToChange,
                likes: blogToChange.likes + 1
            }

            console.log(JSON.parse(JSON.stringify(state)))
            blogService.update(id, changedBlog)

            return state.map(blog =>
                blog.id !== id ? blog : changedBlog
            )
        },
        removeBlog(state, action) {
            const id = action.payload
            console.log(JSON.parse(JSON.stringify(state)))
            blogService.remove(id)
        },
        appendBlog(state, action) {
            state.push(action.payload)
        },
        setBlogs(state, action) {
            return action.payload
        }
    }
})

export const { vote, removeBlog, appendBlog, setBlogs } = blogSlice.actions

export const initializeBlogs = () => {
    return async dispatch => {
        const blogs = await blogService.getAll()
        dispatch(setBlogs(blogs))
    }
}


export const createBlog = newBlog => {
    return async dispatch => {
        const Newblog = await blogService.create(newBlog)
        dispatch(appendBlog(Newblog))
    }
}

export default blogSlice.reducer