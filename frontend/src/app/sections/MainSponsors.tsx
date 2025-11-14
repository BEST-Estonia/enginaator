"use client"

import React, { useEffect, useState } from 'react';
import { Card, CardContent } from '@/app/components/ui/card';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/app/components/ui/carousel';
import Autoplay from 'embla-carousel-autoplay';
import Image from 'next/image';
import { getMainSponsors, MainSponsor } from '@/services/mainSponsorService';

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
const IMAGE_BASE_URL = BACKEND_URL.replace('/api', '');

const MainSponsors = () => {
  const [sponsors, setSponsors] = useState<MainSponsor[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMainSponsors()
      .then(setSponsors)
      .finally(() => setLoading(false));
  }, []);

  return (
    <section id='suurtoetajad' className='py-20 bg-gradient-subtle'>
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h1 className="font-bold text-2xl sm:text-3xl md:text-4xl text-center [font-family:var(--font-poppins)]">
            SUURTOETAJAD
          </h1>
          <p className="section-subheader">
            Meie peamised partnerid, kes teevad Enginaatori võimalikuks
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          {loading ? (
            <div>Loading sponsors...</div>
          ) : (
            <Carousel
              className="w-full"
              plugins={[
                Autoplay({
                  delay: 3000,
                }),
              ]}
              opts={{
                align: "start",
                loop: true,
              }}
            >
              <CarouselContent>
                {sponsors.map((sponsor, index) => (
                  <CarouselItem key={sponsor.id}>
                    <Card className="overflow-hidden border-none shadow-lg bg-card/50 backdrop-blur-sm">
                      <CardContent className="p-8 md:p-12">
                        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-center text-center lg:text-left">
                          <div className="flex-shrink-0">
                            <div className="w-32 h-32 lg:w-40 lg:h-40 bg-white rounded-xl flex items-center justify-center shadow-lg p-4">
                              <img
                                src={sponsor.imageUrl}
                                alt={`${sponsor.sponsorName} logo`}
                                className="object-contain max-w-full max-h-full"
                              />
                            </div>
                          </div>
                          <div className="flex-1">
                            <h3 className="text-2xl lg:text-3xl font-bold text-foreground mb-4">
                              {sponsor.sponsorName}
                            </h3>
                            <p className="text-muted-foreground text-base lg:text-lg leading-relaxed">
                              {sponsor.sponsorText}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="hidden md:flex -left-4 bg-[hsl(var(--enginaator-red))] hover:bg-[hsl(var(--enginaator-red-dark))] text-white border-none shadow-lg" />
              <CarouselNext className="hidden md:flex -right-4 bg-[hsl(var(--enginaator-red))] hover:bg-[hsl(var(--enginaator-red-dark))] text-white border-none shadow-lg" />
            </Carousel>
          )}
        </div>
      </div>
    </section>
  );
};

export default MainSponsors;
