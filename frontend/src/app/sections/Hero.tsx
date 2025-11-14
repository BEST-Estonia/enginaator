"use client";
import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import HeroImageStatic from '@/assets/hero-img.jpg';
import { FaCalendar } from "react-icons/fa";
import { FaLocationDot } from "react-icons/fa6";
import { IoPeopleSharp } from "react-icons/io5";
import { FaClock } from "react-icons/fa6";

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export interface HeroProps {
  dateText: string;
  mainTitle: string;
  eventDate: string;
  backgroundImage?: string;
  eventDateInfo: string;
  location: string;
  audience: string;
  duration: string;
}

const Hero: React.FC<Partial<HeroProps>> = (props) => {
  const [heroData, setHeroData] = useState<HeroProps>({
    dateText: "17-20 APRILL 2025",
    mainTitle: "ÜLE-EESTILINE INSENERIVÕISTLUS",
    eventDate: "April 17, 2026 00:00:00",
    backgroundImage: "",
    eventDateInfo: "17-20. aprill 2026",
    location: "TalTech",
    audience: "Insenerihuvilistele noortele",
    duration: "4 päeva"
  });
  
  const [isLoading, setIsLoading] = useState(!Object.keys(props).length);
  const [imageError, setImageError] = useState(false);
  
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  // Fetch hero data if no props are passed (on homepage)
  useEffect(() => {
    // If props are passed (preview mode in admin), use those instead of fetching
    if (Object.keys(props).length > 0) {
      setHeroData({...heroData, ...props});
      return;
    }
    
    async function fetchData() {
      setIsLoading(true);
      try {
        const res = await fetch(`${API_URL}/hero`);
        const data = await res.json();
        if (data.success && data.data) {
          setHeroData(data.data);
        }
      } catch (error) {
        console.error("Failed to fetch hero data:", error);
        // Keep default data on error
      } finally {
        setIsLoading(false);
      }
    }
    
    fetchData();
  }, [props]);

  useEffect(() => {
    const eventDateTs = new Date(heroData.eventDate).getTime();
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = eventDateTs - now;

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
  }, [heroData.eventDate]);

  // Improved image source selection with better fallback
  const getImageSource = () => {
    // If image error occurred or no background image is set, use the static import
    if (imageError || !heroData.backgroundImage) {
      return HeroImageStatic;
    }

    return heroData.backgroundImage;
  };

  return (
    <div id="hero" className='relative w-full h-full'>
      <div className="relative w-full h-[800px]">
        <Image 
          src={getImageSource()}
          alt='Hero background'
          className='w-full h-full object-cover object-center'
          fill
          priority
          onError={() => setImageError(true)}
        />
        <div className="absolute inset-0 bg-black opacity-50"></div>
      </div>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <h1 className='text-white text-4xl font-medium mt-4 mb-7'>{heroData.dateText}</h1>
        <h2 className='text-white text-xl sm:text-3xl md:text-5xl lg:text-7xl font-bold drop-shadow-lg text-center'>{heroData.mainTitle}</h2>
        <div className="flex justify-center gap-12 mt-16">
          <div className="flex flex-col items-center">
            <span className="text-white text-2xl sm:text-3xl md:text-5xl lg:text-7xl font-bold">{timeLeft.days}</span>
            <span className="text-white text-sm uppercase mt-1">päeva</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-white text-2xl sm:text-3xl md:text-5xl lg:text-7xl font-bold">{timeLeft.hours}</span>
            <span className="text-white text-sm uppercase mt-1">tundi</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-white text-2xl sm:text-3xl md:text-5xl lg:text-7xl font-bold">{timeLeft.minutes}</span>
            <span className="text-white text-sm uppercase mt-1">minutid</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-white text-2xl sm:text-3xl md:text-5xl lg:text-7xl font-bold">{timeLeft.seconds}</span>
            <span className="text-white text-sm uppercase mt-1">sekundit</span>
          </div>
        </div>

        <div className="absolute bottom-4 left-0 right-0 flex justify-center">
          <div className="bg-red-700 rounded-full px-10 py-3 flex flex-col sm:flex-row items-center justify-between gap-2 w-[700px] max-w-[90%]">
            <div className="flex items-center gap-2 text-white">
              <FaCalendar className="text-xl" />
              <span>{heroData.eventDateInfo}</span>
            </div>
            <div className="flex items-center gap-2 text-white">
              <FaLocationDot className="text-xl" />
              <span>{heroData.location}</span>
            </div>
            <div className="flex items-center gap-2 text-white">
              <IoPeopleSharp className="text-xl" />
              <span>{heroData.audience}</span>
            </div>
            <div className="flex items-center gap-2 text-white">
              <FaClock className="text-xl" />
              <span>{heroData.duration}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Hero;