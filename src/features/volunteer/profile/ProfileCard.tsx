'use client';

import {
  useGetCertificatesQuery,
  useGetProfileQuery,
} from '@/app/api/slices/volunteer-api-slice';
import LoadingPage from '@/components/LoadingPage';
import OrgInfoWithIcon from '@/features/organization/components/OrgInfoWithIcon';
import { useAvatarImage } from '@/hook';
import { faClose } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  Card,
  CardHeader,
  CardBody,
  Typography,
  Avatar,
  Chip,
  IconButton,
} from '@material-tailwind/react';
import { CiLinkedin } from 'react-icons/ci';
import { IoIosPhonePortrait } from 'react-icons/io';
import { IoIosPaper } from 'react-icons/io';
import { MdOutlineMailOutline } from 'react-icons/md';
import { PiCertificateLight } from 'react-icons/pi';

type ChipColor = 'orange' | 'amber' | 'gray' | 'teal' | 'cyan' | 'light-blue';
const tagColors: ChipColor[] = [
  'orange',
  'amber',
  'gray',
  'teal',
  'cyan',
  'light-blue',
];

function ProfileCard({ onClose }: { onClose: () => void }) {
  const getAvatar = useAvatarImage();
  const { data, isFetching } = useGetProfileQuery();
  const { data: certificatesData } = useGetCertificatesQuery();

  if (isFetching) {
    return <LoadingPage />;
  }

  const profileData = data?.data;
  const NOTPROVIDED = <p className='text-xs text-neutrals60'>NOT PROVIDED</p>;
  return (
    <Card className='container  p-4'>
      <div className='flex justify-between w-full pb-4'>
        <Chip
          variant='outlined'
          value=' Edit Profile'
          className='rounded-full hover:bg-primary text-neutrals100 font-poppins font-medium cursor-pointer'
          color='amber'
        ></Chip>
        <IconButton
          className=' bg-neutrals100 hover:bg-primary  rounded-full  p-2.5 inline-flex items-center '
          onClick={onClose}
        >
          <FontAwesomeIcon size='xl' icon={faClose} />
        </IconButton>
      </div>
      <CardHeader
        color='transparent'
        floated={false}
        shadow={false}
        className='mx-0 flex items-center gap-4 pb-4'
      >
        <Avatar
          size='lg'
          variant='circular'
          src={getAvatar(profileData?.name || '', profileData?.profilePicUrl)}
          alt='profile pic'
        />

        <div className='flex w-full flex-col gap-0.5'>
          <div className='flex items-center justify-between'>
            <Typography
              variant='h5'
              color='blue-gray'
              className='text-neutrals100 font-black text-lg md:text-xl font-poppins capitalize'
            >
              {profileData?.name}
            </Typography>
            <div className='5 flex items-center gap-0'></div>
          </div>
        </div>
      </CardHeader>

      <CardBody className='p-0'>
        <div className='flex-col'>
          <Typography
            variant='h6'
            className='font-poppins text-neutrals100 font-semibold pb-4'
          >
            Skills
          </Typography>
          <div className='flex flex-wrap gap-2'>
            {profileData?.skills?.map((item, index) => {
              const currentColor = tagColors[index % tagColors.length];
              return (
                <Chip
                  variant='outlined'
                  key={index}
                  value={item.toUpperCase()}
                  className='rounded-full capitalize font-poppins font-medium'
                  color={currentColor}
                />
              );
            })}
          </div>
        </div>
        <div className='flex-col'>
          <Typography
            variant='h6'
            className='font-poppins text-neutrals100 font-semibold pb-4'
          >
            Language
          </Typography>
          <div className='flex flex-wrap gap-2'>
            {profileData?.languages?.map((item, index) => {
              const currentColor = tagColors[index % tagColors.length];
              return (
                <Chip
                  variant='outlined'
                  key={index}
                  value={item.toUpperCase()}
                  className='rounded-full capitalize font-poppins font-medium'
                  color={currentColor}
                />
              );
            })}
          </div>
        </div>
        <hr className='my-4' />
        <div className='flex-col'>
          <Typography
            variant='h6'
            className='font-poppins text-neutrals100 font-semibold pb-4'
          >
            About Me
          </Typography>
          <Typography className='font-epilogue text-black'>
            {profileData?.aboutMe}
          </Typography>
        </div>
        <hr className='my-4' />
        <div className='flex-col '>
          <Typography
            variant='h6'
            className='font-poppins text-neutrals100 font-semibold pb-4'
          >
            Contact
          </Typography>
          <div className='flex space-x-4 '>
            <MdOutlineMailOutline size={24} />
            <div className='flex-col font-poppins'>
              <Typography className='font-poppins font-medium'>
                Email
              </Typography>
              <Typography className='font-epilogue text-black'>
                {profileData?.email}
              </Typography>
            </div>
          </div>
          <div className='flex space-x-4'>
            <IoIosPhonePortrait size={24} />
            <div className='flex-col'>
              <Typography className='font-poppins font-medium'>
                Phone
              </Typography>
              <Typography className='font-epilogue text-black'>
                {profileData?.phone}
              </Typography>
            </div>
          </div>
          <div className='flex space-x-4'>
            <CiLinkedin size={24} />
            <div className='flex-col'>
              <Typography className='font-poppins font-medium'>
                LinkedIn
              </Typography>
              <Typography className='font-epilogue text-amber-600'>
                {profileData?.linkedIn}
              </Typography>
            </div>
          </div>
        </div>
        <hr className='my-4' />
        <div className='flex-col '>
          <Typography
            variant='h6'
            className='font-poppins text-neutrals100 font-semibold pb-4'
          >
            Documents
          </Typography>
          <div className='flex space-x-4'>
            <OrgInfoWithIcon
              icon={<IoIosPaper size={24} />}
              title='Resume'
              value={
                profileData?.resumeURL ? (
                  <a
                    target='_blank'
                    className='flex space-x-2'
                    href={profileData?.resumeURL}
                  >
                    <p className=' font-semibold text-xs sm:text-base text-amber-600 truncate w-60'>
                      {profileData?.resumeURL}
                    </p>
                  </a>
                ) : (
                  NOTPROVIDED
                )
              }
              valueStyle=' text-bgPrimary text-base'
            />
          </div>
          <div className='flex space-x-4 px-2 py-1'>
            <PiCertificateLight size={24} />
            <div className='flex-col'>
              <Typography className='font-poppins font-medium mb-3'>
                Certificates
              </Typography>
              {certificatesData?.data?.map((item, index) => {
                return (
                  <div
                    className='mb-4 flex items-center gap-4 border-b border-blue-gray-50 pb-4'
                    key={index}
                  >
                    <Avatar
                      src={getAvatar(item.orgName || '', item.logoURL)}
                      alt='profile pic'
                    />
                    <div>
                      <Typography
                        variant='h6'
                        color='blue-gray'
                        className='font-poppins font-medium'
                      >
                        {item.eventName}
                      </Typography>
                      <Typography
                        variant='small'
                        color='gray'
                        className='font-medium text-blue-gray-500'
                      >
                        {item.orgName}
                      </Typography>
                      <a
                        target='_blank'
                        className='flex space-x-2 '
                        href={item.certificateURL}
                      >
                        <p className='font-semibold text-xs sm:text-base text-amber-600 truncate w-60'>
                          {item.certificateURL}
                        </p>
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </CardBody>
    </Card>
  );
}

export default ProfileCard;
