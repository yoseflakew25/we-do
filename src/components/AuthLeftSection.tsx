import { useTranslations } from 'next-intl';
import Link from 'next/link';
import React from 'react';

const AuthLeftSection: React.FC = () => {
  const t = useTranslations('AkilMotto');
  return (
    <Link href={'/'}>
      <div
        className='contanier min-h-screen bg-cover bg-center px-10 py-20 flex items-center shadow-[8px_0_15px_-5px_rgba(0,0,0,0.1)]'
        style={{ backgroundImage: 'url(/assets/background.png)' }}
      >
        <div>
          <img src='/assets/Hoopoe navbar logo.png' className='h-12' alt='logo' />
          <h1 className='text-4xl text-moto font-poppins font-semibold mb-6'>
            {t('title')}
          </h1>
        </div>
      </div>
    </Link>
  );
};

export default AuthLeftSection;
