"use client"
import React, { useEffect, useRef, useState } from 'react';
import { Card } from '@/app/components/ui/card';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/app/components/ui/carousel';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import image1 from '@/assets/1.jpg';
import image2 from '@/assets/2.jpg';
import image3 from '@/assets/3.jpg';
import image4 from '@/assets/4.jpg';
import image5 from '@/assets/5.jpg';
import image6 from '@/assets/6.png';
import image7 from '@/assets/7.jpeg';
import Image from 'next/image';
import { FaFacebook, FaInstagram, FaLinkedin } from 'react-icons/fa';

const Gallery = () => {
  const images = [
    image1, image2, image3, image4, image5, image6, image7
  ];

  const [viewImage, setViewImage] = useState<null | number>(null);
  const carouselRef = useRef<HTMLDivElement>(null);

  const closeModal = () => setViewImage(null);

  useEffect(() => {
    if (viewImage !== null) return;

    const interval = setInterval(() => {
      const carousel = carouselRef.current;
      if (!carousel) return;

      const scrollAmount = carousel.offsetWidth;
      const maxScrollLeft = carousel.scrollWidth - scrollAmount;

      if (carousel.scrollLeft >= maxScrollLeft - 5) {
        carousel.scrollTo({ left: 0, behavior: 'smooth' });
      } else {
        carousel.scrollBy({ left: scrollAmount, behavior: 'smooth' });
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [viewImage]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (viewImage === null) return;

      if (e.key === 'Escape') {
        closeModal();
      } else if (e.key === 'ArrowRight') {
        setViewImage((prev) => prev !== null ? (prev + 1) % images.length : null);
      } else if (e.key === 'ArrowLeft') {
        setViewImage((prev) => prev !== null ? (prev - 1 + images.length) % images.length : null);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [viewImage, images.length]);

  return (
    <section className='py-20 bg-background'>
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="font-bold text-2xl sm:text-3xl md:text-4xl text-center [font-family:var(--font-poppins)]">
            GALERII
          </h1>
          <p className="section-subheader">
            Pilte eelmistest Enginaator võistlustest
          </p>
        </div>

        <div className="max-w-5xl mx-auto">
          <Carousel className="w-full">
            <CarouselContent
              ref={carouselRef}
              className="-ml-4 flex overflow-x-auto scroll-smooth no-scrollbar"
            >
              {images.map((image, index) => (
                <CarouselItem
                  key={index}
                  className="pl-4 md:basis-1/2 lg:basis-1/3"
                >
                  <Card
                    className="overflow-hidden group hover:shadow-xl transition-all duration-300 cursor-pointer"
                    onClick={() => setViewImage(index)}
                  >
                    <div className="aspect-video overflow-hidden">
                      <Image
                        src={image}
                        alt="Image from competition"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  </Card>
                </CarouselItem>
              ))}
            </CarouselContent>

            <CarouselPrevious
              className="hidden md:flex -left-4 bg-[hsl(var(--enginaator-red))] hover:bg-[hsl(var(--enginaator-red-dark))] text-white border-none shadow-lg"
              onClick={() => {
                if (!carouselRef.current) return;
                carouselRef.current.scrollBy({ left: -carouselRef.current.offsetWidth, behavior: 'smooth' });
              }}
            >
              <ChevronLeft className="h-5 w-5" />
            </CarouselPrevious>

            <CarouselNext
              className="hidden md:flex -right-4 bg-[hsl(var(--enginaator-red))] hover:bg-[hsl(var(--enginaator-red-dark))] text-white border-none shadow-lg"
              onClick={() => {
                if (!carouselRef.current) return;
                carouselRef.current.scrollBy({ left: carouselRef.current.offsetWidth, behavior: 'smooth' });
              }}
            >
              <ChevronRight className="h-5 w-5" />
            </CarouselNext>
          </Carousel>
        </div>

        <div className="text-center flex flex-col mt-8">
          <p className="text-[hsl(var(--muted-foreground))] mb-4">
            Vaata rohkem pilte meie sotsiaalmeedias!
          </p>
          <div className="flex justify-center gap-6 text-2xl text-black">
            <a
              href="https://facebook.com/enginaator"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-gray-600 transition"
            >
              <FaFacebook />
            </a>
            <a
              href="https://instagram.com/enginaator"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-gray-600 transition"
            >
              <FaInstagram />
            </a>
            <a
              href="https://linkedin.com/company/enginaator"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-gray-600 transition"
            >
              <FaLinkedin />
            </a>
          </div>
        </div>
      </div>

      {viewImage !== null && (
        <div
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
          onClick={closeModal}
        >
          <div className="relative max-w-7xl max-h-[90vh] w-full flex items-center justify-center">
            <button
              className="absolute top-4 right-4 z-10 bg-[hsl(var(--enginaator-red))] hover:bg-[hsl(var(--enginaator-red-dark))] text-white p-3 rounded-full shadow-lg"
              onClick={closeModal}
            >
              <X className="h-6 w-6" />
            </button>

            <button
              className="absolute left-4 z-10 bg-[hsl(var(--enginaator-red))] hover:bg-[hsl(var(--enginaator-red-dark))] text-white p-3 rounded-full shadow-lg"
              onClick={(e) => {
                e.stopPropagation();
                setViewImage((prev) => (prev !== null ? (prev - 1 + images.length) % images.length : null));
              }}
            >
              <ChevronLeft className="h-6 w-6" />
            </button>

            <button
              className="absolute right-4 z-10 bg-[hsl(var(--enginaator-red))] hover:bg-[hsl(var(--enginaator-red-dark))] text-white p-3 rounded-full shadow-lg"
              onClick={(e) => {
                e.stopPropagation();
                setViewImage((prev) => (prev !== null ? (prev + 1) % images.length : null));
              }}
            >
              <ChevronRight className="h-6 w-6" />
            </button>

            <div
              className="relative w-full h-full flex items-center justify-center"
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={images[viewImage]}
                alt={`Full view of gallery image ${viewImage + 1}`}
                className="object-contain max-h-[90vh] max-w-full"
              />
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default Gallery;
