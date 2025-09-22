import Image from 'next/image';
import { ReactElement } from 'react';

interface HeaderProps {
  logoUrl: string;
  title?: string;
  rightComponent?: ReactElement;
  logoWidth?: number;
  className?: string;
}

const Header: React.FC<HeaderProps> = ({
  logoUrl,
  title,
  rightComponent,
  logoWidth,
  className,
}) => {
  return (
    <div
      className={`sm:sticky sm:top-0 border-b border-lightGrey bg-white p-2 sm:py-3 sm:px-14 w-full z-10 shadow-sm capitalize h-fit ${className}`}
    >
      <div className='container mx-auto flex  items-center justify-between gap-4 '>
        <div className='flex items-center gap-x-4 '>
          <Image src={logoUrl} width={logoWidth || 50} height={50} alt='Logo' />
          <div
            className={` ${
              rightComponent ? 'hidden' : 'block'
            } text-xs sm:block sm:text-sm md:text-base`}
          >
            {title}
          </div>
        </div>
        <div>{rightComponent}</div>
      </div>
    </div>
  );
};

export default Header;
