/* eslint-disable prefer-destructuring */
import './style.css'
import preIcon from './barometer.png'
import humIcon from './humidity.png'


const apiKey = '4ed3d6272da9d1cf76394633f6ee93d1'
const weatherEndpoint = 'https://api.openweathermap.org/data/2.5/weather?'
const forecastEnpoint = 'https://api.openweathermap.org/data/2.5/onecall?'
const iconEndpoint = 'https://openweathermap.org/img/wn/'
const city = 'London'
const units = 'metric' // imperial, metric
const tempUnitSymbol = units === 'metric' ? 'C' : 'F'
const windUnitSymbol = units === 'metric' ? 'm/s' : 'mph'

// Helper functions
function parseDt(dt){
    const date = new Date(dt * 1000)
    const daysArr = ['sun','mon', 'tue', 'wed', 'thu', 'fri', 'sat']
    const monthsArr = ['jan','feb','mar','apr','may','jun','jul','aug','sep','oct','nov','dec']
    const dayStr = daysArr[date.getDay()]
    const monthStr = monthsArr[date.getMonth()]
    const day = date.getUTCDate()
    const month = date.getMonth()
    const year = date.getFullYear()
    const time = `${date.getHours().toString()  }:${  date.getMinutes().toString()}`
    
    const dateAndTime = `${monthStr.charAt(0).toUpperCase() + monthStr.slice(1)} ${day}, ${time}`
    const dateStr = `${dayStr.charAt(0).toUpperCase() + dayStr.slice(1)}, ${monthStr.charAt(0).toUpperCase() + monthStr.slice(1)} ${day}`
    return [dateAndTime, dateStr]
}

// -------------------------

async function getWeatherData(){
    const request = await fetch(`${weatherEndpoint}q=${city}&units=${units}&APPID=${apiKey}`)
    const data = await request.json()
    const main = data.weather[0].main
    const description = data.weather[0].description
    const icon = data.weather[0].icon
    const iconUrl = `${iconEndpoint + icon  }@2x.png`
    
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
    const date = parseDt(datetime)[0]

    // City Data
    const cityName = data.name
    const country = data.sys.country
    const lon = data.coord.lon
    const lat = data.coord.lat

    // Agregar al DOM
    // Datos Principales
    const divPrincipales = document.querySelector('.datosPrincipales')

        // Fecha
    const dateSpan = document.createElement('span')
    dateSpan.textContent = date

        // Ciudad, CC
    const cityH1 = document.createElement('h2')
    cityH1.textContent = `${cityName  }, ${  country}`

        // Icono y temperatura
    const pDiv = document.querySelector('.principalesCont')
    const iconImg = document.createElement('img')
    iconImg.src = iconUrl
    pDiv.appendChild(iconImg)
    const tempSpan = document.createElement('h1')
    tempSpan.textContent = `${Math.round(temp)}º${tempUnitSymbol}`
    pDiv.appendChild(tempSpan)

        // Descripción
    const descrSpan = document.createElement('span')
    descrSpan.id = 'weatherDescription'
    descrSpan.textContent = description.charAt(0).toUpperCase() + description.slice(1)

        // Appends al DOM
    divPrincipales.appendChild(dateSpan)
    divPrincipales.appendChild(cityH1)
    divPrincipales.appendChild(pDiv)
    divPrincipales.appendChild(descrSpan)

    // Datos secundarios
    const divSecundarios = document.querySelector('.datosSecundarios')
    
        // Presion
    const presText = document.createElement('span')
    presText.textContent = `Pressure ${presion} hPa`

        // Humedad
    const humText = document.createElement('span')
    humText.textContent = `Humidity ${humedad}%`

        // Nubosidad
    const nub = document.createElement('span')
    nub.textContent = `Cloudiness ${nubosidad}%`

        // Visibilidad
    const vis = document.createElement('span')
    vis.textContent = `Visibility ${Math.round(visibilidad/1000)} Km.`

        // Viento   
    const winDiv = document.createElement('div')
    winDiv.classList.toggle('datosViento')
    const vel = document.createElement('span')
    vel.textContent = `Wind ${windSpeed} ${windUnitSymbol}`
    winDiv.appendChild(vel)

        // Temperatura
    const tempDiv = document.createElement('div')
    tempDiv.classList.toggle('datosTemperatura')
    const flike = document.createElement('span')
    flike.textContent = `Feels like ${Math.round(sensTerm)}º${tempUnitSymbol}`
    tempDiv.appendChild(flike)
    const tempRange = document.createElement('span')
    tempRange.textContent = `Temperature ${Math.round(tempMin)} / ${Math.round(tempMax)} º${tempUnitSymbol}`
    tempDiv.appendChild(tempRange)


        // Appends al DOM
    divSecundarios.appendChild(presText)
    divSecundarios.appendChild(humText)
    divSecundarios.appendChild(nub)
    divSecundarios.appendChild(vis)
    divSecundarios.appendChild(winDiv)
    divSecundarios.appendChild(tempDiv)

    return [lon, lat]
}

async function getForecast(lon, lat){
    const request = await fetch(`${forecastEnpoint}lat=${lat}&lon=${lon}&exclude=current,minutely,hourly,alerts&units=${units}&APPID=${apiKey}`)
    const data = await request.json()

    const daily = data.daily
    daily.forEach(day => {
        const dateTime = day.dt
        const date = parseDt(dateTime)[1]
        const humidity = day.humidity
        const presion = day.pressure
        const minTemp = day.temp.min
        const maxTemp = day.temp.max

        const weatherDescription = day.weather[0].description
        const weatherIcon = day.weather[0].icon
        const iconUrl = `${iconEndpoint + weatherIcon  }.png`

        // DOM
        const container = document.querySelector('.forecast')
        const div = document.createElement('div')
        div.classList = 'tile'
        
        // Date
        const dateSpan = document.createElement('span')
        dateSpan.textContent = date

        // Icon
        const iconImg = document.createElement('img')
        iconImg.src = iconUrl

        // Description
        const descr = document.createElement('span')
        descr.textContent = `${weatherDescription.charAt(0).toUpperCase() + weatherDescription.slice(1)}`

        // Temperature, pressure and humidity
        const hpDiv = document.createElement('div')
        hpDiv.classList.toggle('atmosferic')
        const min = document.createElement('span')
        min.textContent = `Min: ${Math.round(minTemp)}º${tempUnitSymbol}`
        const max = document.createElement('span')
        max.textContent = `Max: ${Math.round(maxTemp)}º${tempUnitSymbol}`
        const hum = document.createElement('span')
        const hImg = document.createElement('img')
        hImg.classList.toggle('icon')
        hImg.src = humIcon
        hum.textContent = ` ${humidity}%`
        hum.insertBefore(hImg, hum.firstChild);
        const pre = document.createElement('span')
        const pImg = document.createElement('img')
        pImg.src = preIcon
        pImg.classList.toggle('icon')
        pre.textContent = ` ${presion} hPa`
        pre.insertBefore(pImg, pre.firstChild);
        

        hpDiv.appendChild(min)
        hpDiv.appendChild(max)
        hpDiv.appendChild(hum)
        hpDiv.appendChild(pre)

        // DOM appends
        div.appendChild(dateSpan)
        div.appendChild(iconImg)
        div.appendChild(descr)
        // div.appendChild(table)
        div.appendChild(hpDiv)
        container.appendChild(div)
    });
}

getWeatherData().then((coords) => {
    getForecast(coords[0], coords[1])
})

