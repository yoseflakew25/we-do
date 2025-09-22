'use client';

import { useGetOrgDetailByUserIDQuery } from '@/app/api/slices/org-api-slice';
import {
  useDeleteUserMutation,
  useGetUserDetailQuery,
} from '@/app/api/slices/volunteer-api-slice';
import ConfirmDialog, { DialogData } from '@/components/ConfirmDialog';
import ErrorPage from '@/components/ErrorPage';
import LoadingPage from '@/components/LoadingPage';
import OrgInfoWithIcon from '@/features/organization/components/OrgInfoWithIcon';
import PageTitle from '@/features/organization/components/PageTitle';
import StatCard from '@/features/organization/components/StatCard';
import Tag from '@/features/organization/components/Tag';
import { useAvatarImage } from '@/hook';
import { Button } from '@material-tailwind/react';
import {
  List,
  ListItem,
  ListItemPrefix,
  Avatar,
  Card,
  Typography,
} from '@material-tailwind/react';
import moment from 'moment';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Key, useState } from 'react';
import { BiLogoLinkedin } from 'react-icons/bi';
import { FaFilePdf } from 'react-icons/fa';
import { MdOutlineMarkEmailUnread } from 'react-icons/md';
import { PiPhoneLight } from 'react-icons/pi';
import { toast } from 'react-toastify';

const email = <MdOutlineMarkEmailUnread className='text-[#26A4FF] text-xl' />;
const phone = <PiPhoneLight className='text-[#26A4FF] text-xl' />;
const linkedIn = <BiLogoLinkedin className='text-[#26A4FF] text-xl' />;
const pdf = <FaFilePdf className='text-[#26A4FF] text-xl' />;

const titleStyle = 'text-neutrals100 text-xl font-semibold mb-1';

