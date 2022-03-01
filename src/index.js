/* eslint-disable prefer-destructuring */
import './style.css'


const apiKey = '4ed3d6272da9d1cf76394633f6ee93d1'
const weatherEndpoint = 'http://api.openweathermap.org/data/2.5/weather?'
const iconEndpoint = 'https://openweathermap.org/img/wn/'
const city = 'Buenos Aires'
const units = 'metric'

async function getWeatherData(){
    const request = await fetch(`${weatherEndpoint}q=${city}&units=${units}&APPID=${apiKey}`)
    const data = await request.json()
    const main = data.weather[0].main
    const description = data.weather[0].description
    const icon = data.weather[0].icon
    const iconUrl = `${iconEndpoint + icon  }.png`
    
    // Datos temperatura
    const temp = data.main.temp
    const tempMin = data.main.temp_min
    const tempMax = data.main.temp_max
    const sensTerm = data.main.feels_like

    // Datos atmosfera
    const humedad = data.main.humidity
    const presion = data.main.pressure

    // Viento
    const windSpeed = data.wind.speed
    const windDirection = data.wind.deg

    // Nubes
    const nubosidad = data.clouds.all // en porcentual

    // Visibilidad
    const visibilidad = data.visibility

    // Datetime
    const datetime = data.dt

    // City Data
    const cityName = data.name
    const country = data.sys.country
}

getWeatherData()