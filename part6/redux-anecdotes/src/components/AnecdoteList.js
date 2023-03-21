import { useDispatch, useSelector } from "react-redux"
import { addVoteTo } from "../reducers/anecdoteReducer"
import { setNotification, removeNotification } from "../reducers/notificationReducer"

const Anecdote = ({ anecdote, handleClick }) => {
  return (
    <div>
      <div>
        {anecdote.content}
      </div>
      <div>
        has {anecdote.votes}
        <button onClick={handleClick}>vote</button>
      </div>
    </div>
  )
}

const AnecdoteList = () => {
  const dispatch = useDispatch()
  const anecdotes = useSelector(({ filter, anecdotes }) => {
    return anecdotes.filter(
      anecdote => anecdote.content.toLowerCase().includes(filter.toLowerCase())
    )
  })

  const sortedAnecdotes = anecdotes.sort((a, b) => b.votes - a.votes)

  const voteAnecdote = (id, content) => {
    dispatch(addVoteTo(id))
    dispatch(setNotification(`you voted '${content}'`))
    setTimeout(() => {
      dispatch(removeNotification())
    }, 5000)
  }

  return (
    <div>
      {sortedAnecdotes.map(anecdote => 
        <Anecdote
          key={anecdote.id}
          anecdote={anecdote}
          handleClick={() =>
            voteAnecdote(anecdote.id, anecdote.content)
          }
        />
      )}
    </div>
  )
}

export default AnecdoteList