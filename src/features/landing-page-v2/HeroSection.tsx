'use client';

import LandingButton from './components/Button';
import HeroCard from './components/HeroCard';
import NavBar from '@/features/volunteer/components/NavBar';
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
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { FaToggleOff, FaToggleOn } from 'react-icons/fa6';
import { FiPower } from 'react-icons/fi';
import { ImUser } from 'react-icons/im';
import { RiFileList2Fill } from 'react-icons/ri';

const HeroSection = () => {
  const { data: user } = useSession();
  const getAvatar = useAvatarImage();
  const t = useTranslations('volunteerSide.navBar');
  const t2 = useTranslations('LandingPage.heroSection');

  const [isProfileVisible, setIsProfileVisible] = useState(false);

  const toggleProfileVisibility = () => {
    setIsProfileVisible(!isProfileVisible);
  };

  return (
    <div className='xl:h-[45rem] lg:h-[35rem] md:h-[30rem] h-[70vh] xl:mb-32 lg:mb-24 md:mb-16'>
        <NavBar
          userSettings={
            user ? (
              <Popover placement='bottom-end'>
                <PopoverHandler>
                  <div className='cursor-pointer'>
                    <Image
                      width={200}
                      height={200}
                      className='w-8 h-8 sm:h-10 sm:w-10 md:w-12 rounded-full'
                      src={getAvatar(
                        user.user?.name || '',
                        user.user?.profilePicUrl
                      )}
                      alt='Rounded avatar'
                    />
                  </div>
                </PopoverHandler>
                <PopoverContent className='w-72'>
                  <div className='mb-4 flex items-center gap-4 border-b border-amber-gray-50 pb-4'>
                    <Avatar
                      src={getAvatar(
                        user.user?.name || '',
                        user.user?.profilePicUrl
                      )}
                      alt='profile pic'
                    />
                    <h1>Hello</h1>
                    <div>
                      <Typography variant='h6'>
                        {user.user.name}
                      </Typography>
                      <Typography
                        variant='small'
                        color='gray'
                        className='font-medium text-amber-gray-500'
                      >
                        {user.user.email}
                      </Typography>
                    </div>

                    <div
                      onClick={toggleProfileVisibility}
                      className='cursor-pointer mr-2'
                    >
                      {isProfileVisible ? (
                        <FaToggleOn size={20} color='green' />
                      ) : (
                        <FaToggleOff size={20} color='gray' />
                      )}
                    </div>
                    <Typography variant='small'>
                      {isProfileVisible
                        ? 'Profile is visible'
                        : 'Make your profile visible'}
                    </Typography>
                  </div>
                  <List className='p-2'>
                    <Link
                      href={`/talent/profile`}
                      className='text-initial font-medium text-amber-gray-500'
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
                      className='text-initial font-medium text-amber-gray-500'
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
                      className='text-initial font-medium text-amber-gray-500'
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
                          className='capitalize items-center rounded-full text-amber-gray-500 w-50 font-epilogue font-bold text-md p-0'
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
        <div className='container h-screen md:grid md:grid-cols-2 md:gap-20 xl:gap-52 mt-4 md:mt-16 content-center px-5'>
          <div className='md:col-span-1 flex flex-col gap-4 lg:pl-10 justify-self-start px-2'>
            <h1 className='text-3xl lg:text-4xl xl:text-5xl font-bold flex flex-col gap-6 mb-3 text-[#373636]'>
              {t2('moto.serve')} <br className='mb-2' />
              {t2('moto.connect')} {t2('moto.grow')}
            </h1>
            <p className='text-base lg:text-lg font-light'>
              {t2('description')}
            </p>
            <div className='flex gap-5'>
              <Link href='/talent/opportunities'>
                <LandingButton
                  text={t2('btn.findOpportunities')}
                  fill={false}
                />
              </Link>
              <Link href='/login'>
                <LandingButton text={t2('btn.postOpportunities')} fill={true} />
              </Link>
              {/* <Link href='/login'>
                <LandingButton text='Login' fill={false} />{' '}
              </Link>{' '}
              <Link href='/signup'>
                <LandingButton text='Sign Up' fill={true} />
              </Link> */}
            </div>
          </div>
          {/* The circle thing */}
          <div className='hidden md:block md:col-span-1 justify-self-start'>
            <div className='lg:w-96 lg:h-96 w-72 h-72 flex justify-center items-center'>
              <div className='relative xl:w-24 xl:h-24 lg:w-16 lg:h-16 h-14 w-14 mb-16'>
                <div className='absolute w-full h-full flex justify-center items-center'>
                  <Image
                    width={100}
                    height={100}
                    className='w-28'
                    src='/assets/Akill Logo 2.png'
                    alt='Masar Logo'
                  />
                </div>
                <div className='absolute w-full h-full rounded-full bg-lighterPrimary/10 scale-[2]'></div>
                <div className='absolute w-full h-full rounded-full bg-lighterPrimary/10 scale-[4]'></div>
                <div className='absolute w-full h-full rounded-full bg-lighterPrimary/10 scale-[6]'></div>
                <div className='absolute w-full h-full rounded-full bg-lighterPrimary/50 animate-expand-contract-2 delay-1000'></div>
                <div className='absolute w-full h-full rounded-full bg-lighterPrimary/30 animate-expand-contract-3 delay-1000'></div>
                <div className='absolute w-full h-full rounded-full bg-lighterPrimary/20 animate-expand-contract-4 delay-1000'></div>
               {/* HeroCard components placed around the third circle */}
<div className='relative w-full h-full'>
  {/* Top Right */}
  <div className='absolute xl:top-[-210%] xl:left-[200%] top-[-150%] left-[250%] transform -translate-x-1/2'>
    <HeroCard
      image={'/assets/herosection/fatima-al-thani.jpg'}
      title={'Fatima Al-Thani'}
      subTitle={'Teacher'}
      rating={5}
    />
  </div>
  {/* Top Left */}
  <div className='absolute xl:top-[-180%] xl:right-[200%] top-[-200%] right-[250%] transform translate-x-1/2'>
    <HeroCard
      image={'/assets/herosection/qatar-charity.jpg'}
      title={'Qatar Charity'}
      subTitle={'Community Support'}
    />
  </div>
  {/* Middle Left */}
  <div className='hidden xl:block absolute top-[60%] left-[-300%] transform -translate-y-1/2'>
    <HeroCard
      image={'/assets/herosection/ahmed-al-mansoori.jpg'}
      title={'Ahmed Al-Mansoori'}
      subTitle={'Data Scientist'}
      rating={5}
    />
  </div>
  {/* Middle Right */}
  <div className='hidden xl:block absolute top-[40%] right-[-330%] transform -translate-y-1/2'>
    <HeroCard
      image={'/assets/herosection/noora-al-siddiqi.jpg'}
      title={'Noora Al-Siddiqi'}
      subTitle={'Marketing Specialist'}
      rating={4}
    />
  </div>
  {/* Bottom Right */}
  <div className='absolute bottom-[-180%] xl:left-[270%] left-[310%] transform -translate-x-1/2'>
    <HeroCard
      image={'/assets/herosection/Barwa_Group.jpg'}
      title={'Barwa Group'}
      subTitle={'Real Estate Company'}
    />
  </div>
  {/* Bottom Left */}
  <div className='absolute bottom-[-200%] right-[200%] transform translate-x-1/2'>
  
    <HeroCard
      image={'/assets/herosection/Qatari-Diar.jpg'}
      title={'Qatari Diar'}
      subTitle={'Company'}
    />
  </div>
</div>
              </div>
            </div>
          </div>
        </div>
    </div>
  );
};

export default HeroSection;