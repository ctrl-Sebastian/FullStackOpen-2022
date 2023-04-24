import React, { useState, useEffect } from 'react'
import Select from 'react-select';
import { useQuery, useMutation } from '@apollo/client'
import { ALL_AUTHORS, EDIT_AUTHOR } from '../queries'


const Authors = ({ notify }) => {
  const [born, setBorn] = useState('')
  const [selectedOption, setSelectedOption] = useState(null)

  const result = useQuery(ALL_AUTHORS)
  const [ changeBorn ] = useMutation(EDIT_AUTHOR, {
    refetchQueries: [ 
        { query: ALL_AUTHORS } 
      ]
  })

  const handleBornChange = async (event) => {
    event.preventDefault()
    const name = selectedOption.value
    changeBorn({  variables: { name, born } })

    setBorn('')
  }

  useEffect(() => {    
      if (result.data && result.data.editAuthor === null) {      
          notify('Author not found')    
        }  
    }, [result.data])  // eslint-disable-line 

  if (result.loading) {
    return <div>loading...</div>
  }
  
  const authors = result.data.allAuthors
  const selectAuthorOptions = authors.map((author) => (
    { value: author.name, label: author.name }
  ))

  return (
    <div>
      <h2>authors</h2>
      <table>
        <tbody>
          <tr>
            <th>name</th>
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
            Author
            <Select
              defaultValue={selectedOption}
              onChange={setSelectedOption}
              options={selectAuthorOptions}
            />
          </div>
          <div>
            Born
            <input
              type='number'
              value={born}
              onChange={ ({ target }) => setBorn(parseInt(target.value)) }
            />
          </div>
          <button type='submit'>change</button>
      </form>
      
    </div>
  )
}

export default Authors
