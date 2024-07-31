"use client"
import Navbar from "./components/Navbar";
import Image from "next/image";
import { useState } from "react";
import { FaSearch } from "react-icons/fa";
import { format, parse } from 'date-fns';
import sun from "@/public/img/sun.png"
import humid from '@/public/img/humidity.png'
import Wind from '@/public/img/Wind.png'
import '@/app/page.css'

export default function Home() {
  const [state, setState] = useState('')
  const [city, setcity] = useState('')
  const [temp, settemp] = useState('')
  const [humidity, sethumidity] = useState('')
  const [wind, setwind] = useState('')
  const [isvisible, setisvisible] = useState(false)
  const [error, seterror] = useState('')
  const [iserror, setiserror] = useState(false)

  const API_KEY = 'de88fef6c0c257a892aa56e488fd0e7e'

  async function getData() {

    const API_URL_CURR = `https://api.openweathermap.org/data/2.5/weather?&units=metric&q=${city}&appid=${API_KEY}`
    const API_URL_FORCAST = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}&units=metric`

    const response_current = await fetch(API_URL_CURR);
    var data_current = await response_current.json();
    const res_cast = await fetch(API_URL_FORCAST);
    var data_cast = await res_cast.json();
    if (!response_current.ok && !res_cast.ok) {
      seterror(data_current.message);
      setiserror(true)
    }
    else {
      setiserror(false)
      settemp(data_current.main.temp)
      setState(data_current.sys.country)
      sethumidity(data_current.main.humidity)
      setwind(data_current.wind.speed)
      setisvisible(true)
    }
    toggleVisibility();
  }

  const handleInputChange = (e) => {
    setcity(e.target.value);
    setisvisible(false);
  };

  const capitalizeFirstLetter = (string) => {
    if (typeof string !== 'string' || !string.length) return '';
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  const toggleVisibility = () => {
    setisvisible(true);
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      getData();
    }
  }

  function extractAndConvertTime(datetimeStr) {
    const timeStr = datetimeStr.split(' ')[1];
    const parsedTime = parse(timeStr, 'HH:mm:ss', new Date());
    return format(parsedTime, 'hh:mm a');
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
      {iserror ? (<div className="city text-2xl font-medium text-red-500 p-5 text-center">{capitalizeFirstLetter(error)}!</div>)
        : (<div>
          {isvisible && (
            <div>
              <main className="main m-5 rounded-lg flex flex-col justify-center items-center gap-2">
                <div className="logo my-4">
                  <Image src={sun} alt="sun" width={150} />
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




            </div>
          )}
        </div>)}
      <section className="today main m-5 rounded-lg p-3">

        <div className="text-center mb-2 text-2xl font-medium">Sunny condition expected around 12 PM</div>
        <hr />
        <div className="flex justify-around items-center py-2 px-12">
          <div className="flex flex-col justify-center items-center gap-2 py-1"><span className="text-xl">Now</span><span><Image src={sun} alt="sun" width={50} /></span><span className="text-xl">{temp}</span></div>
          <div className="flex flex-col justify-center items-center gap-2 py-1"><span className="text-xl">10AM</span><span><Image src={sun} alt="sun" width={50} /></span><span className="text-xl">40°</span></div>
          <div className="flex flex-col justify-center items-center gap-2 py-1"><span className="text-xl">10AM</span><span><Image src={sun} alt="sun" width={50} /></span><span className="text-xl">40°</span></div>
          <div className="flex flex-col justify-center items-center gap-2 py-1"><span className="text-xl">10AM</span><span><Image src={sun} alt="sun" width={50} /></span><span className="text-xl">40°</span></div>
        </div>
      </section>
      <section className="forcast main m-5 rounded-lg">
        <div className="py-2 px-4 text-xl font-medium">5-DAY FORECAST</div>
        <hr />
        <div className="flex flex-col sm:justify-around py-4 gap-5">
          <div className="flex flex-row justify-around items-center"><span className="text-xl font-medium">Sunday</span><span><Image src={sun} alt="sun" width={50} /></span><div className="flex flex-row justify-center items-center gap-1"><span className="text-xl">40°</span><span className="text-xl">min</span></div><div><span className="text-xl">45°</span><span className="text-xl">max</span></div></div>
          <hr />
          <div className="flex flex-row justify-around items-center"><span className="text-xl font-medium">Sunday</span><span><Image src={sun} alt="sun" width={50} /></span><div className="flex flex-row justify-center items-center gap-1"><span className="text-xl">40°</span><span className="text-xl">min</span></div><div><span className="text-xl">45°</span><span className="text-xl">max</span></div></div>
          <hr />
          <div className="flex flex-row justify-around items-center"><span className="text-xl font-medium">Sunday</span><span><Image src={sun} alt="sun" width={50} /></span><div className="flex flex-row justify-center items-center gap-1"><span className="text-xl">40°</span><span className="text-xl">min</span></div><div><span className="text-xl">45°</span><span className="text-xl">max</span></div></div>
          <hr />
          <div className="flex flex-row justify-around items-center"><span className="text-xl font-medium">Sunday</span><span><Image src={sun} alt="sun" width={50} /></span><div className="flex flex-row justify-center items-center gap-1"><span className="text-xl">40°</span><span className="text-xl">min</span></div><div><span className="text-xl">45°</span><span className="text-xl">max</span></div></div>
          <hr />
          <div className="flex flex-row justify-around items-center"><span className="text-xl font-medium">Sunday</span><span><Image src={sun} alt="sun" width={50} /></span><div className="flex flex-row justify-center items-center gap-1"><span className="text-xl">40°</span><span className="text-xl">min</span></div><div><span className="text-xl">45°</span><span className="text-xl">max</span></div></div>
        </div>
      </section>
    </>
  );
}
