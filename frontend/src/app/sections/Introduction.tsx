"use client";

import { useEffect, useState } from "react";
import { getIntroduction, Introduction as IntroductionType, Feature } from "@/services/introductionService";
import Image from "next/image";

const Introduction = () => {
  const [introduction, setIntroduction] = useState<IntroductionType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchIntroduction = async () => {
      try {
        const data = await getIntroduction();
        setIntroduction(data);
        setLoading(false);
      } catch (err) {
        console.error("Failed to fetch introduction:", err);
        setError("Failed to load introduction content");
        setLoading(false);
      }
    };

    fetchIntroduction();
  }, []);

  if (loading) {
    return <div className="py-20 text-center">Loading...</div>;
  }

  if (error) {
    return <div className="py-20 text-center text-red-500">{error}</div>;
  }

  if (!introduction) {
    return <div className="py-20 text-center">No introduction content available</div>;
  }

  return (
    <section className="py-12 sm:py-16 md:py-20 px-6 sm:px-10 md:px-16 lg:px-24 xl:px-32 bg-[#d9d9d96b]">
      <div className="mx-auto max-w-6xl flex flex-col items-center gap-10 sm:gap-12 md:gap-16 [font-family:var(--font-poppins)]">
        <h1 className="font-bold text-2xl sm:text-3xl md:text-4xl text-center">
          {introduction.title}
        </h1>

        <div className="text-center max-w-4xl">
          <p className="text-sm sm:text-base md:text-lg leading-relaxed">
            {introduction.description}
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-10 w-full max-w-4xl">
          {introduction.features.map((feature) => (
            <div key={feature.id} className="flex flex-col items-center text-center">
              <div className="w-16 h-16 md:w-20 md:h-20 relative mb-4">
                <Image 
                  src={feature.iconPath} 
                  alt={feature.title}
                  width={80}
                  height={80}
                  className="object-contain"
                />
              </div>
              <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
              <p className="text-sm">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Introduction;
