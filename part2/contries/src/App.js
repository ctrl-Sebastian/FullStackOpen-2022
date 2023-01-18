import { useState, useEffect } from 'react'
import axios from 'axios'

const ShowResults = ({countriesToShow, setFilter}) => {
  if (countriesToShow.length === 1){
    const country = countriesToShow[0];
    return(
      <div>
        <h1>{country.name.common}</h1>
        <p>Capital: {country.capital}</p>
        <p>Area: {country.area}</p>

        <h2>Languages:</h2>
          <ul>
            {Object.values(country.languages).map((language) => <li key={language}>{language}</li>)}
          </ul>
        
        <img src={country.flags.svg} alt={country.name.common} width='25%'/>
      </div>
    )
  } 
  if (countriesToShow.length > 10) return <div><h3>Too many matches, specify another filter</h3></div>
  return countriesToShow.map(country => {
    return (
      <div key={country.name.common}>
        <h3>{country.name.common}</h3>
        <button value={country.name.common} onClick={(event) => setFilter(event.target.value)}>Show</button>
      </div>
    )
  })
}

const App = () => {
  const [countries, setCountries] = useState([])
  const [filter, setFilter] = useState('');

  
  const hook =  () => {
    console.log('effect')
    axios
      .get('https://restcountries.com/v3.1/all')
      .then(response => {
        console.log('promise fulfilled');
        setCountries(response.data);
      })
  }
  useEffect(hook, [])
  console.log('rendered', countries.length, 'countries');

  let countriesToShow = countries.filter(country => country.name.common.toString().toLowerCase().includes(filter.toString().toLowerCase()));
  const handleFilterChange = (event) => {       
    setFilter(event.target.value)  
  }

  return (
    <div>
      <h1>Countries</h1>

      <div>
        Filter shown with: <input 
          type="text"
          placeholder="Search for a country..."
          value={filter}
          onChange={handleFilterChange}
        />
      </div>

    <ShowResults countriesToShow={countriesToShow} setFilter={setFilter}/>
    </div>
  )
}

export default App