import { useDispatch, useSelector } from "react-redux"
import { addVoteTo } from "../reducers/anecdoteReducer"

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
  const anecdotes = useSelector(state => state)

  const sortedAnecdotes = anecdotes.sort((a, b) => b.votes - a.votes)

  return (
    <div>
      {sortedAnecdotes.map(anecdote => 
        <Anecdote
          key={anecdote.id}
          anecdote={anecdote}
          handleClick={() =>
            dispatch(addVoteTo(anecdote.id))
          }
        />
      )}
    </div>
  )
}

export default AnecdoteList