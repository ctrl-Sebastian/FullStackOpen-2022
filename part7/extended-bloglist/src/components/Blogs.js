import { useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'

import { vote, deleteBlog } from '../reducers/blogReducer'
import { setNotification } from '../reducers/notificationReducer'

import { useState } from 'react'
import Toggleable from './Toggleable'
import BlogForm from './BlogForm'
import Filter from './Filter'

import { Table } from 'react-bootstrap'

const Blog = ( { blog, user } ) => {
    const dispatch = useDispatch()

    const [removeVisible, setRemoveVisible] = useState(false)

    const hideWhenNotOwned = { display: removeVisible ? 'none' : '' }

    const increaseLikes = () => {
        dispatch(vote(blog.id))
        dispatch(setNotification(`You voted for '${blog.title}'`, 5))
    }

    const remove = () => {
        if (window.confirm(`remove blog ${blog.title}) by ${blog.author}`)) {
            dispatch(deleteBlog(blog))
            dispatch(setNotification(`You deleted '${blog.title}'`, 5))
        }
    }

    const rules = () => {
        if (blog.user.username !== user.username) {
            setRemoveVisible(true)
        }
    }


    return(
        <div className="blog" onClick={rules}>
            <Link to={`/blogs/${blog.id}`}>{blog.title}</Link>
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
    const blogFormRef = useRef()
    return(
        <div>
            {user !== null ?
                <Toggleable buttonLabel="new blog" ref={blogFormRef}>
                    <BlogForm />
                </Toggleable> :
                <div></div>
            }


            <Filter />

            <h2>Blogs</h2>
            <Table striped bordered hover>
                <tbody>
                    {blogs.sort((b1, b2) => b2.likes - b1.likes).map(blog =>
                        <tr key={blog.id}>
                            <td>
                                <Blog key={blog.id} blog={blog} user={user} />
                            </td>
                            <td>
                                {blog.author}
                            </td>
                        </tr>
                    )}
                </tbody>
            </Table>

        </div>
    )
}


export default Blogs