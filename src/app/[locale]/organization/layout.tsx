'use client';

import Sidebar from '@/features/organization/components/Sidebar';
import { useSession } from 'next-auth/react';
import { useTranslations } from 'next-intl';
import React, { ReactNode, useEffect, useState } from 'react';
import { AiFillHome } from 'react-icons/ai';
import { BsBuildingFillGear } from 'react-icons/bs';
import { FiImage } from 'react-icons/fi';
import { GiOrganigram } from 'react-icons/gi';
import { ImUsers } from 'react-icons/im';
import { IoPricetags } from 'react-icons/io5';

type Props = {
  children: ReactNode;
};

function Layout(props: Props) {
  const [expandedSidebar, setExpandedSidebar] = useState(false);
  const t = useTranslations('SideBarOptions');
  const { data: user } = useSession();
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    // Execute sidebar update when window resizes after mount
    const handleResize = () => {
      if (window.innerWidth < 450) {
        setExpandedSidebar(false);
        setIsMobile(true);
      } else if (window.innerWidth < 720) {
        setExpandedSidebar(false);
      }
    };
    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, [expandedSidebar]);

  const toggleSidebar = () => {
    setExpandedSidebar(!expandedSidebar);
  };

  const getVerifiedProfileButtons = () => {
    return user?.user.profileStatus === 'verified'
      ? [
          {
            name: `${t('volunteerPool')}`,
            href: '/organization/talent-pool',
            icon: <ImUsers size={20} />,
          },
        ]
      : [];
  };

  const sidebarOptions = [
    {
      name: `${t('opportunities')}`,
      href: '/organization/opportunities',
      icon: <AiFillHome size={20} />,
    },
    {
      name: `${t('organizationProfile')}`,
      href: '/organization/profile',
      icon: <BsBuildingFillGear size={20} />,
    },
    ...getVerifiedProfileButtons(),
    {
      name: `${t('representatives')}`,
      href: '/organization/representatives',
      icon: <GiOrganigram size={20} />,
    },
    {
      name: `${t('pricing')}`,
      href: '/organization/pricing',
      icon: <IoPricetags size={20} />,
    },

    {
      name: `${t('editProfile')}`,
      href: '/organization/edit-org-user-profile',
      icon: <FiImage size={20} />,
      bottom: true,
    },
  ];

  return (
    <div>
      <title>HOOPOE - Organization Console</title>
      {isMobile ? (
        <>
          <div className=''>
            <Sidebar
              isMobile={isMobile}
              expanded={expandedSidebar}
              toggleExpanded={toggleSidebar}
              sidebarOptions={sidebarOptions}
            />
          </div>
          <div className=' mt-12'>{props.children}</div>
        </>
      ) : (
        <>
          <div
            className={`${
              expandedSidebar ? 'w-[300px]' : 'w-[85px]'
            } fixed h-screen transition-all ease-in-out duration-300 z-50`}
          >
            <Sidebar
              isMobile={isMobile}
              expanded={expandedSidebar}
              toggleExpanded={toggleSidebar}
              sidebarOptions={sidebarOptions}
            />
          </div>
          <main
            className={`${
              expandedSidebar
                ? 'pl-[300px]'
                : !isMobile
                ? 'pl-[85px]'
                : 'pl-[2px]'
            } w-full transition-all ease-in-out duration-300`}
          >
            {props.children}
          </main>
        </>
      )}
    </div>
  );
}

export default Layout;
