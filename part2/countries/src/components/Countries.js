const Country = ({ country, weather }) => {
    return (
    <div>
        <h2>{country.name.common}</h2>
        capital {country.capital[0]}<br />
        area {country.area}<br /><br />
        <strong>languages:</strong>
        <ul>
            {Object.entries(country.languages).map(language => 
                <li key={language[0]} >{language[1]}</li>
            )}
        </ul>
        <img src={country.flags.png} alt={country.name.common + "'s flag"}></img>
        <h3>Weather in {country.capital[0]}</h3>
        <div>temperature {weather.current.temperature} Celsius</div>
        <img src={weather.current.weather_icons[0]} alt={country.capital[0] + "'s weather"}></img>
        <div>wind {weather.current.wind_speed} km/hr</div>
    </div>
)}


const Countries = ({ countries, showCountry, weather, getWeather }) => {
    if(countries.length > 10){
        return (
            <p>Too many matches, specify another filter</p>
        )
    }
    if(countries.length > 1){
        return (
            <div>
                {countries.map(country =>

                    <div key={country.name.official}>
                        {country.name.common}
                        <button onClick={() => showCountry(country)}>show</button>
                    </div>
                )}
            </div>
        )
    }
    if(countries.length === 1){
        return <Country country={countries[0]} weather={weather} />
    }
    return <div></div>
}

export default Countries