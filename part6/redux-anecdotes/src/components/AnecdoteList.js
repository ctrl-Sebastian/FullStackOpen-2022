import { useDispatch, useSelector } from 'react-redux'
import { vote } from '../reducers/anecdoteReducer'
import { setNotification } from '../reducers/notificationReducer'


const Anecdote = ({ anecdote }) => {
    const dispatch = useDispatch()

    const voteHandler = () => {
        dispatch(vote(anecdote.id))
        dispatch(setNotification(`You voted for '${anecdote.content}'`, 5))
    }

    return(
        <li>
            <div key={anecdote.id}>
                <div>
                    {anecdote.content}
                </div>
                <div>
                    has {anecdote.votes}
                    <button onClick={voteHandler}>vote</button>
                </div>
            </div>
        </li>
    )
}

const Anecdotes = () => {
    const anecdotes = useSelector(state => {
        return state.anecdotes.filter(anecdote => anecdote.content.includes(state.filter))
    })

    return(
        <div>
            <h2>Anecdotes</h2>
            <ul>
                {anecdotes.sort((b1, b2) => b2.votes - b1.votes).map(anecdote =>
                <Anecdote
                    key={anecdote.id}
                    anecdote={anecdote}
                />
                )}
            </ul>
        </div>
    )
}

export default Anecdotes