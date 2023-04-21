import { useDispatch, useSelector } from 'react-redux'
import { vote, removeBlog } from '../reducers/blogReducer'
import { setNotification } from '../reducers/notificationReducer'

import { useState } from 'react'
import Toggleable from './Toggleable'


const Blog = ( { blog, user } ) => {
    const dispatch = useDispatch()

    const [removeVisible, setRemoveVisible] = useState(false)

    const hideWhenNotOwned = { display: removeVisible ? 'none' : '' }

    const increaseLikes = () => {
        dispatch(vote(blog.id))
        dispatch(setNotification(`You voted for '${blog.title}'`, 5))
    }

    const remove = async event => {

        event.preventDefault()
        if (window.confirm(`remove blog ${blog.title}) by ${blog.author}`)) {
            dispatch(removeBlog(blog.id))
            dispatch(setNotification(`You deleted '${blog.title}'`, 5))
        }
        window.location.reload()
    }

    const rules = () => {
        if (blog.user.username !== user.username) {
            setRemoveVisible(true)
        }
    }

    return(
        <div className="blog" onClick={rules}>
            {blog.title} <strong>Autor: </strong>{blog.author}
            <Toggleable buttonLabel='view'>
                Url: {blog.url} <br></br>

                Likes: {blog.likes} <button id="like-button" onClick={increaseLikes}>Like</button><br></br>

                Username: {blog.user.name} <br></br>
                <button style={hideWhenNotOwned} onClick={remove}>Remove</button>
            </Toggleable>
        </div>
    )
}

const Blogs = ({ user }) => {
    const blogs = useSelector(state => {
        return state.blogs.filter(blog => blog.title.includes(state.filter))
    })

    return(
        <div>
            <h2>Blogs</h2>
            {blogs.sort((b1, b2) => b2.likes - b1.likes).map(blog =>
                <Blog key={blog.id} blog={blog} user={user} />
            )}
        </div>
    )
}


export default Blogs