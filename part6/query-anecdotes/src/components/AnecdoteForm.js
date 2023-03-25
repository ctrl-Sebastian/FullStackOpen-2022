import { useContext } from 'react';
import {  useMutation, useQueryClient } from 'react-query'
import { createAnecdote } from '../requests'
import { NotificationContext } from '../NotificationContext';

const AnecdoteForm = () => {
  const { dispatch } = useContext(NotificationContext);
  
  const queryClient = useQueryClient()

  const newAnecdoteMutation = useMutation(createAnecdote, {
    onSuccess: (newAnecdote) => {
      const anecdotes = queryClient.getQueryData('anecdotes')
      queryClient.setQueryData('anecdotes', anecdotes.concat(newAnecdote))
      dispatch({ type: 'SET_MESSAGE', payload: `New anecdote added: ${newAnecdote.content}` });
      setTimeout(() => {
        dispatch({ type: 'CLEAR_MESSAGE' });
      }, 5000);
  },
  onError: (error) => {
    dispatch({ type: 'SET_MESSAGE', payload: `${error}` });
    setTimeout(() => {
      dispatch({ type: 'CLEAR_MESSAGE' });
    }, 5000);
  }
})

  const onCreate = (event) => {
    event.preventDefault()
    const content = event.target.anecdote.value
    event.target.anecdote.value = ''
    newAnecdoteMutation.mutate({ content, votes: 0 })
    console.log('new anecdote')
    
}

  return (
    <div>
      <h3>create new</h3>
      <form onSubmit={onCreate}>
        <input name='anecdote' />
        <button type="submit">create</button>
      </form>
    </div>
  )
}

export default AnecdoteForm
