import { useDispatch } from 'react-redux'
import { vote } from '../reducers/blogReducer'
import { setNotification } from '../reducers/notificationReducer'

import { useState } from 'react'
import Toggleable from './Toggleable'
import blogService from '../services/blogs'


const Blog = ( { blog, user } ) => {
    const dispatch = useDispatch()

    const [removeVisible, setRemoveVisible] = useState(false)

    const hideWhenNotOwned = { display: removeVisible ? 'none' : '' }

    const increaseLikes = () => {
        dispatch(vote(blog.id))
        dispatch(setNotification(`You voted for '${blog.content}'`, 5))
    }

    const remove = async event => {
        event.preventDefault()

        if (window.confirm(`remove blog ${blog.title}) by ${blog.author}`)) {
            await blogService.remove(blog.id, user.token)
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
            {blog.title} {blog.author}
            <Toggleable buttonLabel='view'>
                Url: {blog.url} <br></br>

                Likes: {blog.likes} <button id="like-button" onClick={increaseLikes}>Like</button><br></br>

                Username: {blog.user.name} <br></br>
                <button style={hideWhenNotOwned} onClick={remove}>Remove</button>
            </Toggleable>
        </div>
    )
}

export default Blog