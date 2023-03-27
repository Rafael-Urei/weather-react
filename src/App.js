import './App.css';
import { useState } from 'react';
import Axios from 'axios';
import { FaWater, FaWind, FaSearch } from 'react-icons/fa';
import { MdLocationPin } from 'react-icons/md';
import Clouds from '../src/images/Clouds.svg'
import Rain from '../src/images/Rain.svg'
import Snow from '../src/images/Snow.svg'
import Clear from '../src/images/Clear.svg'
import e404 from '../src/images/404.png'

function App() {
  const keyAPI = '759cfcb95165cc62d6c9c35d0b11ca77';
  const [city, setCity] = useState('');
  const [position, setPosition] = useState([]);
  const [error, setError] = useState(false);
  const [weather, setWeather] = useState({
    name: '',
    windSpeed: '',
    humidity: '',
    temperature: '',
    weather: '',
    description: '',
    clicked: false,
  });

  function fetchData() {
    Axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${keyAPI}`)
      .then((res) => {
        const data = res.data;
        const { name } = data;
        const { humidity, temp: temperature } = data.main;
        const { main: weather, description} = data.weather[0];
        const { speed: windspeed } = data.wind;
        setWeather(() => {
          return {
            name: name,
            windSpeed: Math.floor(windspeed),
            humidity: humidity,
            temperature: temperature,
            weather: weather,
            description: description,
            clicked: true
          }
        })
      }).catch(e => {
        setError(() => {
          return true;
        })
      })
      setCity('');
      setError(false);
  }

  const getUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.watchPosition(userPosition);
    } else {
      console.log("Geolocation is not supported by your browser!")
    }
  };

  const userPosition = (position) => {
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;
    setPosition(() => {
      return [
        latitude,
        longitude
      ]
    })
  };

  getUserLocation();

  const fetchDataUserLocation = async (position) => {
    const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${position[0]}&lon=${position[1]}&appid=${keyAPI}`);
    const data = await response.json();
    setWeather(() => {
      return {
        name: data.name,
        windSpeed: data.wind.speed,
        humidity: data.main.humidity,
        temperature: data.main.temp,
        weather: data.weather[0].main,
        description: data.weather[0].description,
        clicked: true
      }
    })
  };

  const handleGetValue = (e) => {
    return setCity(e.target.value);
  };

  const handleWeather = () => {
    if (weather.weather === 'Clouds') return Clouds;
    if (weather.weather === 'Clear') return Clear;
    if (weather.weather === 'Rain') return Rain;
    if (weather.weather === 'Snow') return Snow;
  };

  return (
    <div className="App">
      <div className='background'>
        <div className={weather.clicked ? 'container2' : 'container'}>
          <div className='search-box'>
            <i className='md-location-pin' title='Use your own location!' onClick={() => fetchDataUserLocation(position)}><MdLocationPin/></i>
            <input type='text' placeholder='Enter your location' value={city} autoComplete='no' onChange={handleGetValue}></input>
            <button type='submit' onClick={() => fetchData()}><FaSearch/></button>
          </div>
          { error === true ? 
              <div className='not-found'>
                <img src={e404} alt='not-found'></img>
                <p>Oops! Invalid location.</p>
              </div>
              :
              <>
                <div className='weather-box'>
                  <img src={handleWeather()} alt='weather-representation'></img>
                  <p className='temperature'>{parseInt(weather.temperature - 273)}<span>°C</span></p>
                  <p className='description'>{weather.description}</p>
                </div>
                <div className='weather-details'>
                <div className='humidity'>
                  <i className='fa-water'><FaWater/></i>
                  <div className='text'>
                    <span>{`${weather.humidity}%`}</span>
                    <p>Humidity</p>
                  </div>
                </div>
                <div className='wind'>
                  <i className='fa-wind'><FaWind/></i>
                  <div className='text'>
                    <span>{`${weather.windSpeed}Km/h`}</span>
                    <p>Wind Speed</p>
                  </div>
                </div>
                </div>
              </>
          }
        </div>
      </div>
    </div>
  );
}

export default App;