function ViewUserDetail({
  userId,
  onClose,
  onDeleteSuccess,
  roleIsUser,
}: {
  userId: string;
  onClose: () => void;
  onDeleteSuccess: () => void;
  roleIsUser: boolean;
}) {
  const router = useRouter();
  const { data, isFetching, isError } = useGetUserDetailQuery(userId);
  const { data: associatedOrgDetail } = useGetOrgDetailByUserIDQuery(userId);
  const getAvatar = useAvatarImage();
  const [showDialog, setShowDialog] = useState(true);
  const [dialogData, setDialogData] = useState<DialogData>();
  const t = useTranslations('ApplicantDetailPage');
  const [deleteUser] = useDeleteUserMutation();

  if (isFetching) {
    return <LoadingPage />;
  }

  if (isError || !data) {
    return <ErrorPage imageName='404.svg' title='User not found' />;
  }

  const userDetail = data?.data;

  const onDeleteClick = () => {
    setShowDialog(true);
    setDialogData({
      title: 'Are you sure you wish to delete the user?',
      description: 'This is an irreversable action.',
      action: async () => {
        await deleteUser({ ids: [userId] })
          .unwrap()
          .then(() => {
            toast.success('User account deleted successfully!', {
              theme: 'light',
            });
            onClose();
            onDeleteSuccess();
          })
          .catch(
            (errorResponse: { data: { message: string }; status: number }) => {
              toast.error(errorResponse.data.message, {
                autoClose: false,
                theme: 'light',
              });
            }
          );
        router.refresh();
      },
      color: 'pink',
      actionName: 'Delete',
    });
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
        rightComponent={
          <div>
            <Button
              color='pink'
              variant='outlined'
              size='sm'
              onClick={onDeleteClick}
            >
              Delete
            </Button>
          </div>
        }
      />

      <main className='flex flex-col md:flex-row  gap-x-4 p-2'>
        {/* Left side */}
        <div
          className={` flex w-fit flex-col gap-y-2 border border-neutral20 ${
            roleIsUser ? 'md:basis-1/3' : 'md:basis-full'
          } p-4`}
        >
          {/* profile */}
          <div className='flex gap-x-2 md:pb-4 items-center'>
            <Avatar
              className='rounded-full  md:w-[80px] md:h-[80px]'
              src={getAvatar(userDetail?.profile.name, undefined)}
              alt='avatar'
            />
            <div>
              <p className='text-neutrals100 font-black text-xl md:text-3xl font-poppins capitalize'>
                {userDetail?.profile.name}
              </p>
            </div>
          </div>
          {/* Date and location */}
          <div className='bg-neutral20 rounded-xl p-2 '>
            <hr className='text-lightGrey my-2 ' />​
            <div>
              <div className=' flex text-sm md:text-base space-x-2 justify-between'>
                <p className=' text-neutrals60'>
                  {t('personalInformation.age')}
                </p>
                <p className=' text-neutrals100 font-medium capitalize'>
                  {userDetail.profile.birthYear
                    ? ageFromDateOfBirth(userDetail.profile.birthYear)
                    : NOTPROVIDED}
                </p>
              </div>
              <div className=' flex text-sm md:text-base space-x-2 justify-between'>
                <p className=' text-neutrals60'>
                  {t('personalInformation.gender')}
                </p>
                <p className=' text-neutrals100 font-medium capitalize'>
                  {userDetail.profile.gender
                    ? userDetail.profile.gender
                    : NOTPROVIDED}
                </p>
              </div>
              <div className=' flex text-sm md:text-base space-x-2 justify-between'>
                <p className=' text-neutrals60'>
                  {t('personalInformation.location')}
                </p>
                <p className=' text-neutrals100 font-medium capitalize'>
                  {userDetail.profile.address}
                </p>
              </div>
            </div>
          </div>
          ​{/* Associated Organization */}
          {!roleIsUser && associatedOrgDetail?.data && (
            <div>
              <hr className='text-lightGrey md:my-1' />
              <p className={titleStyle}>
                {t('personalInformation.associatedOrganization')}
              </p>
              <Card className='w-96'>
                <List>
                  <Link href={`organizations/${associatedOrgDetail?.data?.id}`}>
                    <ListItem>
                      <ListItemPrefix>
                        <Avatar
                          variant='circular'
                          alt={associatedOrgDetail?.data?.orgName}
                          src={getAvatar(
                            associatedOrgDetail?.data?.orgName || '',
                            associatedOrgDetail?.data?.LogoUrl
                          )}
                        />
                      </ListItemPrefix>
                      <div>
                        <Typography variant='h6' color='blue-gray'>
                          {associatedOrgDetail?.data?.orgName} (
                          {associatedOrgDetail?.data?.shortHandName})
                        </Typography>
                        <Typography
                          variant='small'
                          color='gray'
                          className='font-normal'
                        >
                          {associatedOrgDetail?.data?.primaryPhone}
                        </Typography>
                        <Typography
                          variant='small'
                          color='gray'
                          className='font-normal'
                        >
                          {associatedOrgDetail?.data?.email}
                        </Typography>
                      </div>
                    </ListItem>
                  </Link>
                </List>
              </Card>
            </div>
          )}
          <hr className='text-lightGrey md:my-1' />​{/* contact */}
          <p className={titleStyle}>{t('personalInformation.contact.title')}</p>
          <div className='flex flex-col gap-5'>
            <OrgInfoWithIcon
              icon={email}
              title={t('personalInformation.contact.email')}
              value={userDetail.profile.email}
              valueStyle='text-nuetrals100 text-base'
            />
            <OrgInfoWithIcon
              icon={phone}
              title={t('personalInformation.contact.phone')}
              value={userDetail.profile.phone}
              valueStyle='text-nuetrals100 text-base'
            />
            <OrgInfoWithIcon
              icon={linkedIn}
              title={t('personalInformation.contact.linkedIn')}
              value={
                userDetail.profile.linkedIn ? (
                  <a
                    target='_blank'
                    className='flex space-x-2'
                    href={userDetail.profile.linkedIn}
                  >
                    <p className=' truncate w-60'>
                      {userDetail.profile.linkedIn}
                    </p>
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
        {/* Right side */}
        {roleIsUser && (
          <div className='border border-neutral20 basis-2/3 p-4'>
            <div>
              <p className='text-neutrals100 text-lg font-semibold w-fit border-b-4 border-lighterPrimary rounded-md pb-2  text-center'>
                Talent Statistics
              </p>
              <hr className='text-lightGrey mb-6' />​ ​{/*  second section*/}
              <div className='flex flex-col gap-5'>
                <div className='flex gap-3 flex-col'>
                  <div className='basis-2/3'>
                    <p className={`${titleStyle} text-neutrals60`}>
                      Applications
                    </p>
                    <div className='flex  gap-3 w-fit flex-wrap '>
                      <StatCard
                        label='Applied'
                        value={userDetail.applicationsCount.total}
                        textColor='blue'
                        smallBorderRadius
                      />
                      <StatCard
                        label='Hired'
                        value={userDetail.applicationsCount.accepted}
                        textColor='green'
                        smallBorderRadius
                      />
                      <StatCard
                        label='Pending'
                        value={userDetail.applicationsCount.pending}
                        textColor='yellow'
                        smallBorderRadius
                      />

                      <StatCard
                        label='Declined'
                        value={userDetail.applicationsCount.declined}
                        textColor='red'
                        smallBorderRadius
                      />
                    </div>
                  </div>
                </div>
                {/* inner first row */}
                <div className='flex gap-3 flex-col'>
                  <div className='basis-2/3'>
                    <p className={`${titleStyle} text-neutrals60`}>
                      {t('skillSets')}
                    </p>
                    <div className='flex  gap-2 w-fit flex-wrap '>
                      {userDetail.profile.skills &&
                      !(userDetail.profile.skills[0] === '[]')
                        ? userDetail.profile.skills?.map(
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
                      userDetail.profile.resumeURL ? (
                        <a
                          target='_blank'
                          className='flex space-x-2'
                          href={userDetail.profile.resumeURL}
                        >
                          <p className=' truncate w-60'>
                            {userDetail.profile.resumeURL}
                          </p>
                        </a>
                      ) : (
                        NOTPROVIDED
                      )
                    }
                    valueStyle=' text-bgPrimary text-base'
                  />
                </div>

                <p className={`${titleStyle} text-neutrals60`}>About Me</p>
                <div className='flex flex-col gap-3'>
                  <p className='text-neutrals100 font-medium text-base border-2 border-neutral20 rounded-lg p-2'>
                    {userDetail.profile.aboutMe
                      ? userDetail.profile.aboutMe
                      : NOTPROVIDED}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {dialogData && (
        <ConfirmDialog
          {...dialogData}
          isOpen={showDialog}
          dialogHandler={setShowDialog}
        />
      )}
    </section>
  );
}

export default ViewUserDetail;
