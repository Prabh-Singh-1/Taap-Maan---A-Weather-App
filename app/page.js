"use client"
import Navbar from "./components/Navbar";
import Image from "next/image";
import { useState } from "react";
import sun from "@/public/img/sun.png"
import humid from '@/public/img/humidity.png'
import Wind from '@/public/img/Wind.png'
import Search from '@/app/svg/Search'
import '@/app/page.css'

export default function Home() {
  const [state, setState] = useState('')
  const [city, setcity] = useState('')
  const [temp, settemp] = useState('')
  const [humidity, sethumidity] = useState('')
  const [wind, setwind] = useState('')
  const [isvisible, setisvisible] = useState(false)

  const API_KEY = 'de88fef6c0c257a892aa56e488fd0e7e'

  async function getData() {
    toggleVisibility();
    const API_URL = `https://api.openweathermap.org/data/2.5/weather?&units=metric&q=${city}&appid=${API_KEY}`

    const response = await fetch(API_URL);
    var data = await response.json();
    settemp(data.main.temp)
    setState(data.sys.country)
    sethumidity(data.main.humidity)
    setwind(data.wind.speed)
    
  }

  const capitalizeFirstLetter = (string) => {
    if (typeof string !== 'string' || !string.length) return '';
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  const toggleVisibility = () => {
    setisvisible(!isvisible);
  };

  return (
    <>
      <nav>
        <Navbar />
      </nav>
      <div className="searchbar flex flex-row justify-center items-center my-2 gap-2">
        <input type="text" placeholder="Search city" onChange={(e) => setcity(e.target.value)} value={city} className="search rounded-3xl text-black px-3 py-2" />
        <button className="serch-btn" onClick={getData}>
          <Search />
        </button>
      </div>
      {isvisible &&
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
          <div className="other w-full my-4 sm:px-16 flex flex-row sm:justify-around justify-between px-4 items-center">
            <div className="humdity flex justify-center items-center gap-3">
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
            <div className="wind flex justify-center items-center gap-3">
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
      }
    </>
  );
}
