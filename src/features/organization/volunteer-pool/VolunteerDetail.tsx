'use client';

import {
  useGetVolunteerDetailQuery,
  useUpdateVolunteerPoolMutation,
} from '@/app/api/slices/volunteer-api-slice';
import ErrorPage from '@/components/ErrorPage';
import LoadingPage from '@/components/LoadingPage';
import OrgInfoWithIcon from '@/features/organization/components/OrgInfoWithIcon';
import PageTitle from '@/features/organization/components/PageTitle';
import Tag from '@/features/organization/components/Tag';
import { useAvatarImage } from '@/hook';
import { Avatar } from '@material-tailwind/react';
import moment from 'moment';
import { useTranslations } from 'next-intl';
import { Key, useState } from 'react';
import { BiLogoLinkedin } from 'react-icons/bi';
import { FaFilePdf } from 'react-icons/fa';
import { MdOutlineMarkEmailUnread } from 'react-icons/md';
import { PiPhoneLight } from 'react-icons/pi';

const email = <MdOutlineMarkEmailUnread className='text-[#26A4FF] text-xl' />;
const phone = <PiPhoneLight className='text-[#26A4FF] text-xl' />;
const linkedIn = <BiLogoLinkedin className='text-[#26A4FF] text-xl' />;
const pdf = <FaFilePdf className='text-[#26A4FF] text-xl' />;

const titleStyle = 'text-neutrals100 text-xl font-semibold mb-1';

