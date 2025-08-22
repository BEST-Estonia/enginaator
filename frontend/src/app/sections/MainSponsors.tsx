"use client"

import React, { useState } from 'react'
import { Card, CardContent } from '@/app/components/ui/card';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/app/components/ui/carousel';
import Autoplay from 'embla-carousel-autoplay';
import Image from 'next/image';

// Import sponsor logos
import hextech from '@/assets/hextech.png';
import abb from '@/assets/abb.png';
import stoneridge from '@/assets/stoneridge.png';
import etsnord from '@/assets/etsnord.png';
import ruukki from '@/assets/ruukki.webp';

const MainSponsors = () => {
    const sponsors = [
        {
            name: 'ETS NORD',
            logo: etsnord,
            description: 'ETS NORD on üks Põhja-Euroopa juhtivaid ventilatsioonilahenduste pakkujaid, tegutsedes edukalt juba 26 aastat. Toodame ja arendame ventilatsiooniseadmeid, mis tagavad puhta ja tervisliku sisekliima ning parema enesetunde siseruumides viibijatele. Meie 500-liikmeline professionaalne meeskond tegutseb neljas riigis, pakkudes tuge kogu projekti vältel – alates planeerimisest kuni paigalduse ja hoolduseni. Keskendume klientide vajadustele ning keskkonnasäästlikele ja jätkusuutlikele lahendustele.'
        },
        {
            name: 'Stoneridge',
            logo: stoneridge,
            description: 'Stoneridge Electronics AS on globaalne elektroonikatootja, kes pakub innovatiivseid lahendusi auto- ja kaubaveo tööstusharudele. Ettevõtte tootevalik hõlmab nutikaid sõidukisüsteeme, mis tagavad turvalisuse, mugavuse ja tõhususe. Stoneridge\'i tehniline osakond on võimeline looma kohandatud lahendusi vastavalt klientide vajadustele ning ettevõtte tugevus seisneb tehnoloogiliste uuenduste ja kvaliteetsete toodete väljatöötamises. Ettevõte on pühendunud ka jätkusuutlikkusele, kasutades loodussõbralikke tootmisprotsesse ja toetades ühiskonna sotsiaalseid ja keskkonnaalaseid algatusi. Stoneridge\'i eesmärk on olla juhtiv elektroonikalahenduste pakkuja transporditööstuses.'
        },
        {
            name: 'HexTech',
            logo: hextech,
            description: 'HexTech on Eesti tudengite kaitsetööstuse start-up, mis on pühendunud droonituvastuse võimekuse loomisele nii tsiviil- kui ka militaarsektoris. Juba 2026 aasta lõpuks katab HexTech Tallinna linna enda droonituvastuse sensorvõrgustikuga, millega tagatakse ohutum õhuruum kõigile lennureisijatele ning esmane kaitse kiht Eesti kriitilisele infrastruktuurile. Lisaks meie tsiviilsensoritele on arenduses erinevaid militaarlahendusi, millega loome võimekuse tuvastada raadio- ja helilainete abil ka FPV ehk kamikaze droone ning venelaste militaardroone. Enda lahenduste arendamisel teeme pidevat koostööd Ukraina ning Eesti jõustruktuuridega.'
        },
        {
            name: 'Ruukki',
            logo: ruukki,
            description: 'Ruukki Construction tarnib terasepõhiseid ehitustooteid ja -teenuseid katuste ning seinte kestlikuks ehitamiseks. Ruukki eesmärk on pakkuda jätkusuutlike ehitiste rajamiseks terviklikke terasepõhiseid katuse- ja ehitustoodete lahendusi, mis hõlmavad ka projekteerimist ja tehnilist tuge. Meie heaks töötab pea 1350 inimest ning meil on 14 spetsialiseerunud tehast. Tugev kohalolu kümnes Euroopa riigis võimaldab pakkuda kohalikele klientidele meie peamisi kaubamärke, milleks on Ruukki ja Plannja. Oleme osa SSAB-st ning meil on pikk terasetöötlemise ja ehitustööstuse kogemus.'
        },
        {
            name: 'ABB',
            logo: abb,
            description: 'ABB on elektrifitseerimise ja automatiseerimise valdkonna tehnoloogialiider, kes võimaldab luua säästvamat ning ressursitõhusamat tulevikku. Ühendades oma inseneriteadmised ja digilahendused, aitame tööstusettevõtetel saavutada maksimaalset tulemuslikkust olles samal ajal tõhusamad, tootlikumad ja keskkonnasõbralikumad. Just sellist lähenemist kirjeldame sõnadega: „Engineered to Outrun". Tuginedes enam kui 140-aastasele ajaloole, on ABB enam kui 110 000 töötajat pühendunud innovaatiliste lahenduste leidmisele tööstuse ümberkujundamiseks.'
        }
    ];
  
  return (
    <section className='py-20 bg-gradient-subtle'>
        <div className="container mx-auto px-4">
            <div className="text-center mb-16">
                <h1 className="font-bold text-2xl sm:text-3xl md:text-4xl text-center">
                    SUURTOETAJAD
                </h1>
                <p className="section-subheader">
                    Meie peamised partnerid, kes teevad Enginaatori võimalikuks
                </p>
            </div>

            <div className="max-w-4xl mx-auto">
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
                <CarouselItem key={sponsor.name}>
                  <Card className="overflow-hidden border-none shadow-lg bg-card/50 backdrop-blur-sm">
                    <CardContent className="p-8 md:p-12">
                      <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-center text-center lg:text-left">
                        <div className="flex-shrink-0">
                          <div className="w-32 h-32 lg:w-40 lg:h-40 bg-white rounded-xl flex items-center justify-center shadow-lg p-4">
                            <Image 
                              src={sponsor.logo}
                              alt={`${sponsor.name} logo`}
                              className="object-contain max-w-full max-h-full"
                            />
                          </div>
                        </div>
                        <div className="flex-1">
                          <h3 className="text-2xl lg:text-3xl font-bold text-foreground mb-4">
                            {sponsor.name}
                          </h3>
                          <p className="text-muted-foreground text-base lg:text-lg leading-relaxed">
                            {sponsor.description}
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
          
          <div className="flex justify-center mt-8 space-x-2">
            {sponsors.map((sponsor, index) => (
              <div 
                key={index} 
                className={`w-2 h-2 rounded-full transition-all ${
                  index === 0 ? 'bg-[hsl(var(--enginaator-red))] w-4' : 'bg-muted-foreground/30'
                }`}
              ></div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default MainSponsors
