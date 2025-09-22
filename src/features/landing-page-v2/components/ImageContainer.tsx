'use client';

import { useAnimate, useInView } from 'framer-motion';
import Image from 'next/image';
import React, { useEffect } from 'react';

const ImageContainer = () => {
  const [scope, animate] = useAnimate();
  const isInView = useInView(scope);

  const handleAnimation = async () => {
    if (isInView) {
      await animate(scope.current, { opacity: 1 }, { duration: 0.5 });
      await animate('#firstImage', { opacity: 1, scale: 1 }, { duration: 0.3 });
      await animate(
        '#secondImage',
        { opacity: 1, scale: 1 },
        { duration: 0.3 }
      );
      await animate('#thirdImage', { opacity: 1, scale: 1 }, { duration: 0.3 });
    } else {
      animate(scope.current, { opacity: 0 });
      animate('#firstImage', { opacity: 0, scale: 0.5 });
      animate('#secondImage', { opacity: 0, scale: 0.5 });
      animate('#thirdImage', { opacity: 0, scale: 0.5 });
    }
  };
  useEffect(() => {
    handleAnimation();
  }, [isInView]);
  return (
    <div
      ref={scope}
      className="opacity-0 relative lg:w-[22rem] lg:h-[20rem] xl:w-[30rem] xl:h-[26rem] bg-contain bg-no-repeat bg-center bg-[url('/assets/cardBackground.svg')]"
    >
      <div
        id='firstImage'
        className='opacity-0 scale-50 absolute top-[-15%] right-[-20%] z-10 xl:w-96 xl:h-80 lg:w-72 lg:h-64'
      >
        <Image
          src='/assets/Cetificate.png'
          alt='certificate'
          layout='fill'
          objectFit='contain'
        />
      </div>
      <div
        id='secondImage'
        className='opacity-0 scale-50 absolute top-[5%] left-[-20%] z-10 xl:w-96 xl:h-80 lg:w-72 lg:h-64'
      >
        <Image
          src='/assets/Search.png'
          alt='search'
          layout='fill'
          objectFit='contain'
        />
      </div>
      <div
        id='thirdImage'
        className='opacity-0 scale-50 absolute bottom-[-25%] left-[12%] z-10 xl:w-96 xl:h-80 lg:w-72 lg:h-64'
      >
        <Image
          src='/assets/Opportunity Card.png'
          alt='Opportunity card'
          layout='fill'
          objectFit='contain'
        />
      </div>
    </div>
  );
};

export default ImageContainer;