function ViewUserDetail({
  userId,
  onClose,
  roleIsUser,
}: {
  userId: string;
  onClose: () => void;
  roleIsUser: boolean;
}) {
  const { data, isFetching, isError } = useGetVolunteerDetailQuery(userId);
  const [updateVolunteerPool] = useUpdateVolunteerPoolMutation();
  const getAvatar = useAvatarImage();

  const t = useTranslations('ApplicantDetailPage');
  const [showContacts, setShowContacts] = useState(false);
  if (isFetching) {
    return <LoadingPage />;
  }

  if (isError || !data) {
    return <ErrorPage imageName='404.svg' title='User not found' />;
  }

  const userDetail = data?.data;

  const toggleContacts = () => {
    setShowContacts(!showContacts);
    if (!userDetail.is_connected) {
      // Update user detail on backend if not connected
      updateVolunteerPool(
        {
          userID: userId,
          connectionStatus: 'connected',
        } // Assuming connectionStatus is a boolean field
      );
    }
  };
  const ageFromDateOfBirth = (dateOfBirth: any): number => {
    return moment().diff(dateOfBirth, 'years');
  };

  const NOTPROVIDED = (
    <p className='text-xs text-neutrals60'>{t('notProvided')}</p>
  );
  return (
    <section
      className={`font-epilogue container fixed top-4 right-0 h-full ${
        roleIsUser ? 'w-1/2' : 'w-2/6'
      }  z-10 overflow-y-auto bg-[#E9EBFD] rounded-none pt-2 px-2`}
    >
      <PageTitle
        title='User Detail'
        hideBack={true}
        isSideBar={true}
        onClick={onClose}
      />

      <main className='flex flex-col md:flex-row  gap-x-4 p-2'>
        {/* Left side */}
        <div
          className={` flex w-fit flex-col gap-y-2 border border-neutral20 ${
            roleIsUser ? 'md:basis-2/3' : 'md:basis-full'
          } p-4`}
        >
          {/* profile */}
          <div className='flex gap-x-2 md:pb-4 items-center'>
            <Avatar
              className='rounded-full  md:w-[80px] md:h-[80px]'
              src={getAvatar(userDetail?.name, undefined)}
              alt='avatar'
            />
            <div>
              <p className='text-neutrals100 font-black text-xl md:text-3xl font-poppins capitalize'>
                {userDetail?.name}
              </p>
            </div>
          </div>
          {/* Date and location */}
          <div className='bg-neutral20 rounded-xl p-2 '>
            <div>
              <div className=' flex text-sm md:text-base space-x-2 justify-between'>
                <p className=' text-neutrals60'>
                  {t('personalInformation.age')}
                </p>
                <p className=' text-neutrals100 font-medium capitalize'>
                  {userDetail.birthYear
                    ? ageFromDateOfBirth(userDetail.birthYear)
                    : NOTPROVIDED}
                </p>
              </div>
              <div className=' flex text-sm md:text-base space-x-2 justify-between'>
                <p className=' text-neutrals60'>
                  {t('personalInformation.gender')}
                </p>
                <p className=' text-neutrals100 font-medium capitalize'>
                  {userDetail.gender ? userDetail.gender : NOTPROVIDED}
                </p>
              </div>

              <div className=' flex text-sm md:text-base space-x-2 justify-between'>
                <p className=' text-neutrals60'>
                  {t('personalInformation.location')}
                </p>
                <p className=' text-neutrals100 font-medium capitalize'>
                  {userDetail.address}
                </p>
              </div>
            </div>
          </div>
          {/* ​contact */}
          {/* <hr className='text-lightGrey my-2' /> */}
          <p className={titleStyle}>{t('personalInformation.contact.title')}</p>
          <div className='flex flex-col gap-5'>
            {!userDetail.is_connected && !showContacts && (
              <button
                className='flex space-x-2 text-bgPrimary underline'
                onClick={toggleContacts}
              >
                Show Contacts
              </button>
            )}
            {/* Email and phone */}
            {userDetail.is_connected && (
              <>
                <OrgInfoWithIcon
                  icon={email}
                  title={t('personalInformation.contact.email')}
                  value={userDetail.email}
                  valueStyle='text-nuetrals100 text-base'
                />
                <OrgInfoWithIcon
                  icon={phone}
                  title={t('personalInformation.contact.phone')}
                  value={userDetail.phone}
                  valueStyle='text-nuetrals100 text-base'
                />
              </>
            )}

            <OrgInfoWithIcon
              icon={linkedIn}
              title={t('personalInformation.contact.linkedIn')}
              value={
                userDetail?.linkedIn ? (
                  <a
                    target='_blank'
                    className='flex space-x-2'
                    href={userDetail?.linkedIn}
                  >
                    <p className=' truncate w-60'>{userDetail?.linkedIn}</p>
                  </a>
                ) : (
                  NOTPROVIDED
                )
              }
              valueStyle='text-bgPrimary text-base'
            />
          </div>
          ​
        </div>
        <div className='flex flex-col gap-5'>
          {/* inner first row */}
          <div className='flex gap-3 flex-col'>
            <div className='basis-2/3'>
              <p className={`${titleStyle} text-neutrals60`}>
                {t('skillSets')}
              </p>
              <div className='flex  gap-2 w-fit flex-wrap '>
                {userDetail.skills && !(userDetail.skills[0] === '[]')
                  ? userDetail.skills?.map(
                      (value: string, index: Key | null | undefined) => (
                        <Tag
                          key={index}
                          text={value}
                          textColor={'#C4897B'}
                          smallBorderRadius
                        />
                      )
                    )
                  : NOTPROVIDED}
              </div>
            </div>
          </div>
          <p className={titleStyle}>{t('documents.title')}</p>
          <div className='flex flex-col gap-3'>
            <OrgInfoWithIcon
              icon={pdf}
              title={t('documents.resume')}
              value={
                userDetail.resumeURL ? (
                  <a
                    target='_blank'
                    className='flex space-x-2'
                    href={userDetail.resumeURL}
                  >
                    <p className=' truncate w-60'>{userDetail.resumeURL}</p>
                  </a>
                ) : (
                  NOTPROVIDED
                )
              }
              valueStyle='text-bgPrimary text-base'
            />
          </div>
          <p className={`${titleStyle} text-neutrals60`}>About Me</p>
          <div className='flex flex-col gap-3'>
            <p className='text-neutrals100 font-medium text-base border-2 border-neutral20 rounded-lg p-2'>
              {userDetail.aboutMe ? userDetail.aboutMe : NOTPROVIDED}
            </p>
          </div>
        </div>
      </main>
    </section>
  );
}

export default ViewUserDetail;
