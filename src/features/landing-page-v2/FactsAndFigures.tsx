// components/FactsAndFigures.tsx
import Paragraph from './components/ui/Paragraph';
import { TypewriterEffectSmooth } from './components/ui/TypewriterEffect';
import { useTranslations } from 'next-intl';
import React, { useEffect, useState, useRef } from 'react';

interface Fact {
  title: string;
  value: number;
  suffix?: string;
}

const FactsAndFigures: React.FC = () => {
  const t = useTranslations('LandingPage.FactsAndFigures');
  const facts: Fact[] = [
    { title: t('facts.orgRegistered'), value: 30 },
    { title: t('facts.opportunitySeekers'), value: 1200, suffix: '+' },
    { title: t('facts.opportunitiesConnected'), value: 100, suffix: '+' },
  ];
  const [counts, setCounts] = useState<number[]>(facts.map(() => 0));
  const containerRef = useRef<HTMLDivElement>(null);
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry.isIntersecting && !hasAnimated) {
          animateCounts();
          setHasAnimated(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, [hasAnimated]);

  const animateCounts = () => {
    facts.forEach((fact, index) => {
      let start = 0;
      const end = fact.value;
      const duration = 2000; // Total duration of the animation in ms
      const incrementTime = 50; // Time between increments in ms

      const totalIncrements = duration / incrementTime;
      const incrementValue = end / totalIncrements;

      const interval = setInterval(() => {
        start += incrementValue;
        if (start >= end) {
          start = end;
          clearInterval(interval);
        }
        setCounts((prevCounts) => {
          const newCounts = [...prevCounts];
          newCounts[index] = Math.ceil(start);
          return newCounts;
        });
      }, incrementTime);
    });
  };
  const words = [
    {
      text: t('community'),
    },
    {
      text: t('impact'),
      className: 'text-[#C4897B]',
    },
  ];

  return (
    <div>
      <div className='flex text-center mx-auto flex-col gap-3 items-center justify-between m-auto'>
        {/* <Title text1='Community Impact' /> */}
        <TypewriterEffectSmooth words={words} />
        <Paragraph text1={t('description')} />
      </div>
      <div
        ref={containerRef}
        className='flex flex-wrap justify-evenly space-x-16 mt-10'
      >
        {facts.map((fact, index) => (
          <div key={index} className='text-center m-4'>
            <div className='text-5xl font-semibold '>
              {counts[index]}
              {fact.suffix ? fact.suffix : ''}
            </div>
            <div className='text-xl mt-2 text-grey'>{fact.title}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FactsAndFigures;
