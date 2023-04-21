import { useState } from 'react'
import {  useDispatch, useSelector } from 'react-redux'
import {  useParams } from 'react-router-dom'
import { vote, createComment } from '../reducers/blogReducer'
import { setNotification } from '../reducers/notificationReducer'

const Blog = () => {
    const dispatch = useDispatch()
    const { id } = useParams()
    const blog = useSelector((state) => state.blogs.find((u) => u.id === id))

    const [comment, setComment] = useState('')

    if (!blog) {
        return null
    }

    const increaseLikes = () => {
        dispatch(vote(blog.id))
        dispatch(setNotification(`You voted for '${blog.title}'`, 5))
    }

    const handleComment = (event) => {
        event.preventDefault()
        console.log('Comment')
        dispatch(createComment(id, comment.trim()))
    }

    const handleCommentChange = ({ target }) => setComment(target.value)

    return (
        <div>
            <h2>{blog.title}</h2>
            <p>{blog.url}</p>
            <p>{blog.likes} likes<button id="like-button" onClick={increaseLikes}>Like</button></p>
            <p>Added by {blog.author}</p>
            <h2>Comments</h2>

            <form onSubmit={handleComment}>
                <div>
                    <input
                        placeholder='Comment something...'
                        id="comment"
                        value={comment}
                        onChange={handleCommentChange}
                    />
                </div>
                <button id="comment-button" type="submit">Add comment</button>
            </form>

            <ul>
                {blog.comments.map((comment, i) => (
                    <li key={i}>{comment}</li>
                ))}
            </ul>
        </div>
    )
}

export default Blog