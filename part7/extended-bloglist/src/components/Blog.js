import {  useDispatch, useSelector } from 'react-redux'
import {  useParams } from 'react-router-dom'
import { vote } from '../reducers/blogReducer'
import { setNotification } from '../reducers/notificationReducer'

const Blog = () => {
    const dispatch = useDispatch()
    const { id } = useParams()
    const blog = useSelector((state) => state.blogs.find((u) => u.id === id))

    if (!blog) {
        return null
    }

    const increaseLikes = () => {
        dispatch(vote(blog.id))
        dispatch(setNotification(`You voted for '${blog.title}'`, 5))
    }

    return (
        <div>
            <h2>{blog.title}</h2>
            <p>{blog.url}</p>
            <p>{blog.likes} likes<button id="like-button" onClick={increaseLikes}>Like</button></p>
            <p>Added by {blog.author}</p>
        </div>
    )
}

export default Blog