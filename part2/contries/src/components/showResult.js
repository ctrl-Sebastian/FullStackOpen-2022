import React from 'react'
import ShowWeather from './showWeather'

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
          <ShowWeather country={country}/>
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

export default ShowResults