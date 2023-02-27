import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'

const Notification = ({ message, type }) => {
  if (message === null) {
    return null
  }
  return (
    <div className={type}>
      {message}
    </div>
  )
}

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [newTitle, setNewTitle] = useState('')
  const [newAuthor, setNewAuthor] = useState('')
  const [newUrl, setNewUrl] = useState('')

  const [notifMessage, setNotifMessage] = useState('')
  const [messageType, setMessageType] = useState('')

  const [username, setUsername] = useState('') 
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
    )  
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogsappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const handleLogin = async (event) => {
    event.preventDefault()

    try {
      const user = await loginService.login({
        username, password,
      })

      window.localStorage.setItem(
        'loggedBlogsappUser', JSON.stringify(user)
      )
      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
    } catch (exception) {

      setMessageType('error')
      setNotifMessage(
        `Wrong credentials`
      )
      setTimeout(() => {
        setNotifMessage(null)
      }, 5000).catch(error => {
        console.log('fail')
    })
    }

  }

  const handleLogout = async (event) => {
    window.localStorage.removeItem('loggedBlogsappUser')
    window.location.reload()
  }
  

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
    const blogObject = {
      title: newTitle,
      author: newAuthor,
      url: newUrl
    }

    blogService
      .create(blogObject)
        .then(returnedBlog => {
        setBlogs(blogs.concat(returnedBlog))
        setNewTitle('')
        setNewAuthor('')
        setNewUrl('')
      })

    setMessageType('success')
      setNotifMessage(
        `A new blog '${newTitle}' by ${newAuthor}`
      )
      setTimeout(() => {
        setNotifMessage(null)
      }, 5000).catch(error => {
        console.log('fail')
    })
  }

  const loginForm = () => (
    <form onSubmit={handleLogin}>
    <div>
      username
        <input
        type="text"
        value={username}
        name="Username"
        onChange={({ target }) => setUsername(target.value)}
      />
    </div>
    <div>
      password
        <input
        type="password"
        value={password}
        name="Password"
        onChange={({ target }) => setPassword(target.value)}
      />
    </div>
    <button type="submit">login</button>
    </form>
  )

  const blogForm = () => (
    <form onSubmit={addBlog}>

      Title: <input
        value={newTitle}
        onChange={handleTitleChange}
      />

      Author: <input
        value={newAuthor}
        onChange={handleAuthorChange}
      />

      Url: <input
        value={newUrl}
        onChange={handleUrlChange}
      />

      <button type="submit">save</button>
    </form>  
  )

  return (
    <div>
      <h1>Blogs app</h1>

      <Notification message={notifMessage} type={messageType}/>

      {user === null ?
        loginForm() :
        <div>
          <p>{user.name} logged in<button onClick={handleLogout}>log out</button></p>
          {blogForm()}
        </div>
      }

      <h2>blogs</h2>
      {blogs.map(blog =>
        <Blog key={blog.id} blog={blog} />
      )}
    </div>
  )
}

export default App