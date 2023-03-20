import React from 'react'
import Anecdotes from "./components/AnecdoteList"
import NewAnecdote from "./components/AnecdoteForm"
import Filter from "./components/Filter"
import Notification from './components/Notification'

const App = () => {

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