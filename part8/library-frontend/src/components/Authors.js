import { useState } from 'react'
import { gql, useQuery, useMutation } from '@apollo/client'

const ALL_AUTHORS = gql`
  query {
    allAuthors { 
      name
      born
      bookCount
    }
  }
`
const EDIT_AUTHOR = gql`
  mutation changeBorn($name: String, $born: Int!) {
    editAuthor(
      name: $name,
      setBornTo: $born
    ) {
      name
      born
    }
  }
`

const Authors = () => {
  const [name, setName] = useState('')
  const [born, setBorn] = useState('')

  const result = useQuery(ALL_AUTHORS)
  const [ changeBorn ] = useMutation(EDIT_AUTHOR)

  const handleBornChange = async (event) => {
    event.preventDefault()

    changeBorn({  variables: { name, born } })

    setName('')
    setBorn('')
  }

  if (result.loading) {
    return <div>loading...</div>
  }

  return (
    <div>
      <h2>authors</h2>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>born</th>
            <th>books</th>
          </tr>
          {result.data.allAuthors.map((a) => (
            <tr key={a.name}>
              <td>{a.name}</td>
              <td>{a.born}</td>
              <td>{a.bookCount}</td>
            </tr>
          ))}
        </tbody>
      </table>
        
        <hr></hr>

        <h2>Set birthyear</h2>
      <form onSubmit={handleBornChange}>
      <div>
          name
          <input
            value={name}
            onChange={({ target }) => setName(target.value)}
          />
        </div>

        <div>
          set born to:
          <input
            type="number"
            value={born}
            onChange={({ target }) => setBorn(Number(target.value))}
          />
        </div>

        <button type="submit">update author</button>
      </form>
      
    </div>
  )
}

export default Authors
