/* eslint-disable no-use-before-define */
/* eslint-disable prefer-destructuring */
import './style.css'
import preIcon from './barometer.png'
import humIcon from './humidity.png'
import triangle from './triangle.svg'
import tabIcon from './nublado.png'
import temperatureIcon from './temp.png'


const apiKey = '4ed3d6272da9d1cf76394633f6ee93d1'
const weatherEndpoint = 'https://api.openweathermap.org/data/2.5/weather?'
const forecastEnpoint = 'https://api.openweathermap.org/data/2.5/onecall?'
const iconEndpoint = 'https://openweathermap.org/img/wn/'
let city = 'Buenos Aires, AR'
let units = 'metric' // imperial, metric
const error = document.querySelector('#errorMsg')

const weatherBtn = document.querySelector('#getWeaterButton')
weatherBtn.addEventListener('click', changeCity)

const cityInput = document.querySelector('#city')
cityInput.addEventListener('click', () => {cityInput.select()})

let options = document.querySelectorAll('.option')
options = Array.from(options)
options.forEach(option => {
    option.addEventListener('click', () => {
        units = option.id
        options.forEach(op => {
            if(op.id === units) {
                op.classList.add('selected')        
            }
            else{op.classList.remove('selected')}
        });
        option.classList.add('selected')
        getWeatherData().then((coords) => {
            getForecast(coords[0], coords[1])
        })
    })
});

const iconLink = document.querySelector('#icon')
iconLink.href = tabIcon

// Helper functions
function parseDt(dt, deltaHours){
    const date = new Date(dt * 1000)
    const daysArr = ['sun','mon', 'tue', 'wed', 'thu', 'fri', 'sat']
    const monthsArr = ['jan','feb','mar','apr','may','jun','jul','aug','sep','oct','nov','dec']
    const dayStr = daysArr[date.getDay()]
    const monthStr = monthsArr[date.getMonth()]
    const day = date.getUTCDate()
    const hours = (date.getUTCHours() + deltaHours) % 24
    const time = `${hours.toString().padStart(2)  }:${  date.getMinutes().toString().padStart(2,'0')}`
    
    const dateAndTime = `${monthStr.charAt(0).toUpperCase() + monthStr.slice(1)} ${day}, ${time}`
    const dateStr = `${dayStr.charAt(0).toUpperCase() + dayStr.slice(1)}, ${monthStr.charAt(0).toUpperCase() + monthStr.slice(1)} ${day}`
    return [dateAndTime, dateStr]
}

function changeCity() {
    city = cityInput.value
    getWeatherData().then((coords) => {
        getForecast(coords[0], coords[1])
    }).catch(() => {
        error.textContent = 'City not found, try again'
        error.classList.add('active')
    })   
}

document.addEventListener('load', getWeatherData().then((coords) => {
    getForecast(coords[0], coords[1])
}) )

// -------------------------

async function getWeatherData(){
    const request = await fetch(`${weatherEndpoint}q=${city}&units=${units}&APPID=${apiKey}`)
    const data = await request.json()
    const description = data.weather[0].description
    const icon = data.weather[0].icon
    const iconUrl = `${iconEndpoint + icon  }@2x.png`
    const tempUnitSymbol = units === 'metric' ? 'C' : 'F'
    const windUnitSymbol = units === 'metric' ? 'm/s' : 'mph'
    
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
    const timezoneShift = data.timezone/3600
    const date = parseDt(datetime, timezoneShift)[0]

    // City Data
    const cityName = data.name
    const country = data.sys.country
    const lon = data.coord.lon
    const lat = data.coord.lat

    // Agregar al DOM
    // Datos Principales
    const divPrincipales = document.querySelector('.datosPrincipales')
    while (divPrincipales.firstChild) {
        divPrincipales.firstChild.remove()
    }

        // Fecha
    const dateSpan = document.createElement('span')
    dateSpan.textContent = date

        // Ciudad, CC
    const cityH1 = document.createElement('h2')
    cityH1.classList.toggle('cityTitle')
    cityH1.textContent = `${cityName  }, ${  country}`

        // Icono y temperatura
    const pDiv = document.createElement('div')
    pDiv.classList.toggle('principalesCont')
    const iconImg = document.createElement('img')
    iconImg.src = iconUrl
    pDiv.appendChild(iconImg)
    const tempSpan = document.createElement('h1')
    tempSpan.textContent = `${Math.round(temp)}º${tempUnitSymbol}`
    pDiv.appendChild(tempSpan)

        // Descripción
    const descrSpan = document.createElement('div')
    descrSpan.id = 'weatherDescription'
    descrSpan.textContent = description.charAt(0).toUpperCase() + description.slice(1)

        // Appends al DOM
    divPrincipales.appendChild(dateSpan)
    divPrincipales.appendChild(cityH1)
    divPrincipales.appendChild(pDiv)
    divPrincipales.appendChild(descrSpan)

    // Datos secundarios
    const divSecundarios = document.querySelector('.datosSecundarios')
    while (divSecundarios.firstChild) {
        divSecundarios.firstChild.remove()
    }
    
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
    const windDir = document.createElement('img')
    windDir.src = triangle
    windDir.classList.toggle('windIcon')
    windDir.style.transform = `rotate(${-windDirection}deg)`
    const vel = document.createElement('span')
    vel.style.paddingRight = '0.5rem'
    vel.textContent = `Wind ${windSpeed} ${windUnitSymbol}`

    winDiv.appendChild(vel)
    winDiv.appendChild(windDir)

        // Temperatura
    const tempDiv = document.createElement('div')
    tempDiv.classList.toggle('datosTemperatura')
    const tempRange = document.createElement('span')
    tempRange.textContent = `Temperature ${Math.round(tempMin)} / ${Math.round(tempMax)} º${tempUnitSymbol}`
    tempDiv.appendChild(tempRange)
    const flike = document.createElement('span')
    flike.textContent = `Feels like ${Math.round(sensTerm)}º${tempUnitSymbol}`
    tempDiv.appendChild(flike)
    


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
    const tempUnitSymbol = units === 'metric' ? 'C' : 'F'

    const container = document.querySelector('.forecast')
    while (container.firstChild) {
        container.firstChild.remove()
    }

    const daily = data.daily.slice(1)

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
        const temp = document.createElement('span')
        const tempIcon = document.createElement('img')
        tempIcon.src = temperatureIcon
        tempIcon.classList.toggle('icon')
        temp.textContent = ` ${Math.round(minTemp)} - ${Math.round(maxTemp)} º${tempUnitSymbol}`
        temp.insertBefore(tempIcon, temp.firstChild);
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
        

        hpDiv.appendChild(temp)
        hpDiv.appendChild(hum)
        hpDiv.appendChild(pre)

        // DOM appends
        div.appendChild(dateSpan)
        div.appendChild(iconImg)
        div.appendChild(descr)
        div.appendChild(hpDiv)
        container.appendChild(div)
        error.textContent = ''
        error.classList.remove('active')
    });
}


