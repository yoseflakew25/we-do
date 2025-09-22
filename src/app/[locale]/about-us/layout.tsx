'use client';

import Footer from '@/features/landing-page/components/Footer';
import Chatbot from '@/features/volunteer/chatbot/Chatbot';
import NavBar from '@/features/volunteer/components/NavBar';
import ProfileCard from '@/features/volunteer/profile/ProfileCard';
import { useAvatarImage } from '@/hook';
import {
  Avatar,
  Button,
  Popover,
  PopoverContent,
  PopoverHandler,
  Typography,
  List,
  ListItem,
  ListItemPrefix,
} from '@material-tailwind/react';
import { useSession } from 'next-auth/react';
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
  // const user = useAppSelector((state) => state.profile.profile);
  const getAvatar = useAvatarImage();
  const t = useTranslations('volunteerSide.navBar');
  const [showProfilePage, setShowProfilePage] = useState(false);

  return (
    <div>
      <title>HOOPOE - Connecting youth with opportunities</title>
      <main className={` w-full transition-all ease-in-out duration-300`}>
        <NavBar
          userSettings={
            user ? (
              <Popover placement='bottom-end'>
                <PopoverHandler>
                  <div className='cursor-pointer'>
                    <Avatar
                      src={getAvatar(
                        user.user?.name || '',
                        user.user?.profilePicUrl
                      )}
                      alt='profile pic'
                      className='w-8 h-8'
                    />
                  </div>
                </PopoverHandler>
                <PopoverContent className='w-72'>
                  <div className='mb-4 flex items-center gap-4 border-b border-blue-gray-50 pb-4'>
                    <Avatar
                      src={getAvatar(
                        user.user?.name || '',
                        user.user?.profilePicUrl
                      )}
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
                  <List className='p-2'>
                    <Link
                      href={`/talent/profile`}
                      className='text-initial font-medium text-blue-gray-500'
                    >
                      <ListItem>
                        <ListItemPrefix>
                          <ImUser size={25} />
                        </ListItemPrefix>
                        {t('profile')}
                      </ListItem>
                    </Link>

                    <Link
                      href={`/talent/applications`}
                      className='text-initial font-medium text-blue-gray-500'
                    >
                      <ListItem>
                        <ListItemPrefix>
                          <RiFileList2Fill size={25} />
                        </ListItemPrefix>
                        {t('applications')}
                      </ListItem>
                    </Link>
                    <Link
                      href={`/talent/bookmark`}
                      className='text-initial font-medium text-blue-gray-500'
                    >
                      <ListItem>
                        <ListItemPrefix>
                          <RiFileList2Fill size={25} />
                        </ListItemPrefix>
                        {t('bookMark')}
                      </ListItem>
                    </Link>
                    <Link href={`/logout`}>
                      <ListItem>
                        <ListItemPrefix>
                          <FiPower size={25} />
                        </ListItemPrefix>
                        <Button
                          variant='text'
                          size='sm'
                          type='submit'
                          color='amber'
                          className='capitalize items-center  rounded-full text-blue-gray-500 w-50 font-epilogue font-bold text-md p-0'
                        >
                          {t('logOut')}
                        </Button>
                      </ListItem>
                    </Link>
                  </List>
                </PopoverContent>
              </Popover>
            ) : null
          }
        />
        {showProfilePage && (
          <div
            className='w-[60vw] md:w-[30vw] shadow-md pb-4'
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
      </main>
      <Footer />
    </div>
  );
}

export default Layout;
