const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  // Seed Introduction with features
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

  // Seed AboutSection
  await prisma.aboutSection.create({
    data: {
      kusContent:
        "Enginaator toimub TalTechis. Suurem osa võistlusest viiakse läbi tudengimaja aulas, kuid osalejate teekond viib neid ka muudesse ülikooli osadesse. Samuti on Tallinnast väljastpoolt tulevatel finalistidel võimalus ööbida 18. aprillil Hessnery Residentsis, mis asub Pärnu mnt. 453H. TalTechi campuselt (peatus Tehnikaülikool) liigub täpselt hotelli ette (peatus Pärnu maantee) buss nr.10.",
      osalejadContent:
        "Võistlus toimub neljaliikmelistes tiimides, mis koosnevad 17-24 aastastest gümnasistidest, kutsekooli õpilastest ja tudengitest. Võivad olla segatiimid, aga ka kõik ühest haridusasutusest. Kui tiimiliiget veel ei ole, ei tasu meelt heita, sest korraldustiim aitab Sul leida võistluskaaslased!",
      auhinnadContent:
        "Top 5 tiimile on tagatud koht TalTechis, ning finaali kolmele parimale tiimile on ligi 3000€ auhinnafond. Lisaks saavad osalejad eri auhindu ja meeneid meie ettevõtetelt ning sponsoritelt."
    }
  });

  // Seed Gallery Images
  await prisma.galleryImage.createMany({
    data: [
      { url: "/assets/1.jpg", alt: "Enginaator Gallery 1", caption: "Võistluse hetk 1" },
      { url: "/assets/2.jpg", alt: "Enginaator Gallery 2", caption: "Võistluse hetk 2" },
      { url: "/assets/3.jpg", alt: "Enginaator Gallery 3", caption: "Võistluse hetk 3" },
      { url: "/assets/4.jpg", alt: "Enginaator Gallery 4", caption: "Võistluse hetk 4" },
      { url: "/assets/5.jpg", alt: "Enginaator Gallery 5", caption: "Võistluse hetk 5" },
      { url: "/assets/6.png", alt: "Enginaator Gallery 6", caption: "Võistluse hetk 6" },
      { url: "/assets/7.jpeg", alt: "Enginaator Gallery 7", caption: "Võistluse hetk 7" }
    ]
  });

  // Seed Main Sponsors
  await prisma.mainSponsor.createMany({
    data: [
      {
        sponsorName: "ETS NORD",
        sponsorText: "ETS NORD on üks Põhja-Euroopa juhtivaid ventilatsioonilahenduste pakkujaid, tegutsedes edukalt juba 26 aastat. Toodame ja arendame ventilatsiooniseadmeid, mis tagavad puhta ja tervisliku sisekliima ning parema enesetunde siseruumides viibijatele. Meie 500-liikmeline professionaalne meeskond tegutseb neljas riigis, pakkudes tuge kogu projekti vältel – alates planeerimisest kuni paigalduse ja hoolduseni. Keskendume klientide vajadustele ning keskkonnasäästlikele ja jätkusuutlikele lahendustele.",
        imageUrl: "/uploads/etsnord.png",
        website: "https://etsnord.ee"
      },
      {
        sponsorName: "Stoneridge",
        sponsorText: "Stoneridge Electronics AS on globaalne elektroonikatootja, kes pakub innovatiivseid lahendusi auto- ja kaubaveo tööstusharudele. Ettevõtte tootevalik hõlmab nutikaid sõidukisüsteeme, mis tagavad turvalisuse, mugavuse ja tõhususe. Stoneridge\'i tehniline osakond on võimeline looma kohandatud lahendusi vastavalt klientide vajadustele ning ettevõtte tugevus seisneb tehnoloogiliste uuenduste ja kvaliteetsete toodete väljatöötamises. Ettevõte on pühendunud ka jätkusuutlikkusele, kasutades loodussõbralikke tootmisprotsesse ja toetades ühiskonna sotsiaalseid ja keskkonnaalaseid algatusi. Stoneridge\'i eesmärk on olla juhtiv elektroonikalahenduste pakkuja transporditööstuses.",
        imageUrl: "/uploads/stoneridge.png",
        website: "https://stoneridge.com"
      },
      {
        sponsorName: "HexTech",
        sponsorText: "HexTech on Eesti tudengite kaitsetööstuse start-up, mis on pühendunud droonituvastuse võimekuse loomisele nii tsiviil- kui ka militaarsektoris. Juba 2026 aasta lõpuks katab HexTech Tallinna linna enda droonituvastuse sensorvõrgustikuga, millega tagatakse ohutum õhuruum kõigile lennureisijatele ning esmane kaitse kiht Eesti kriitilisele infrastruktuurile. Lisaks meie tsiviilsensoritele on arenduses erinevaid militaarlahendusi, millega loome võimekuse tuvastada raadio- ja helilainete abil ka FPV ehk kamikaze droone ning venelaste militaardroone. Enda lahenduste arendamisel teeme pidevat koostööd Ukraina ning Eesti jõustruktuuridega.",
        imageUrl: "/uploads/hextech.png",
        website: "https://hextech.ee"
      },
      {
        sponsorName: "Ruukki",
        sponsorText: "Ruukki Construction tarnib terasepõhiseid ehitustooteid ja -teenuseid katuste ning seinte kestlikuks ehitamiseks. Ruukki eesmärk on pakkuda jätkusuutlike ehitiste rajamiseks terviklikke terasepõhiseid katuse- ja ehitustoodete lahendusi, mis hõlmavad ka projekteerimist ja tehnilist tuge. Meie heaks töötab pea 1350 inimest ning meil on 14 spetsialiseerunud tehast. Tugev kohalolu kümnes Euroopa riigis võimaldab pakkuda kohalikele klientidele meie peamisi kaubamärke, milleks on Ruukki ja Plannja. Oleme osa SSAB-st ning meil on pikk terasetöötlemise ja ehitustööstuse kogemus.",
        imageUrl: "/uploads/ruukki.webp",
        website: "https://ruukki.ee"
      },
      {
        sponsorName: "ABB",
        sponsorText: 'ABB on elektrifitseerimise ja automatiseerimise valdkonna tehnoloogialiider, kes võimaldab luua säästvamat ning ressursitõhusamat tulevikku. Ühendades oma inseneriteadmised ja digilahendused, aitame tööstusettevõtetel saavutada maksimaalset tulemuslikkust olles samal ajal tõhusamad, tootlikumad ja keskkonnasõbralikumad. Just sellist lähenemist kirjeldame sõnadega: „Engineered to Outrun". Tuginedes enam kui 140-aastasele ajaloole, on ABB enam kui 110 000 töötajat pühendunud innovaatiliste lahenduste leidmisele tööstuse ümberkujundamiseks.',
        imageUrl: "/uploads/abb.png",
        website: "https://abb.com"
      }
    ]
  });

  // Seed Fields
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
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });