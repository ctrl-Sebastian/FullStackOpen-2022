import { useState, useEffect } from 'react'
import axios from 'axios'
const Person = ({ person }) => {
  return (
      <li>{person.name} {person.number}</li>
  )
}

const App = () => {
  const [persons, setPersons] = useState([
    { name: 'Arto Hellas', number: '040-123456', id: 1 },
    { name: 'Ada Lovelace', number: '39-44-5323523', id: 2 },
    { name: 'Dan Abramov', number: '12-43-234345', id: 3 },
    { name: 'Mary Poppendieck', number: '39-23-6423122', id: 4 }
  ])
  const [newName, setNewName] = useState('');
  const [newNumber, setNewNumber] = useState('');
  const [filter, setFilter] = useState(true);

  
  const hook =  () => {
    console.log('effect')
    axios
      .get('http://localhost:3001/persons')
      .then(response => {
        console.log('promise fulfilled');
        setPersons(response.data);
      })
  }
  useEffect(hook, [])
  
  console.log('render', persons.length, 'notes');

  let personsToShow = persons.filter(person => person.name.toString().toLowerCase().includes(filter.toString().toLowerCase()));

  const addPerson = (event) => {
    event.preventDefault()
    const personObject = {
      name: newName,
      number: newNumber,
    }
    
    if(persons.find(person => person.name === newName)){
      alert(`${newName} is already added to phonebook`)
    } else {
      setPersons(persons.concat(personObject))
      setNewName('')
      setNewNumber('')
    }
  }
  const handleNameChange = (event) => {       
    setNewName(event.target.value)  
  }
  const handleNumberChange = (event) => {       
    setNewNumber(event.target.value)  
  }
  const handleFilterChange = (event) => {       
    setFilter(event.target.value)  
  }

  return (
    <div>
      <h2>Phonebook</h2>

      <div>
        Filter shown with: <input 
          value={filter}
          onChange={handleFilterChange}
        />
      </div>

      <div>filter: {filter}</div>
      <div>newName: {newName}</div>
      <div>newNumber: {newNumber}</div>

      <h3>Add a new</h3>

      <form onSubmit={addPerson}>
        <div>
          name: <input 
            value={newName}
            onChange={handleNameChange}
            />
        </div>
        <div>
          number: <input 
            value={newNumber}
            onChange={handleNumberChange}
          />
        </div>
        <div>
          <button type="submit">add</button>
        </div>
      </form>

      <h3>Numbers</h3>
      <ul>
      {personsToShow.map(person => 
          <Person key={person.name} person={person} />
        )}
      </ul>
    </div>
  )
}

export default App