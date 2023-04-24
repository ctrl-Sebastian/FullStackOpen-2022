import React, { useState, useEffect } from 'react'
import { useLazyQuery, useQuery  } from '@apollo/client'
import { ALL_BOOKS_WITH_GENRE, USER } from '../queries'

const Recommended = () => {
  const user = useQuery(USER)
  const [getFavoriteBooks, result] = useLazyQuery(ALL_BOOKS_WITH_GENRE)
  const [favoriteBooks, setFavoriteBooks] = useState([])

  useEffect(() => {
    if (result.data) {
      setFavoriteBooks(result.data.allBooks)
    }
  }, [setFavoriteBooks, result])

  useEffect(() => {
    if (user.data) {
      getFavoriteBooks({ variables: { genre: user.data.me.favoriteGenre } })
    }
  }, [getFavoriteBooks, user])

  if (user.loading)  {
    return <div>loading...</div>
  }


  return (
    <div>
      <p>
        books in your favorite genre <b>{user.data.me.favoriteGenre}</b>
      </p>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>author</th>
            <th>published</th>
          </tr>
          {favoriteBooks.map((a) => (
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

export default Recommended