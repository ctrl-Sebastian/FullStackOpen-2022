import { useState } from 'react'
import Toggleable from './Toggleable'
import blogService from '../services/blogs'


const Blog = ( { blog, user } ) => {
    const [removeVisible, setRemoveVisible] = useState(false)

    const hideWhenNotOwned = { display: removeVisible ? 'none' : '' }

    const increaseLikes = async event => {
        event.preventDefault()
        const likes = blog.likes + 1
        const newBlog = { ...blog, likes }
        await blogService.update(blog.id, newBlog)
        window.location.reload()
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

                likes: {blog.likes} <button onClick={increaseLikes}>Like</button><br></br>

                Username: {blog.user.username} <br></br>
                <button style={hideWhenNotOwned} onClick={remove}>Remove</button>
            </Toggleable>
        </div>
    )
}

export default Blog