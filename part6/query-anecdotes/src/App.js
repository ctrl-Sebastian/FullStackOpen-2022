import { useContext } from 'react';
import AnecdoteForm from './components/AnecdoteForm'
import Notification from './components/Notification'

import { useQuery, useMutation, useQueryClient  } from 'react-query'
import { getAnecdotes, updateAnecdote } from './requests'

import { NotificationContext } from './NotificationContext';

const App = () => {
  const { dispatch } = useContext(NotificationContext);

  const queryClient = useQueryClient()
  const updateAnecdoteMutation = useMutation(updateAnecdote, {
    onSuccess: () => {
      queryClient.invalidateQueries('anecdotes')
  },
})
  
  const handleVote = (anecdote) => {
    updateAnecdoteMutation.mutate({...anecdote, votes: anecdote.votes +1 })
    dispatch({ type: 'SET_MESSAGE', payload: `Voted on: ${anecdote.content}` });
    setTimeout(() => {
      dispatch({ type: 'CLEAR_MESSAGE' });
    }, 5000);
  }


  const result = useQuery('anecdotes', getAnecdotes, {
    refetchOnWindowFocus: false
  })
  console.log(result)

  if ( result.isLoading ) {
    return <div>anecdote service not available due to problems in server</div>
  }

  const anecdotes = result.data

  return (
    
    <div>
      <h3>Anecdote app</h3>
    
      <Notification />
      <AnecdoteForm />
    
      {anecdotes.map(anecdote =>
        <div key={anecdote.id}>
          <div>
            {anecdote.content}
          </div>
          <div>
            has {anecdote.votes}
            <button onClick={() => handleVote(anecdote)}>vote</button>
          </div>
        </div>
      )}
    </div>
    
  )
}

export default App
