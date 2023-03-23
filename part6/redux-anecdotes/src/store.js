import { configureStore } from '@reduxjs/toolkit'
import anecdoteService from './services/anecdotes'
import anecdoteReducer, { setAnecdotes } from './reducers/anecdoteReducer'
import filterReducer from './reducers/filterReducer'
import notificationReducer from './reducers/notificationReducer'

const store = configureStore({
    reducer: {
        notification: notificationReducer,
        anecdotes: anecdoteReducer,
        filter: filterReducer
    }
})

anecdoteService.getAll().then(anecdote =>
    store.dispatch(setAnecdotes(anecdote))
)

console.log(store.getState())

export default store