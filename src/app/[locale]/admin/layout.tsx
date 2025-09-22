'use client';

import Header from '@/features/organization/components/Header';
import Sidebar from '@/features/organization/components/Sidebar';
import React, { ReactNode, useEffect, useState } from 'react';
import { AiFillHome } from 'react-icons/ai';
import { BsBuildingsFill } from 'react-icons/bs';
import { FaBriefcase } from 'react-icons/fa';
import { ImUsers } from 'react-icons/im';
import { RiHandCoinFill } from 'react-icons/ri';

type Props = {
  children: ReactNode;
};

function Layout(props: Props) {
  const [expandedSidebar, setExpandedSidebar] = useState(false);

  useEffect(() => {
    // Execute sidebar update when window resizes after mount
    const handleResize = () => {
      if (window.innerWidth < 720) setExpandedSidebar(false);
    };
    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, [expandedSidebar]);

  const toggleSidebar = () => {
    setExpandedSidebar(!expandedSidebar);
  };

  const sidebarOptions = [
    {
      name: 'Home',
      href: '/admin/home',
      icon: <AiFillHome size={20} />,
    },
    {
      name: 'Organizations',
      href: '/admin/organizations',
      icon: <BsBuildingsFill size={20} />,
    },
    {
      name: 'Opportunities',
      href: '/admin/opportunities',
      icon: <RiHandCoinFill size={20} />,
    },
    {
      name: 'Users',
      href: '/admin/users',
      icon: <ImUsers size={20} />,
    },
    {
      name: 'Applications',
      href: '/admin/applications',
      icon: <FaBriefcase size={20} />,
    },
  ];

  return (
    <div>
      <title>HOOPOE - Admin Console</title>
      <div
        className={`${
          expandedSidebar ? 'w-[300px]' : 'w-[85px]'
        } fixed h-screen transition-all ease-in-out duration-300 z-50`}
      >
        <Sidebar
          isMobile={false}
          expanded={expandedSidebar}
          toggleExpanded={toggleSidebar}
          sidebarOptions={sidebarOptions}
        />
      </div>
      <main
        className={`${
          expandedSidebar ? 'pl-[300px]' : 'pl-[85px]'
        } w-full transition-all ease-in-out duration-300`}
      >
        <Header
          logoUrl='/assets/akil-logo.png'
          logoWidth={130}
          className='!bg-secondary'
        />
        {props.children}
      </main>
    </div>
  );
}

export default Layout;
