'use client';

import Footer from '@/features/landing-page/components/Footer';
import Chatbot from '@/features/volunteer/chatbot/Chatbot';
import NavBar from '@/features/volunteer/components/NavBar';
import ProfileCard from '@/features/volunteer/profile/ProfileCard';
import { useAvatarImage } from '@/hook';
import {
  Avatar,
  Popover,
  PopoverContent,
  PopoverHandler,
  Typography,
  ListItem,
  ListItemPrefix,
  Button,
} from '@material-tailwind/react';
import { useSession, signOut } from 'next-auth/react';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import React, { ReactNode, useState } from 'react';
import { FiPower } from 'react-icons/fi';
import { ImUser } from 'react-icons/im';
import { RiFileList2Fill } from 'react-icons/ri';

type Props = {
  children: ReactNode;
};

function Layout(props: Props) {
  const { data: user } = useSession();
  const getAvatar = useAvatarImage();
  const t = useTranslations('volunteerSide.navBar');
  const [showProfilePage, setShowProfilePage] = useState(false);
  const baseLinkStyle =
    'flex items-center w-full px-4 py-2 text-blue-gray-500 text-base font-normal rounded-lg transition-colors duration-200 hover:bg-blue-gray-50 hover:shadow-lg hover:text-blue-gray-900';
  const profilePicPopover = user ? (
    <Popover placement='bottom-end'>
      <PopoverHandler>
        <div className='cursor-pointer'>
          <Avatar
            src={getAvatar(user.user?.name || '', user.user?.profilePicUrl)}
            alt='profile pic'
            className='w-8 h-8'
          />
        </div>
      </PopoverHandler>
      <PopoverContent className='w-72 z-10'>
        <div className='mb-4 flex items-center gap-4 border-b border-blue-gray-50 pb-4'>
          <Avatar
            src={getAvatar(user.user?.name || '', user.user?.profilePicUrl)}
            alt='profile pic'
          />
          <div>
            <Typography variant='h6' color='blue-gray'>
              {user.user.name}
            </Typography>
            <Typography
              variant='small'
              color='gray'
              className='font-medium text-blue-gray-500'
            >
              {user.user.email}
            </Typography>
          </div>
        </div>
        <div className='p-2 space-y-2 focus:ring-0 ring-0 outline-none'>
          <Link href={`/talent/profile`} className={baseLinkStyle}>
            <ListItem className='p-2'>
              <ListItemPrefix>
                <ImUser size={25} />
              </ListItemPrefix>
              {t('profile')}
            </ListItem>
          </Link>

          <Link href={`/talent/applications`} className={baseLinkStyle}>
            <ListItem className='p-2'>
              <ListItemPrefix>
                <RiFileList2Fill size={25} />
              </ListItemPrefix>
              {t('applications')}
            </ListItem>
          </Link>

          <Link href={`/talent/bookmark`} className={baseLinkStyle}>
            <ListItem className='p-2'>
              <ListItemPrefix>
                <RiFileList2Fill size={25} />
              </ListItemPrefix>
              {t('bookMark')}
            </ListItem>
          </Link>

          <Button
            onClick={() => signOut()}
            className={`${baseLinkStyle} bg-white shadow-none normal-case ml-2`}
          >
            <FiPower size={24} className='mr-4' />
            {t('logOut')}
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  ) : null;
  return (
    <div>
      <title>HOOPOE - Connecting youth with opportunities</title>
      <div
        className={` w-full transition-all ease-in-out duration-300 min-h-screen`}
      >
        <NavBar userSettings={profilePicPopover} />
        {showProfilePage && (
          <div
            className='w-[60vw] md:w-[30vw] shadow-md pb-'
            style={{
              position: 'fixed',
              top: 10,
              left: 0,
              zIndex: 999,
              maxHeight: '100vh',
              overflowY: 'scroll',
            }}
          >
            <ProfileCard onClose={() => setShowProfilePage(false)} />
          </div>
        )}

        {props.children}
        <Chatbot />
      </div>
      <div className='bottom-0'>
        <Footer />
      </div>
    </div>
  );
}

export default Layout;
