import Image from 'next/image';
import { ReactNode } from 'react';

type MovingBackgroundEffectProps = {
  children: ReactNode;
};
const MovingBackgroundEffect = ({ children }: MovingBackgroundEffectProps) => {
  return (
    <div className='relative mx-auto w-screen h-full overflow-hidden'>
      <Image
        src='/assets/Ellipse 6.png'
        alt='Circle 1'
        width={2500}
        height={2500}
        className='absolute animate-move-circle-1'
      />
      <Image
        src='/assets/Ellipse 5.png'
        alt='Circle 2'
        width={2500}
        height={2500}
        className='absolute animate-move-circle-2'
      />
      {/* This div is positioned absolutely to be on top of the background */}
      <div className='absolute top-0 left-0 w-full h-full'>{children}</div>
    </div>
  );
};

export default MovingBackgroundEffect;