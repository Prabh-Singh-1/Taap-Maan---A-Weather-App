"use client"
import Navbar from "./components/Navbar";
import Image from "next/image";
import { useState } from "react";
import { FaSearch } from "react-icons/fa";
import Loader from "./components/loader";
import sun from "@/public/img/sun.png"
import humid from '@/public/img/humidity.png'
import Wind from '@/public/img/Wind.png'
import cloudsImage from '@/public/img/cloudy.png'
import LightRain from '@/public/img/cloudy_rain.png'
import rainImage from '@/public/img/heavy-rain.png'
import '@/app/page.css'

export default function Home() {
  const [state, setState] = useState('')
  const [city, setCity] = useState('')
  const [temp, setTemp] = useState('')
  const [today_dis, settoday_dis] = useState('')
  const [humidity, setHumidity] = useState('')
  const [wind, setWind] = useState('')
  const [isVisible, setIsVisible] = useState(false)
  const [error, setError] = useState('')
  const [isError, setIsError] = useState(false)
  const [loading, setLoading] = useState(true);
  const [filteredData, setFilteredData] = useState([]);
  const [processedData, setProcessedData] = useState([]);
  const [searched, setsearched] = useState(false);

  const API_KEY = 'de88fef6c0c257a892aa56e488fd0e7e'
  const API_URL_CURR = `https://api.openweathermap.org/data/2.5/weather?&units=metric&q=${city}&appid=${API_KEY}`
  const API_URL_FORCAST = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}&units=metric`

  const convertTo12HourFormat = (time24) => {
    const [hour, minute] = time24.split(':');
    let hour12 = parseInt(hour) % 12 || 12; // Convert 24 hour to 12 hour
    const ampm = parseInt(hour) >= 12 ? 'PM' : 'AM';
    return `${hour12}:${minute} ${ampm}`;
  };

  const getWeatherImage = (description) => {
    switch (description.toLowerCase()) {
      case 'clear sky':
      case 'sunny':
        return sun;
      case 'broken clouds':
      case 'clouds':
        return cloudsImage;
      case 'light rain':
        return LightRain;
      case 'rain':
        return rainImage;
      default:
        return sun; // default image if no match is found
    }
  };

  async function getData() {
    setsearched(true)
    try {
      const response_current = await fetch(API_URL_CURR);
      var data_current = await response_current.json();
      const res_cast = await fetch(API_URL_FORCAST);
      var data_cast = await res_cast.json();

      if (!response_current.ok && !res_cast.ok) {
        setError(data_current.message);
        setError(data_cast.message);
        setIsError(true)
      } else {
        setIsError(false)
        settoday_dis(data_current.weather[0].description);
        setTemp(data_current.main.temp)
        setState(data_current.sys.country)
        setHumidity(data_current.main.humidity)
        setWind(data_current.wind.speed)
        setIsVisible(true)

        const today = new Date().toISOString().split('T')[0]; // Gets "YYYY-MM-DD" format
        const filtered = data_cast.list.filter(item => item.dt_txt.startsWith(today));
        setFilteredData(filtered)

        const otherDaysData = data_cast.list.filter(item => !item.dt_txt.startsWith(today));

        // Process the forecast data to get min and max temperatures for each day
        const processedData = otherDaysData.reduce((acc, item) => {
          const date = item.dt_txt.split(' ')[0];
          if (!acc[date]) {
            acc[date] = { min: item.main.temp_min, max: item.main.temp_max, day: new Date(date).toLocaleDateString('en-US', { weekday: 'long' }), description: item.weather[0].description };
          } else {
            acc[date].min = Math.min(acc[date].min, item.main.temp_min);
            acc[date].max = Math.max(acc[date].max, item.main.temp_max);
          }
          return acc;
        }, {});

        const processedArray = Object.entries(processedData).map(([date, { min, max, day, description }]) => ({
          date, min, max, day, description
        }));

        setProcessedData(processedArray);
        
      }
    } finally {
      setLoading(false);
      toggleVisibility();
    }
  }

  const handleInputChange = (e) => {
    setCity(e.target.value);
    setIsVisible(false);
    setsearched(false)
  };

  const capitalizeFirstLetter = (string) => {
    if (typeof string !== 'string' || !string.length) return '';
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  const toggleVisibility = () => {
    setIsVisible(true);
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      getData();
      setsearched(true);
    }
  }

  return (
    <>
      <nav>
        <Navbar />
      </nav>
      <div className="searchbar flex flex-row justify-center items-center my-2 gap-2">
        <input type="text" placeholder="Search city" onChange={handleInputChange} onKeyDown={handleKeyPress} value={city} className="search rounded-3xl text-black px-3 py-2" />
        <button className="serch-btn" onClick={getData}>
          <FaSearch className="text-2xl" />
        </button>
      </div>  
      {loading && <Loader />}
      {!searched && (
        <div className="default-screen text-center text-xl font-bold">
              Search your City or Country to check Weather Forcast.
        </div>
      )}
      {isError ? (<div className="city text-2xl font-medium text-red-500 p-5 text-center">{capitalizeFirstLetter(error)}!</div>)
        : (<div>
          {isVisible && (
            <div>
              <main className="main sm:m-5 m-3 rounded-lg flex flex-col justify-center items-center gap-2">
                
                <div className="logo my-4 -mr-10">
                <Image src={getWeatherImage(today_dis)} alt={today_dis} width={150} />
                </div>
                <div className="hero flex flex-col gap-3">
                  <div className="temp text-6xl font-semibold">
                    {temp} °C
                  </div>
                  <div className="city text-4xl font-medium">
                    {capitalizeFirstLetter(city)}, {state}
                  </div>
                </div>
                <div className="other w-full my-4 sm:px-16 flex flex-row sm:justify-around justify-between px-2 items-center">
                  <div className="humdity flex justify-center items-center sm:gap-3 gap-1">
                    <Image src={humid} alt="humidity" className="w-12" />
                    <div className="flex flex-col justify-start">
                      <span className="text-xl font-semibold ">
                        {humidity}
                      </span>
                      <span className="text-lg font-medium">
                        Humidity
                      </span>
                    </div>
                  </div>
                  <div className="wind flex justify-center items-center sm:gap-3 gap-1">
                    <Image src={Wind} alt="wind" className="w-12" />
                    <div className="flex flex-col justify-start">
                      <span className="text-xl font-semibold">
                        {wind}
                      </span>
                      <span className="text-lg font-medium">
                        Wind speed
                      </span>
                    </div>
                  </div>
                </div>
              </main>

              <section className="today main sm:m-5 m-3 rounded-lg sm:p-3 p-0">
                <div className="text-center mb-2 text-2xl font-medium">
                  Today Forcasting
                </div>
                <hr />
                <div className="flex sm:justify-around justify-between items-center py-2 sm:px-12 px-3">
                  <div className="flex flex-col justify-center items-center gap-2 py-1">
                    <span className="text-xl">Now</span>
                    <span><Image src={sun} alt="sun" width={50} /></span>
                    <span className="text-xl">{temp}</span> 
                  </div>
                  {filteredData.slice(-3).map((item, index) => (
                    <div key={index} className="flex flex-col justify-center items-center gap-2 py-1">
                      <span className="text-xl">
                        {convertTo12HourFormat(item.dt_txt.split(' ')[1])}
                      </span>
                      <span><Image src={getWeatherImage(item.weather[0].description)} alt={item.weather[0].description} width={50} /></span>
                      <span className="text-xl">{item.main.temp}</span>
                    </div>
                  ))}
                </div>
              </section>

              <section className="forecast main sm:m-5 m-3 rounded-lg p-3">
                {processedData.map((item, index) => (
                  <div key={index}>
                    
                    <div className="flex flex-row justify-around items-center py-4 gap-5">
                      <span className="text-xl sm:text-lg sm:font-medium font-normal max-w-20">{item.day}</span>
                      <span><Image src={getWeatherImage(item.description)} alt={item.description} width={50} /></span>
                      <div className="flex sm:flex-row flex-col justify-center items-center gap-2">
                        <span className="sm:text-xl text-sm ">{item.min}°C</span>
                        <span className="sm:text-xl text-sm">min</span>
                      </div>
                      <div className="flex sm:flex-row flex-col justify-center items-center gap-2">
                        <span className="sm:text-xl text-sm">{item.max}°C</span>
                        <span className="sm:text-xl text-sm">max</span>
                      </div>
                    </div>
                    <hr />
                  </div>
                ))}
              </section>
            </div>
          )}
        </div>)}
    </>
  );
}
