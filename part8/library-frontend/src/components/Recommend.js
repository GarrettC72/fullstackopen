import { useQuery } from "@apollo/client"

import { ALL_BOOKS, CURRENT_USER } from "../queries"

const Recommend = ({ show }) => {
  const currentUserResult = useQuery(CURRENT_USER)
  const recommendedBooksResult = useQuery(ALL_BOOKS, {
    skip: !currentUserResult.data,
    variables: { genre: currentUserResult.data?.me.favoriteGenre }
  })

  if (!show) {
    return null
  }

  if (currentUserResult.loading || recommendedBooksResult.loading) {
    return <div>loading...</div>
  }

  return (
    <div>
      <h2>recommendations</h2>

      <div>books in your favorite genre&nbsp;<strong>{currentUserResult.data.me.favoriteGenre}</strong></div>

      <table>
        <tbody>
          <tr>
            <th></th>
            <th>author</th>
            <th>published</th>
          </tr>
          {recommendedBooksResult.data.allBooks.map((a) => (
            <tr key={a.title}>
              <td>{a.title}</td>
              <td>{a.author.name}</td>
              <td>{a.published}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default Recommend