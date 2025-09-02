import Image from "next/image";

const Introduction = () => {
  return (
    <section className="py-12 sm:py-16 md:py-20 px-6 sm:px-10 md:px-16 lg:px-24 xl:px-32 bg-[#d9d9d96b]">
      <div className="mx-auto max-w-6xl flex flex-col items-center gap-10 sm:gap-12 md:gap-16 [font-family:var(--font-poppins)]">
        <h1 className="font-bold text-2xl sm:text-3xl md:text-4xl text-center">
          MIS ON ENGINAATOR?
        </h1>
        <h2 className="font-light text-sm sm:text-base md:text-[15px] leading-7 sm:leading-8 md:leading-9 text-center opacity-80">
          Enginaator on üle-eestiline insenerivõistlus, mis kestab 4 päeva ning toimub TalTechis. Võistlus koosneb eel- ja finaalvoorust ning hõlmab nelja eri  valdkonda: elektroonika, mehaanika, ehitus ja IT, kus võistlevad 4-liikmelised meeskonnad. Võistluse eelvoor koosneb sprint-ülesandest, mis on lihtsam ja kiirem, ning stamina-ülesandest, mis on raskem ja aeganõudvam. Eelvoor vältab läbi öö ning kestab 17h. Igast valdkonnast pääsevad edasi finaalvooru neli parimat meeskonda ehk finaalis võistlevad kokku 16 tiimi, kes finaalis kõik ühiselt sama ülesannet lahendavad. Finaalvoor toimub häkaton formaadis, kus sponsorfirma püstitab võistlejatele lahendamiseks probleemi. Finaalvoor kestab samuti läbi öö, kokku 24h. Enginaator sai alguse 2018. aastal ning toimub juba seitsmendat korda. Võistlus on välja kujunenud rahvusvahelisest insenerivõistlusest EBEC. Projekti viivad läbi tudengiorganisatsiooni BEST-Estonia liikmed.
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 sm:gap-8 md:gap-10 w-full">
          <div className="flex flex-col items-center gap-3 sm:gap-4 p-6 sm:p-8">
            <div className="relative w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16">
              <Image
                src="/light-bulb.png"
                alt="Innovatsioon ikoon"
                fill
                unoptimized
                className="object-contain rounded-md transition-transform duration-300 hover:scale-110"
                sizes="(max-width: 640px) 48px, (max-width: 768px) 56px, 64px"
              />
            </div>
            <h1 className="font-semibold text-sm sm:text-base text-center">Innovatsioon</h1>
            <h2 className="font-normal text-[11px] sm:text-xs text-center opacity-70">
              Uudsed lahendused reaalsete probleemide jaoks
            </h2>
          </div>

          <div className="flex flex-col items-center gap-3 sm:gap-4 p-6 sm:p-8">
            <div className="relative w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16">
              <Image
                src="/rocket1.png"
                alt="Võistlus ikoon"
                fill
                unoptimized
                className="object-contain rounded-md transition-transform duration-300 hover:scale-110"
                sizes="(max-width: 640px) 48px, (max-width: 768px) 56px, 64px"
              />
            </div>
            <h1 className="font-semibold text-sm sm:text-base text-center">Võistlus</h1>
            <h2 className="font-normal text-[11px] sm:text-xs text-center opacity-70">
              Auhinnafond üle 3000€ parimatele tiimidele
            </h2>
          </div>

          <div className="flex flex-col items-center gap-3 sm:gap-4 p-6 sm:p-8">
            <div className="relative w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16">
              <Image
                src="/sitemap.png"
                alt="Tiimitöö ikoon"
                fill
                unoptimized
                className="object-contain rounded-md transition-transform duration-300 hover:scale-110"
                sizes="(max-width: 640px) 48px, (max-width: 768px) 56px, 64px"
              />
            </div>
            <h1 className="font-semibold text-sm sm:text-base text-center">Tiimitöö</h1>
            <h2 className="font-normal text-[11px] sm:text-xs text-center opacity-70">
              Neljaliikmelised tiimid erinevate oskustega
            </h2>
          </div>

          <div className="flex flex-col items-center gap-3 sm:gap-4 p-6 sm:p-8">
            <div className="relative w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16">
              <Image
                src="/plug.png"
                alt="Energia ikoon"
                fill
                unoptimized
                className="object-contain rounded-md transition-transform duration-300 hover:scale-110"
                sizes="(max-width: 640px) 48px, (max-width: 768px) 56px, 64px"
              />
            </div>
            <h1 className="font-semibold text-sm sm:text-base text-center">Energia</h1>
            <h2 className="font-normal text-[11px] sm:text-xs text-center opacity-70">
              17 tundi intensiivset inseneritööd
            </h2>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Introduction;
