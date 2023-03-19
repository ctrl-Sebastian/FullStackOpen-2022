import Anecdotes from "./components/AnecdoteList"
import NewAnecdote from "./components/AnecdoteForm"

const App = () => {

  return (
    <div>
      <NewAnecdote />
      <Anecdotes />
    </div>
  )
}

export default App