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
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });