"use client"
import React, { useEffect, useRef, useState } from 'react';
import { Card } from '@/app/components/ui/card';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/app/components/ui/carousel';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import Image from 'next/image';
import { FaFacebook, FaInstagram, FaLinkedin } from 'react-icons/fa';
import { fetchGalleryImages, GalleryImage } from '@/services/galleryService';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

const getImageSrc = (url: string) =>
  url && url.startsWith('http') ? url : `${API_URL}${url}`;

const Gallery = () => {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [viewImage, setViewImage] = useState<null | number>(null);
  const carouselRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadImages();
  }, []);

  const loadImages = async () => {
    try {
      const data = await fetchGalleryImages();
      setImages(data);
    } catch (error) {
      console.error('Error loading gallery:', error);
      setError('Failed to load gallery images');
    } finally {
      setLoading(false);
    }
  };

  const closeModal = () => setViewImage(null);
  const [sectionHeight, setSectionHeight] = useState('auto');

  const sectionRef = useRef<HTMLElement | null>(null);
  const [height, setHeight] = useState<'auto' | number>('auto');

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    if (viewImage !== null) {
        const currentHeight = section.getBoundingClientRect().height;
        setHeight(currentHeight);

        requestAnimationFrame(() => {
        setHeight(window.innerHeight * 1.5);
        });
    } else {
        const fullHeight = section.scrollHeight;
        setHeight(fullHeight);

        const timeout = setTimeout(() => setHeight('auto'), 700);
        return () => clearTimeout(timeout);
    }
  }, [viewImage]);

  useEffect(() => {
    if (viewImage !== null) return;

    const interval = setInterval(() => {
      const carousel = carouselRef.current;
      if (!carousel || images.length === 0) return;

      const scrollAmount = carousel.offsetWidth;
      const maxScrollLeft = carousel.scrollWidth - scrollAmount;

      if (carousel.scrollLeft >= maxScrollLeft - 5) {
        carousel.scrollTo({ left: 0, behavior: 'smooth' });
      } else {
        carousel.scrollBy({ left: scrollAmount, behavior: 'smooth' });
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [viewImage, images.length]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (viewImage === null || images.length === 0) return;

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

  if (loading) {
    return (
      <section className="relative py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h1 className="font-bold text-2xl sm:text-3xl md:text-4xl text-center [font-family:var(--font-poppins)]">
              GALERII
            </h1>
            <p className="section-subheader">
              Pilte eelmistest Enginaator võistlustest
            </p>
          </div>
          <div className="text-center py-8">
            <p className="text-gray-500">Loading gallery images...</p>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="relative py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h1 className="font-bold text-2xl sm:text-3xl md:text-4xl text-center [font-family:var(--font-poppins)]">
              GALERII
            </h1>
            <p className="section-subheader">
              Pilte eelmistest Enginaator võistlustest
            </p>
          </div>
          <div className="text-center py-8">
            <p className="text-red-500">{error}</p>
          </div>
        </div>
      </section>
    );
  }

  if (images.length === 0) {
    return (
      <section className="relative py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h1 className="font-bold text-2xl sm:text-3xl md:text-4xl text-center [font-family:var(--font-poppins)]">
              GALERII
            </h1>
            <p className="section-subheader">
              Pilte eelmistest Enginaator võistlustest
            </p>
          </div>
          <div className="text-center py-8">
            <p className="text-gray-500">No gallery images available yet.</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
    ref={sectionRef}
    className="relative py-20 bg-background overflow-hidden transition-[height] duration-700 ease-in-out"
    style={{
        height: typeof height === 'number' ? `${height}px` : 'auto',
    }}
    >
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
              {images
                .filter(image => image.url && image.url.length > 0)
                .map((image, index) => (
                <CarouselItem
                  key={image.id}
                  className="pl-4 md:basis-1/2 lg:basis-1/3"
                >
                  <Card
                    className="overflow-hidden group hover:shadow-xl transition-all duration-300 cursor-pointer"
                    onClick={() => setViewImage(index)}
                  >
                    <div className="aspect-video overflow-hidden">
                      <Image
                        src={getImageSrc(image.url)}
                        alt={image.alt || "Gallery image"}
                        width={400}
                        height={300}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        unoptimized
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
              href="https://www.instagram.com/enginaator.official/"
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
          className="fixed inset-0 bg-black/90 z-100 flex items-center justify-center p-4"
          onClick={closeModal}
        >
          <div className="relative max-w-7xl max-h-[100%] w-full flex items-center justify-center">
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
            <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
            <Image
                src={getImageSrc(images[viewImage].url)}
                alt={images[viewImage].alt || `Gallery image ${viewImage + 1}`}
                width={800}
                height={600}
                className="object-contain w-[80%] max-h-[80%]"
                unoptimized
            />
            </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default Gallery;
