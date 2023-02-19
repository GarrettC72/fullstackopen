import { useState, useEffect } from 'react'
import QueryForm from './components/QueryForm'
import Countries from './components/Countries'
import axios from 'axios'

const App = () => {
  const [countries, setCountries] = useState([])
  const [currentCountries, setCurrentCountries] = useState([])
  const [query, setQuery] = useState('')
  const [weather, setWeather] = useState({current: {
    temperature: 0,
    weather_icons: ["https://assets.weatherstack.com/images/wsymbols01_png_64/wsymbol_0001_sunny.png"],
    wind_speed: 0
  }})

  useEffect(() => {
    axios
      .get('https://restcountries.com/v3.1/all')
      .then(response => {
        setCountries(response.data)
        setCurrentCountries(response.data)
      })
  }, [])

  const handleQueryChange = (event) => {
    const countriesFiltered = countries.filter(country => country.name.common.toLocaleLowerCase().indexOf(event.target.value.toLocaleLowerCase()) !== -1)
    setQuery(event.target.value)
    setCurrentCountries(countries)
    
    if(countriesFiltered.length === 1){
      getWeather(countriesFiltered[0])
    }
  }

  const showCountry = (country) => {
    setCurrentCountries([country])
    getWeather(country)
  }

  const getWeather = (country) => {
    axios
      .get(`http://api.weatherstack.com/current?access_key=${process.env.REACT_APP_API_KEY}&query=${country.capital[0]}&units=m`)
      .then(response => {
        setWeather(response.data)
      })
  }

  const countriesToShow = query.length === 0 ?
  currentCountries : currentCountries.filter(country => country.name.common.toLocaleLowerCase().indexOf(query.toLocaleLowerCase()) !== -1).sort((a, b) => a.name.common.localeCompare(b.name.common))

  return (
    <div>
      <QueryForm 
        value={query} 
        onChange={handleQueryChange} 
      />
      <Countries 
      countries={countriesToShow} 
      showCountry={showCountry} 
      weather={weather}
      getWeather={getWeather}
      />
    </div>
  )
}

export default App
