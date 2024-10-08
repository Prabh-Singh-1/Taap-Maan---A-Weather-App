"use client"
import React from 'react'
import Link from 'next/link'
import { useState } from 'react'
import "./Navbar.css"
import { RiMenu2Line } from "react-icons/ri"; 
import { IoIosReturnLeft } from "react-icons/io";  



const Navbar = () => {
    const [isMoved, setIsMoved] = useState(true);

    function handleMobNav() {
        setIsMoved(!isMoved);
    }

    return (
        <>
           <div className="navbar text-white sm:flex sm:flex-row sm:px-16 flex flex-row justify-between items-center px-14 h-14">
                <div className='Logo font-semibold text-2xl'>
                    Taap Maan
                </div>
                <div className='nav-opt h-14 flex justify-center items-center'>
                    <div className='menu sm:hidden block cursor-pointer' onClick={handleMobNav}>
                    <RiMenu2Line className='text-3xl'/>
                    </div>
                    <div className='flex justify-center items-center h-14'>
                        <ul className='list-none h-full text-base sm:flex sm:flex-row sm:gap-7 hidden '>
                            <li className='h-14'><a href="#" className='flex justify-center items-center h-full'>Home</a></li>
                            <li className='h-full'><a href="#" className='flex justify-center items-center h-full'>Report Issue</a></li>
                            <li className='h-full'><a href="#" className='flex justify-center items-center h-full'>Report a Bug</a></li>
                        </ul>
                    </div>
                    <ul className='mob-nav z-10 text-white sm:hidden list-none text-lg gap-3 absolute  -top-96 flex flex-col sm:gap-8 px-8 py-6' name='mobNav' style={{ top: isMoved ? '-384px' : '0px', height: isMoved ? 'auto' : '100%', transition: 'all 0.3s', right: '0px' }}>
                        <li onClick={handleMobNav}><IoIosReturnLeft alt="return" className='cursor-pointer text-3xl' /></li>
                        <li><Link href='/'>Home</Link></li>
                        <li><Link href='/contact'>Contact</Link></li>
                        <li><Link href='/feedback'>Feedback</Link></li>

                    </ul>
                </div>
            </div>
        </>
    )
}

export default Navbar