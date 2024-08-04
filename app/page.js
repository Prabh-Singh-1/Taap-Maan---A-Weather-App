"use client";
import Navbar from "./components/Navbar";
import Image from "next/image";
import { useState } from "react";
import { FaSearch } from "react-icons/fa";
import Loader from "./components/loader";
import sun from "@/public/img/sun.png";
import humid from '@/public/img/humidity.png';
import Wind from '@/public/img/Wind.png';
import cloud from '@/public/img/cloud.png';
import few_cloud from '@/public/img/few_cloud.png';
import sun_shower from '@/public/img/sun-shower.png';
import rainImage from '@/public/img/heavy-rain.png';
import storm from '@/public/img/storm.png';
import snow from '@/public/img/snow.png';
import mist from '@/public/img/mist.png';
import clearSky from '@/public/videos/clear-sky.mp4';
import clouds_clip from '@/public/videos/clouds.mp4';
import few_clouds_clip from '@/public/videos/few-cloud.mp4';
import rain_clip from '@/public/videos/rain.mp4';
import snow_clip from '@/public/videos/snow.mp4';
import storm_clip from '@/public/videos/storm.mp4';


import '@/app/page.css';

export default function Home() {

  const [city, setCity] = useState('');
  const [description, setdescription] = useState('')
  const [isVisible, setIsVisible] = useState(false);
  const [error, setError] = useState('');
  const [isError, setIsError] = useState(false);
  const [loading, setLoading] = useState(true);
  const [filteredData, setFilteredData] = useState([]);
  const [processedData, setProcessedData] = useState([]);
  const [searched, setsearched] = useState(false);
  const [currdata, setcurrdata] = useState([]);

  const API_KEY = 'de88fef6c0c257a892aa56e488fd0e7e'
  const API_URL_CURR = `https://api.openweathermap.org/data/2.5/weather?&units=metric&q=${city}&appid=${API_KEY}`
  const API_URL_FORCAST = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}&units=metric`

  const convertTo12HourFormat = (time24) => {
    const [hour, minute] = time24.split(':');
    let hour12 = parseInt(hour) % 12 || 12;
    const ampm = parseInt(hour) >= 12 ? 'PM' : 'AM';
    return `${hour12}:${minute} ${ampm}`;
  };

  const getWeatherImage = (description) => {
    switch (description.toLowerCase()) {
      case 'clear sky':
        return sun;
      case 'few clouds':
        return few_cloud;
      case 'scattered clouds':
      case 'broken clouds':
        return cloud;
      case 'shower rain':
        return sun_shower;
      case 'rain':
        return rainImage;
      case 'thunderstorm':
        return storm;
      case 'snow':
        return snow;
      case 'mist':
        return mist;
      default:
        return sun;
    }
  };

  const getWeatherClip = (description) => {
    switch (description.toLowerCase()) {
      case 'clear sky':
        return '/videos/clear-sky.mp4';
      case 'few clouds':
        return few_clouds_clip;
      case 'scattered clouds':
      case 'broken clouds':
        return '/videos/clouds.mp4';
      case 'shower rain':
      case 'light rain':
      case 'rain':
        return '/videos/rain.mp4';
      case 'thunderstorm':
        return '/videos/storm.mp4';
      case 'snow':
        return '/videos/snow.mp4';
      default:
        return '/videos/clear-sky.mp4';
    }
  };
  

  async function getData() {
    setsearched(true);
    try {
      const response_current = await fetch(API_URL_CURR);
      var data_current = await response_current.json();
      const res_cast = await fetch(API_URL_FORCAST);
      var data_cast = await res_cast.json();

      if (!response_current.ok && !res_cast.ok) {
        setError(data_current.message);
        setError(data_cast.message);
        setIsError(true);
      } else {
        setdescription(data_current.weather[0].description)
        setcurrdata(data_current);
        setIsError(false);
        setIsVisible(true);

        const today = new Date().toISOString().split('T')[0]; // Get "YYYY-MM-DD" format
        const filtered = data_cast.list.filter(item => item.dt_txt.startsWith(today));
        setFilteredData(filtered);

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
    setsearched(false);
  };

  const capitalizeFirstLetter = (string) => {
    if (typeof string !== 'string' || !string.length) return '';
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  const toggleVisibility = () => {
    setIsVisible(true);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      getData();
      setsearched(true);
    }
  };

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
                      <Image src={getWeatherImage(description)} alt={description} width={150} height={150} />
                    </div>
                    <div className="hero flex flex-col gap-3">
                      <div className="temp text-6xl font-semibold">
                        {currdata.main.temp} °C
                      </div>
                      <div className="city text-4xl font-medium">
                        {capitalizeFirstLetter(currdata.name)}, {currdata.sys.country}
                      </div>
                    </div>
                    <div className="other w-full my-4 sm:px-16 flex flex-col sm:justify-around justify-between px-2 items-center sm:gap-1 gap-3">
                      <div className="flex justify-between items-center w-full py-1 px-6">

                        <div className="weather_dec flex flex-col justify-start">
                          <span>Description</span>
                          <span className="text-xl font-medium flex-wrap">
                            {capitalizeFirstLetter(currdata.weather[0].description)}
                          </span>

                        </div>
                        <div className="feel_like flex flex-col justify-center items-center">
                          <div className="">Feels Like</div>
                          <div className="flex flex-col justify-center items-center">
                            <span className="text-xl font-semibold ">
                              {currdata.main.feels_like} °C
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex justify-between items-center w-full py-1 px-2">
                        <div className="humdity flex justify-center items-center sm:gap-3 gap-1">
                          <Image src={humid} alt="Humidity" width={50} height={50} />
                          <div className="flex flex-col">
                            <span>Humidity</span>
                            <span className="text-xl font-semibold">
                              {currdata.main.humidity} %
                            </span>
                          </div>
                        </div>
                        <div className="wind flex justify-center items-center sm:gap-3 gap-1">
                          <Image src={Wind} alt="Wind" width={50} height={50} />
                          <div className="flex flex-col">
                            <span>Wind Speed</span>
                            <span className="text-xl font-semibold">
                              {currdata.wind.speed} km/h
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  

                
              </main>
              <section className="today sm:m-5 m-3 rounded-lg sm:p-3 p-0">
                <div className="text-center mb-2 text-2xl font-medium">
                  Today Forcasting
                </div>
                <hr />
                <div className="flex sm:justify-around justify-between items-center py-2 sm:px-12 px-3">
                  <div className="flex flex-col justify-center items-center gap-2 py-1">
                    <span className="text-xl">Now</span>
                    <span><Image src={sun} alt="sun" width={50} /></span>
                    <span className="text-xl">{currdata.main.temp}</span>
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

              <section className="forecast today sm:m-5 m-3 rounded-lg p-3">
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
            </div >
          )
          }
        </div >)}
    </>
  )
}
