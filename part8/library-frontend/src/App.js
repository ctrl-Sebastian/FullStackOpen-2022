import React, { useState } from 'react'
import { useApolloClient } from '@apollo/client'
import { useSubscription } from '@apollo/client'

import { ALL_BOOKS, BOOK_ADDED } from './queries'

import Authors from './components/Authors'
import Books from './components/Books'
import NewBook from './components/NewBook'
import LoginForm from './components/LoginForm'
import Recommended from './components/Recommended'

import {
  BrowserRouter as Router,
  Routes, Route, Link
} from 'react-router-dom'

// function that takes care of manipulating cache
export const updateCache = (cache, query, addedBook) => {
  // helper that is used to eliminate saving same book twice
  const uniqByName = (a) => {
    let seen = new Set()
    return a.filter((item) => {
      let k = item.title
      return seen.has(k) ? false : seen.add(k)
    })
  }

  cache.updateQuery(query, ({ allBooks }) => {
    return {
      allBooks: uniqByName(allBooks.concat(addedBook)),
    }
  })
}

const Notify = ({errorMessage}) => {  
  if ( !errorMessage ) {    
    return null  
  }  
  return (    
    <div style={{color: 'red'}}>    
    {errorMessage}    
    </div>  
    )
}

const App = () => {
  const [token, setToken] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)
  const client = useApolloClient()

  useSubscription(BOOK_ADDED, {
    onData: ({ data }) => {
      console.log(data.data.bookAdded)
      const addedBook = data.data.bookAdded
      notify(`${addedBook.title} added`)
      updateCache(client.cache, { query: ALL_BOOKS }, addedBook)
    }
  })

  const notify = (message) => {    
    setErrorMessage(message)    
    setTimeout(() => {      
      setErrorMessage(null)    
    }, 10000)  
  }

  const logout = () => {    
    setToken(null)    
    localStorage.clear()    
    client.resetStore()  
  }

  if (!token) {
    return (
      <div>
        <Notify errorMessage={errorMessage} />
        <h2>Login</h2>
        <LoginForm
          setToken={setToken}
          setError={notify}
        />
      </div>
    )
  }

  
  const padding = {
    padding: 5
  }

  return (
    <Router>
      <div>
        <div>
          <Link style={padding} to="/authors">authors</Link>
          <Link style={padding} to="/books">books</Link>
          <Link style={padding} to="/recommended">recommended</Link>
          <Link style={padding} to="/add">add book</Link>
          <Link style={padding} to="/login">log in</Link>
          <button onClick={logout}>Log out</button>
        </div>

        <Routes>
          <Route path="/authors" element={<Authors notify={notify}/>} />
          <Route path="/books" element={<Books />} />
          <Route path="/recommended" element={<Recommended />} />
          <Route path="/add" element={<NewBook notify={notify}/>} />
          <Route path="/login" element={<LoginForm setToken={setToken} setError={notify}/>} />
        </Routes>
      </div>
    </Router>
  )
}

export default App
