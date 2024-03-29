import { useState, useEffect } from 'react'
import personService from './services/persons'
import axios from 'axios'

const Person = ({ person, removePerson }) => {
  return (
      <li>{person.name} {person.number} <button onClick={() => removePerson(person.id)}>Remove</button></li>
  )
}

const Notification = ({ message, type }) => {
  if (message === null) {
    return null
  }

  return (
    <div className={type}>
      {message}
    </div>
  )
}

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('');
  const [newNumber, setNewNumber] = useState('');
  const [filter, setFilter] = useState('');

  const [notifMessage, setNotifMessage] = useState('')
  const [messageType, setMessageType] = useState('')


  
  const hook =  () => {
    console.log('effect')
    axios
      .get('http://localhost:3001/api/persons')
      .then(response => {
        console.log('promise fulfilled');
        setPersons(response.data);
      }) .catch(error => {
        console.log('fail')
      })
  }
  useEffect(hook, [])
  
  console.log('render', persons.length, 'notes');

  let personsToShow = persons.filter(person => person.name.toString().toLowerCase().includes(filter.toString().toLowerCase()));

  useEffect(() => {
    personService
      .getAll()
      .then(initialPersons => {
        setPersons(initialPersons)
      })
  }, [])

  const addPerson = (event) => {
    event.preventDefault()

    const personObject = {
      name: newName,
      number: newNumber,
    }
    
    let existingPerson = persons.find(person => person.name === newName)

    if(persons.find(person => person.name === newName))
      {
        if (window.confirm(`'${existingPerson.name}' is already added to phonebook, replace the old number with a new one?`)) {
          personService.update(existingPerson.id, personObject).then(returnedPerson => {
            setPersons(persons.map(person => person.id === returnedPerson.id ? returnedPerson : person))

            setMessageType('success')
            setNotifMessage(
              `Updated '${newName}''s number`
            )
            setTimeout(() => {
              setNotifMessage(null)
            }, 5000).catch(error => {
              console.log('fail')
          })

            setNewName('');
            setNewNumber('');
        })
        }
        return
      } 
      
    personService
      .create(personObject)
      .then(returnedPerson => {
        setNewName('')
        setNewNumber('')
        console.log("returned person", returnedPerson)
        setPersons(persons.concat(returnedPerson))

        setMessageType('success')
        setNotifMessage(`Added '${newName}'`);
        setTimeout(() => {
          setNotifMessage(null)
        }, 5000);

      setNewName('');
      setNewNumber('');
      })
      .catch(error => {
        setMessageType('error');
        setNotifMessage(error.response.data.error);
        setTimeout(() => {
          setNotifMessage(null)
        }, 5000);
      })
}

  const removePerson = (id) => {
    let personToRemove = persons.find(person => person.id === id)
    if (window.confirm("Do you really want to delete contact?")) {
        console.log("delete", id)
        personService.remove(id).then(response => {
            setPersons(persons.filter(person => person.id !== id))

          setMessageType('success')
          setNotifMessage(
            `Removed '${personToRemove.name}'`
          )
          setTimeout(() => {
            setNotifMessage(null)
          }, 5000).catch(error => {
            console.log('fail')
        })

        }).catch(response => {
            setPersons(persons.filter(person => person.id !== id))
            console.log(response)
            
            if (response.response.status === 404) {
              setMessageType('error')
              setNotifMessage(
                  `${personToRemove.name} has already been removed`
              )
              setTimeout(() => {
                  setNotifMessage(null)
              }, 5000)
          }
        })
    }
  }

  const handleNameChange = (event) => {       
    setNewName(event.target.value)  
  }
  const handleNumberChange = (event) => {       
    setNewNumber(event.target.value);
  }
  const handleFilterChange = (event) => {       
    setFilter(event.target.value)  
  }

  return (
    <div>
      <h1>Phonebook</h1>

      <Notification message={notifMessage} type={messageType}/>

      <div>
        Filter shown with: <input 
          type="text"
          placeholder = "Filter phonebook"
          value={filter}
          onChange={handleFilterChange}
        />
      </div>

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
          <Person key={person.name} person={person} removePerson={removePerson}/>
        )}
      </ul>
    </div>
  )
}

export default App