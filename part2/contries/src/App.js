import { useState, useEffect } from 'react'
import axios from 'axios'
import ShowResults from './components/showResult'

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