const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  // Seed Introduction with features (no image upload needed)
  await prisma.introduction.create({
    data: {
      title: "MIS ON ENGINAATOR?",
      description:
        "Enginaator on üle-eestiline insenerivõistlus, mis kestab 4 päeva ning toimub TalTechis. Võistlus koosneb eel- ja finaalvoorust ning hõlmab nelja eri  valdkonda: elektroonika, mehaanika, ehitus ja IT, kus võistlevad 4-liikmelised meeskonnad. Võistluse eelvoor koosneb sprint-ülesandest, mis on lihtsam ja kiirem, ning stamina-ülesandest, mis on raskem ja aeganõudvam. Eelvoor vältab läbi öö ning kestab 17h. Igast valdkonnast pääsevad edasi finaalvooru neli parimat meeskonda ehk finaalis võistlevad kokku 16 tiimi, kes finaalis kõik ühiselt sama ülesannet lahendavad. Finaalvoor toimub häkaton formaadis, kus sponsorfirma püstitab võistlejatele lahendamiseks probleemi. Finaalvoor kestab samuti läbi öö, kokku 24h. Enginaator sai alguse 2018. aastal ning toimub juba seitsmendat korda. Võistlus on välja kujunenud rahvusvahelisest insenerivõistlusest EBEC. Projekti viivad läbi tudengiorganisatsiooni BEST-Estonia liikmed.",
      features: {
        create: [
          {
            title: "Innovatsioon",
            description: "Uudsed lahendused reaalsete probleemide jaoks",
            iconPath: "/light-bulb.png"
          },
          {
            title: "Võistlus",
            description: "Auhinnafond üle 3000€ parimatele tiimidele",
            iconPath: "/rocket1.png"
          },
          {
            title: "Tiimitöö",
            description: "Neljaliikmelised tiimid erinevate oskustega",
            iconPath: "/sitemap.png"
          },
          {
            title: "Energia",
            description: "17 tundi intensiivset inseneritööd",
            iconPath: "/plug.png"
          }
        ]
      }
    }
  });

  console.log('✅ Introduction seeded');

  // Seed Gallery Images (using Cloudinary URLs directly)
  const galleryImages = [
    { url: 'https://res.cloudinary.com/dbrjkyg3a/image/upload/v1759088400/6_g8jnqc.png', alt: "Gallery 6", caption: "Võistluse hetk 6" },
    { url: 'https://res.cloudinary.com/dbrjkyg3a/image/upload/v1759088400/7_jogphf.jpg', alt: "Gallery 7", caption: "Võistluse hetk 7" },
    { url: 'https://res.cloudinary.com/dbrjkyg3a/image/upload/v1759088396/2_vba2re.jpg', alt: "Gallery 2", caption: "Võistluse hetk 2" },
    { url: 'https://res.cloudinary.com/dbrjkyg3a/image/upload/v1759088396/3_tmgo20.jpg', alt: "Gallery 3", caption: "Võistluse hetk 3" },
    { url: 'https://res.cloudinary.com/dbrjkyg3a/image/upload/v1759088396/4_apmtig.jpg', alt: "Gallery 4", caption: "Võistluse hetk 4" },
    { url: 'https://res.cloudinary.com/dbrjkyg3a/image/upload/v1759088399/5_gs51pz.jpg', alt: "Gallery 5", caption: "Võistluse hetk 5" }
  ];
  await prisma.galleryImage.createMany({ data: galleryImages });
  console.log(' Gallery images seeded');

  // Seed Main Sponsors (using Cloudinary URLs directly)
  const mainSponsors = [
    {
      sponsorName: "ETS NORD",
      sponsorText: "ETS NORD on üks Põhja-Euroopa juhtivaid ventilatsioonilahenduste pakkujaid, tegutsedes edukalt juba 26 aastat. Toodame ja arendame ventilatsiooniseadmeid, mis tagavad puhta ja tervisliku sisekliima ning parema enesetunde siseruumides viibijatele. Meie 500-liikmeline professionaalne meeskond tegutseb neljas riigis, pakkudes tuge kogu projekti vältel – alates planeerimisest kuni paigalduse ja hoolduseni. Keskendume klientide vajadustele ning keskkonnasäästlikele ja jätkusuutlikele lahendustele.",
      imageUrl: "https://res.cloudinary.com/dbrjkyg3a/image/upload/v1759088950/etsnord_cmditm.png",
      website: "https://etsnord.ee"
    },
    {
      sponsorName: "Stoneridge",
      sponsorText: "Stoneridge Electronics AS on globaalne elektroonikatootja, kes pakub innovatiivseid lahendusi auto- ja kaubaveo tööstusharudele. Ettevõtte tootevalik hõlmab nutikaid sõidukisüsteeme, mis tagavad turvalisuse, mugavuse ja tõhususe. Stoneridge'i tehniline osakond on võimeline looma kohandatud lahendusi vastavalt klientide vajadustele ning ettevõtte tugevus seisneb tehnoloogiliste uuenduste ja kvaliteetsete toodete väljatöötamises. Ettevõte on pühendunud ka jätkusuutlikkusele, kasutades loodussõbralikke tootmisprotsesse ja toetades ühiskonna sotsiaalseid ja keskkonnaalaseid algatusi. Stoneridge'i eesmärk on olla juhtiv elektroonikalahenduste pakkuja transporditööstuses.",
      imageUrl: "https://res.cloudinary.com/dbrjkyg3a/image/upload/v1759088982/stoneridge_f9hxyu.png",
      website: "https://stoneridge.com"
    },
    {
      sponsorName: "HexTech",
      sponsorText: "HexTech on Eesti tudengite kaitsetööstuse start-up, mis on pühendunud droonituvastuse võimekuse loomisele nii tsiviil- kui ka militaarsektoris. Juba 2026 aasta lõpuks katab HexTech Tallinna linna enda droonituvastuse sensorvõrgustikuga, millega tagatakse ohutum õhuruum kõigile lennureisijatele ning esmane kaitse kiht Eesti kriitilisele infrastruktuurile. Lisaks meie tsiviilsensoritele on arenduses erinevaid militaarlahendusi, millega loome võimekuse tuvastada raadio- ja helilainete abil ka FPV ehk kamikaze droone ning venelaste militaardroone. Enda lahenduste arendamisel teeme pidevat koostööd Ukraina ning Eesti jõustruktuuridega.",
      imageUrl: "https://res.cloudinary.com/dbrjkyg3a/image/upload/v1759088962/hextech_mw8nwe.png",
      website: "https://hextech.ee"
    },
    {
      sponsorName: "Ruukki",
      sponsorText: "Ruukki Construction tarnib terasepõhiseid ehitustooteid ja -teenuseid katuste ning seinte kestlikuks ehitamiseks. Ruukki eesmärk on pakkuda jätkusuutlike ehitiste rajamiseks terviklikke terasepõhiseid katuse- ja ehitustoodete lahendusi, mis hõlmavad ka projekteerimist ja tehnilist tuge. Meie heaks töötab pea 1350 inimest ning meil on 14 spetsialiseerunud tehast. Tugev kohalolu kümnes Euroopa riigis võimaldab pakkuda kohalikele klientidele meie peamisi kaubamärke, milleks on Ruukki ja Plannja. Oleme osa SSAB-st ning meil on pikk terasetöötlemise ja ehitustööstuse kogemus.",
      imageUrl: "https://res.cloudinary.com/dbrjkyg3a/image/upload/v1759088974/ruukki_j6einq.webp",
      website: "https://ruukki.ee"
    },
    {
      sponsorName: "ABB",
      sponsorText: 'ABB on elektrifitseerimise ja automatiseerimise valdkonna tehnoloogialiider, kes võimaldab luua säästvamat ning ressursitõhusamat tulevikku. Ühendades oma inseneriteadmised ja digilahendused, aitame tööstusettevõtetel saavutada maksimaalset tulemuslikkust olles samal ajal tõhusamad, tootlikumad ja keskkonnasõbralikumad. Just sellist lähenemist kirjeldame sõnadega: „Engineered to Outrun". Tuginedes enam kui 140-aastasele ajaloole, on ABB enam kui 110 000 töötajat pühendunud innovatiivsete lahenduste leidmisele tööstuse ümberkujundamiseks.',
      imageUrl: "https://res.cloudinary.com/dbrjkyg3a/image/upload/v1759088941/abb_dp2a2z.png",
      website: "https://abb.com"
    }
  ];
  await prisma.mainSponsor.createMany({ data: mainSponsors });
  console.log('✅ Main sponsors seeded');

  // Seed Fields (no image upload needed)
  await prisma.field.createMany({
    data: [
      {
        name: 'Elektroonika',
        description: 'See valdkond on suunatud neile, kes tunnevad end koduselt programmeerimises ja elektroonikaga eksperimenteerimises. Võistlus avab ukse mitmesuguste põnevate ülesannete lahendamisele, alates lasteraamatute loomisest tehisintellektiga kuni droonipõhiste isikutuvastussüsteemide arendamiseni!',
        icon: 'Cpu'
      },
      {
        name: 'Mehaanika',
        description: 'Mehaanikaülesanded põhinevad mehaanikafüüsika põhialustel, nõudes loovust ja tehnilist nutikust. Varasematel aastatel on ülesanneteks olnud näiteks maavõnkumistele vastupidava ja võimalikult suurt raskust kannatava torni ehitamine ning liivase maastiku jaoks sõiduki loomine.',
        icon: 'Cog'
      },
      {
        name: 'Ehitus',
        description: 'Ehituses osaledes ei tohiks sulle võõras olla mehaanikafüüsika, lihtne elektroonika ega tohiks puududa ka loogiline mõtlemine. Ehitusvaldkonnas testime sinu võimet projekteerida ja teostada hämmastava väljanägemisega konstruktsioone! Varasematel aastatel on ülesanneteks olnud näiteks avaneva silla ehitamine, võimalikult väikese soojusjuhtivusega materjali loomine ja katusekonstruktsioon.',
        icon: 'Building'
      },
      {
        name: 'IT',
        description: 'Osaledes Enginaatori IT-valdkonnas, saad testida oma meeskonna oskusi nii back-end kui ka front-end arenduses, võimalusega tõestada, et sul on silma disaini (UI/UX) jaoks ning arusaam riistvarast ja erinevatest kommunikatsiooniprotokollidest. 17 tunni jooksul testitakse sinu võimet ühendada serveripoolne loogika ja silmapaistev kasutajaliides ühtseks, toimivaks lahenduseks.',
        icon: 'Code'
      }
    ]
  });
  console.log('✅ Fields seeded');

  // Seed Project Members (using Cloudinary URLs)
  const projectMembers = [
    {
      name: 'NADIM METWALLI',
      role: 'TURUNDUSJUHT',
      phone: '+372 56983182',
      email: 'nametw@taltech.ee',
      imageUrl: 'https://res.cloudinary.com/dbrjkyg3a/image/upload/v1759083573/nadim_apqfjo.jpg',
      description: 'Nadim vastutab kogu turunduse eest.'
    },
    {
      name: 'KERT KALLAS',
      role: 'OSALEJATE JA LOGISTIKAJUHT',
      phone: '+372 56273153',
      email: 'kertka@taltech.ee',
      imageUrl: 'https://res.cloudinary.com/dbrjkyg3a/image/upload/v1759083645/kert_adhcls.jpg',
      description: 'Kert vastutab logistika ja osalejate eest.'
    },
    {
      name: 'LISANDRA SOMMERMAN',
      role: 'PROJEKTIJUHT',
      phone: '+372 56827565',
      email: 'lisomm@taltech.ee',
      imageUrl: 'https://res.cloudinary.com/dbrjkyg3a/image/upload/v1759083652/lisandra_qwgtgh.jpg',
      description: 'Lisandra juhib kogu projekti.'
    },
    {
      name: 'ROMET KALF',
      role: 'MÜÜGIJUHT',
      phone: '+372 57871007',
      email: 'rokalf@taltech.ee',
      imageUrl: 'https://res.cloudinary.com/dbrjkyg3a/image/upload/v1759083657/romet_sxezld.jpg',
      description: 'Romet vastutab müügi eest.'
    },
    {
      name: 'HANS MARKUS KIILMAA',
      role: 'PROGRAMMIJUHT',
      phone: '+372 55678737',
      email: 'hakiil@taltech.ee',
      imageUrl: 'https://res.cloudinary.com/dbrjkyg3a/image/upload/v1759083573/hans_fynsgk.jpg',
      description: 'Hans Markus vastutab programmi eest.'
    }
  ];
  await prisma.projectMember.createMany({ data: projectMembers });
  console.log('✅ Project members seeded');

  // Seed Hero Section (no image upload needed)
  await prisma.heroSection.create({
    data: {
      dateText: "17-20 APRILL 2025",
      mainTitle: "ÜLE-EESTILINE INSENERIVÕISTLUS", 
      eventDate: "April 17, 2026 00:00:00",
      backgroundImage: "https://res.cloudinary.com/dbrjkyg3a/image/upload/v1759439184/hero-img_anlffe.jpg",
      eventDateInfo: "17-20. aprill 2026",
      location: "TalTech",
      audience: "Insenerihuvilistele noortele",
      duration: "4 päeva"
    }
  });
  console.log('✅ Hero section seeded');
  console.log('\n🎉 Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });