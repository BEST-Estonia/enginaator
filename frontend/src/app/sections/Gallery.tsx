"use client"
import React from 'react'
import { Card } from '@/app/components/ui/card';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/app/components/ui/carousel';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import image1 from '@/assets/1.jpg';
import image2 from '@/assets/2.jpg';
import image3 from '@/assets/3.jpg';
import image4 from '@/assets/4.jpg';
import image5 from '@/assets/5.jpg';
import image6 from '@/assets/6.png';
import image7 from '@/assets/7.jpeg';
import Image from 'next/image';

const Gallery = () => {
    const images = [
        image1, image2, image3, image4, image5, image6, image7
    ];
  return (
    <section className='py-20 bg-background'>
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
            <h1 className="font-bold text-2xl sm:text-3xl md:text-4xl text-center">
                Galerii
            </h1>
            <p className="section-subheader">
            Pilte eelmistest Enginaator võistlustest
            </p>
        </div>

        <div className="max-w-5xl mx-auto">
          <Carousel className="w-full">
            <CarouselContent className="-ml-4">
              {images.map((image, index) => (
                <CarouselItem key={index} className="pl-4 md:basis-1/2 lg:basis-1/3">
                  <Card className="overflow-hidden group hover:shadow-xl transition-all duration-300">
                    <div className="aspect-video overflow-hidden">
                      <Image
                        src={image}
                        alt='Image from competition'
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  </Card>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="hidden md:flex -left-4 bg-[hsl(var(--primary)/0.9)] hover:bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] border-none">
              <ChevronLeft className="h-5 w-5" />
            </CarouselPrevious>
            <CarouselNext className="hidden md:flex -right-4 bg-[hsl(var(--primary)/0.9)] hover:bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] border-none">
              <ChevronRight className="h-5 w-5" />
            </CarouselNext>
          </Carousel>
        </div>
        
        <div className="text-center mt-8">
          <p className="text-[hsl(var(--muted-foreground))]">
            Vaata rohkem pilte meie sotsiaalmeedias!
          </p>
        </div>
      </div>
    </section>
  )
}

export default Gallery
