import { createSlice } from '@reduxjs/toolkit'
import blogService from '../services/blogs'

const initialState = []

const anecdoteSlice = createSlice({
    name: 'anecdotes',
    initialState,
    reducers: {
        vote(state, action) {
            const id = action.payload
            const anecdoteToChange = state.find(n => n.id === id)
            const changedAnecdote = { 
                ...anecdoteToChange, 
                votes: anecdoteToChange.votes + 1 
            }

            console.log(JSON.parse(JSON.stringify(state)))
            anecdoteService.updateAnecdote(id, changedAnecdote)

            return state.map(anecdote =>
                anecdote.id !== id ? anecdote : changedAnecdote
            )
        },
        appendAnecdote(state, action) {
            state.push(action.payload)
        },
        setAnecdotes(state, action) {
            return action.payload
        }
    }
})

export const { vote, appendAnecdote, setAnecdotes } = anecdoteSlice.actions

export const initializeAnecdotes = () => {
    return async dispatch => {
        const notes = await anecdoteService.getAll()
        dispatch(setAnecdotes(notes))
    }
}

export const createAnecdote = content => {
    return async dispatch => {
        const NewAnecdote = await anecdoteService.createNew(content)
        dispatch(appendAnecdote(NewAnecdote))
    }
}

export default anecdoteSlice.reducer