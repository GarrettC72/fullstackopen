import { useState, useEffect } from 'react'
import Filter from './components/Filter'
import PersonForm from './components/PersonForm'
import Persons from './components/Persons'
import personService from './services/persons'
import Notification from './components/Notification'

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filter, setFilter] = useState('')
  const [errorMessage, setErrorMessage] = useState(null)
  const [isError, setIsError] = useState(false)

  useEffect(() => {
    personService
      .getAll()
      .then(initialPersons => {
        setPersons(initialPersons)
      })
  }, [])

  const handleNameChange = (event) => {
    setNewName(event.target.value)
  }

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value)
  }

  const handleFilterChange = (event) => {
    setFilter(event.target.value)
  }

  const addPerson = (event) => {
    event.preventDefault()

    const samePerson = persons.find(person => person.name === newName)
    if(samePerson !== undefined){
      if(window.confirm(`${newName} is already added to phonebook, replace the old number with a new one?`)){
        const changedPerson = { ...samePerson, number: newNumber}

        personService
          .update(samePerson.id, changedPerson)
          .then(returnedPerson => {
            setErrorMessage(
              `${returnedPerson.name}'s number is changed`
            )
            setTimeout(() => {
              setErrorMessage(null)
            }, 5000)
            setIsError(false)
            setPersons(persons.map(person => person.id !== samePerson.id ? person : returnedPerson))
            setNewName('')
            setNewNumber('')
          })
          .catch(error => {
            setErrorMessage(
              `Information of ${samePerson.name} has already been removed from server`
            )
            setTimeout(() => {
              setErrorMessage(null)
            }, 5000)
            setIsError(true)
            setPersons(persons.filter(person => person.id !== samePerson.id))
            setNewName('')
            setNewNumber('')
          })
      }
      return
    }

    const personObject = {
      name: newName,
      number: newNumber
    }

    personService
      .create(personObject)
      .then(returnedPerson => {
        setErrorMessage(
          `Added ${returnedPerson.name}`
        )
        setTimeout(() => {
          setErrorMessage(null)
        }, 5000)
        setIsError(false)
        setPersons(persons.concat(returnedPerson))
        setNewName('')
        setNewNumber('')
      })
  }

  const deletePerson = person => {
    if (window.confirm(`Delete ${person.name}?`)) {
      personService
        .deleteObject(person.id)
        .then(response => {
          setPersons(persons.filter(p => p.id !== person.id))
        })
    }
  }

  const personsToShow = filter.length === 0 ?
    persons : persons.filter(person => person.name.toLocaleLowerCase().indexOf(filter.toLocaleLowerCase()) !== -1)

  return (
    <div>
      <h2>Phonebook</h2>

      <Notification 
        message={errorMessage} 
        isError={isError}
      />
      
      <Filter 
        value={filter}
        onChange={handleFilterChange}
      />

      <h3>add a new</h3>
      
      <PersonForm
        onSubmit={addPerson}
        nameValue={newName}
        onNameChange={handleNameChange}
        numberValue={newNumber}
        onNumberChange={handleNumberChange}
      />

      <h3>Numbers</h3>
      
      <Persons 
        persons={personsToShow}
        deletePerson={deletePerson} 
      />
    </div>
  )
}

export default App