import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { createBlog } from '../reducers/blogReducer'
import { setNotification } from '../reducers/notificationReducer'
import { Form, Button } from 'react-bootstrap'
const BlogForm = () => {
    const dispatch = useDispatch()

    const [newTitle, setNewTitle ] = useState('')
    const [newAuthor, setNewAuthor ] = useState('')
    const [newUrl, setNewUrl ] = useState('')

    const handleTitleChange = (event) => {
        setNewTitle(event.target.value)
    }
    const handleAuthorChange = (event) => {
        setNewAuthor(event.target.value)
    }
    const handleUrlChange = (event) => {
        setNewUrl(event.target.value)
    }

    const addBlog = (event) => {
        event.preventDefault()
        const blogToAdd = {
            title: newTitle,
            author: newAuthor,
            url: newUrl
        }
        setNewTitle('')
        setNewAuthor('')
        setNewUrl('')
        dispatch(createBlog(blogToAdd))
        dispatch(setNotification(`Blog '${blogToAdd.title}' successfully added`, 5))

    }

    return (
        <div>
            <h2>Create a new blog</h2>

            <Form onSubmit={addBlog}>
                <Form.Group>
                    <Form.Label>Title:</Form.Label>
                    <Form.Control
                        id="title"
                        value={newTitle}
                        onChange={handleTitleChange}
                        placeholder="Title"
                    />

                    <Form.Label>Author:</Form.Label>
                    <Form.Control
                        id="author"
                        value={newAuthor}
                        onChange={handleAuthorChange}
                        placeholder="Author"
                    />

                    <Form.Label>Url:</Form.Label>
                    <Form.Control
                        id="url"
                        value={newUrl}
                        onChange={handleUrlChange}
                        placeholder="Url"
                    />

                    <Button variant="primary" type="submit">Save</Button>
                </Form.Group>
            </Form>
        </div>
    )
}

export default BlogForm