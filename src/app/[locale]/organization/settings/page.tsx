import { useTranslations } from 'next-intl';
import React from 'react';

const Setting: React.FC = () => {
  const t = useTranslations('SideBar');
  return (
    <>
      <div className=''>{t('settings')}</div>
    </>
  );
};

export default Setting;
