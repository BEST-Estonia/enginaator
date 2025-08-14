"use client";
import React from 'react'
import Image from 'next/image'
import HeroImage from '@/assets/hero-img.jpg';
import {useState, useEffect} from 'react';
import { FaCalendar } from "react-icons/fa";
import { FaLocationDot } from "react-icons/fa6";
import { IoPeopleSharp } from "react-icons/io5";
import { FaClock } from "react-icons/fa6";

const Hero = () => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const eventDate = new Date('April 17, 2026 00:00:00').getTime();
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = eventDate - now;

      if (distance < 0) {
        clearInterval(timer);

        return;
      }

      setTimeLeft({
        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((distance % (1000 * 60)) / 1000)
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [])
  return (
    <div className='relative w-full h-full'>

      <div className="relative w-full h-[800px]">
        <Image 
          src={HeroImage}
          alt='Hero background'
          className='w-full h-full object-cover object-center'
          fill
        />
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-black opacity-50"></div>
      </div>

      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <h1 className='text-white text-4xl font-medium mt-4 mb-7'>
          17-20 APRILL 2025
        </h1>
        <h2 className='text-white text-7xl font-bold drop-shadow-lg text-center'>
          ÜLE-EESTILINE INSENERIVÕISTLUS
        </h2>

        {/*Countdown timer*/}
        <div className="flex justify-center gap-12 mt-16">
          <div className="flex flex-col items-center">
            <span className="text-white text-6xl font-bold">{timeLeft.days}</span>
            <span className="text-white text-sm uppercase mt-1">päeva</span>
          </div>

          <div className="flex flex-col items-center">
            <span className="text-white text-6xl font-bold">{timeLeft.hours}</span>
            <span className="text-white text-sm uppercase mt-1">tundi</span>
          </div>

          <div className="flex flex-col items-center">
            <span className="text-white text-6xl font-bold">{timeLeft.minutes}</span>
            <span className="text-white text-sm uppercase mt-1">minutid</span>
          </div>

          <div className="flex flex-col items-center">
            <span className="text-white text-6xl font-bold">{timeLeft.seconds}</span>
            <span className="text-white text-sm uppercase mt-1">sekundit</span>
          </div>
        </div>

        {/* The red part at the end, which includes some information */}
        <div className="absolute bottom-4 left-0 right-0 flex justify-center">
          <div className="bg-red-700 rounded-full px-10 py-3 flex items-center justify-between w-[700px] max-w-[90%]">
            <div className="flex items-center gap-2 text-white">
              <FaCalendar className="text-xl" />
              <span>17-20. aprill 2026</span>
            </div>
            
            <div className="flex items-center gap-2 text-white">
              <FaLocationDot className="text-xl" />
              <span>TalTech</span>
            </div>
            
            <div className="flex items-center gap-2 text-white">
              <IoPeopleSharp className="text-xl" />
              <span>Insenerihuvilistele noored</span>
            </div>
            
            <div className="flex items-center gap-2 text-white">
              <FaClock className="text-xl" />
              <span>4 päeva</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Hero
