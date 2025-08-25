"use client"

import * as React from "react";

type FAQItem = {
  question: string;
  answer: string;
};

type FAQCategory = {
  title: string;
  items: FAQItem[];
};

const CATEGORIES: FAQCategory[] = [
  {
    title: "Küsimused",
    items: [
      {
        question: "Kellega probleemide korral ühendust võtta?",
        answer:
          "Probleemide või küsimuste korral võtta ühendust meie osalejate ja logistikajuhiga meili teel kertka@taltech.ee või helistage 56273153.",
      },
      {
        question: "Kas ürituse ajal on võimalik magada?",
        answer:
          "Osalejatele on ürituse ajaks valmis seatud vaiksemas kohas eraldi magamisala. Kaugemalt saabuvatele finalistidele on eelvooru ja finaali vahelisel puhkepäeval olemas majutus.",
      },
      {
        question: "Mida kaasa võtta?",
        answer:
          "Võta kaasa iseennast, hea tuju, arvuti ja laadijad. Riietus mugav ja sobilik võistluseks. Kõik vajalik ülesannete lahendamiseks tuleb korraldajate poolt. Osalejatele on ette nähtud üks soe söögikord, snäkid ning ergutavad joogid. ",
      },
      {
        question: "Kas eelteadmised on vajalikud?",
        answer:
          "Võidule aitab kaasa eelteadmiste omamine, kuid haridustase ei mängi rolli – Enginaator 2023 panid kinni just gümnasistid! Kui mõni valdkond või teema on võõram, ei tasu ka muretseda, sest lahendamise ajal on võimalik kasutada avatud materjale. ",
      },
    ],
  },
];

function AccordionItem({
  q,
  a,
  defaultOpen = false,
}: {
  q: string;
  a: string;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = React.useState(defaultOpen);
  const panelRef = React.useRef<HTMLDivElement>(null);
  const [height, setHeight] = React.useState<string>(defaultOpen ? "auto" : "0px");

  React.useEffect(() => {
    const el = panelRef.current;
    if (!el) return;

    if (open) {
      const target = el.scrollHeight + "px";
      setHeight(target);
    } else {
      if (height === "auto") {
        const current = el.scrollHeight + "px";
        setHeight(current);
        void el.offsetHeight;
      }
      setHeight("0px");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const onTransitionEnd = React.useCallback(() => {
    if (open) setHeight("auto");
  }, [open]);

  return (
    <div className="group">
      <button
        className="flex w-full items-center gap-3 px-4 sm:px-6 py-4 sm:py-5 select-none cursor-pointer"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
      >
        <span
          aria-hidden
          className="inline-flex h-6 w-6 items-center justify-center rounded-full border text-xs font-semibold opacity-70"
        >
          ?
        </span>
        <span className="flex-1 text-left text-sm sm:text-base font-medium">{q}</span>
        <svg
          className={`h-5 w-5 opacity-70 transition-transform duration-300 ${open ? "rotate-180" : ""}`}
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden="true"
        >
          <path
            fillRule="evenodd"
            d="M5.23 7.21a.75.75 0 011.06.02L10 10.17l3.71-2.94a.75.75 0 11.94 1.16l-4.19 3.33a.75.75 0 01-.94 0L5.21 8.39a.75.75 0 01.02-1.18z"
            clipRule="evenodd"
          />
        </svg>
      </button>
      <div
        ref={panelRef}
        className="px-4 sm:px-6 overflow-hidden transition-[height] duration-300 ease-out"
        style={{ height }}
        onTransitionEnd={onTransitionEnd}
        aria-hidden={!open}
      >
        <div className="pb-5 text-sm sm:text-base opacity-80">{a}</div>
      </div>
    </div>
  );
}

export default function Faq() {
  return (
    <section className="py-12 sm:py-16 md:py-20 px-6 sm:px-10 md:px-16 lg:px-24 xl:px-32 [font-family:var(--font-poppins)]">
      <div className="mx-auto max-w-3xl text-center mb-10 sm:mb-14">
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">Korduma Kippuvad Küsimused</h1>
        <p className="mt-3 text-sm sm:text-base opacity-70">Leiad vastused kõige sagedasematele küsimustele</p>
      </div>

      <div className="mx-auto max-w-4xl space-y-10">
        {CATEGORIES.map((cat) => (
          <div key={cat.title} className="space-y-4">
            <h2 className="text-lg font-semibold opacity-80">{cat.title}</h2>
            <div className="divide-y rounded-2xl border shadow-sm">
              {cat.items.map((item, idx) => (
                <AccordionItem key={item.question} q={item.question} a={item.answer} defaultOpen={idx === 0} />
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="mx-auto max-w-3xl text-center mt-12 sm:mt-16">
        <p className="text-sm opacity-60">Ei leidnud vastust? Kirjuta meile ja aitame kiirelt.</p>
      </div>
    </section>
  );
}
