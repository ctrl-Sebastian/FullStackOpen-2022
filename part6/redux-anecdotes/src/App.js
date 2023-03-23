import React, { useEffect } from 'react'

import Anecdotes from "./components/AnecdoteList"
import NewAnecdote from "./components/AnecdoteForm"
import Filter from "./components/Filter"
import Notification from './components/Notification'

import { initializeAnecdotes } from './reducers/anecdoteReducer'
import { useDispatch } from 'react-redux'

const App = () => {
    const dispatch = useDispatch()
    useEffect(() => {
      dispatch(initializeAnecdotes())
  }, [dispatch])

  return (
    <div>
      <Notification />
      <Filter />
      <NewAnecdote />
      <Anecdotes />
    </div>
  )
}

export default App