import React, { useState, useEffect } from 'react'
import axios from 'axios'

const api_key = process.env.REACT_APP_API_KEY

const ShowWeather = ({country}) => {
    const [ weather, setWeather ] = useState({})

    useEffect(() => {
        axios
        .get(`http://api.weatherstack.com/current?access_key=${api_key}&query=${country.name.common}`)
        .then(res => setWeather(res.data)) 
    }, [country])

    return (
        <>
            <h1>Weather in {country.name.common}</h1>
            <div><b>Temperature:</b> {weather.current?.temperature} Celcius</div>
            <img src={weather.current?.weather_icons[0]} alt={weather.current?.weather_descriptions[0]}/>
            <div><b>wind:</b> {weather.current?.wind_speed} mph direction {weather.current?.wind_dir}</div>
        </>
    )
}

export default ShowWeather