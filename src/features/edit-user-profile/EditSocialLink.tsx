import { EditProfileProps } from './EditSkills';
import ProfileCard from './components/ProfileCard';
import ProfileDialog from './components/ProfileDialog';
import { updateProfile } from './profile-slice';
import { useEditProfileForUserMutation } from '@/app/api/slices/volunteer-api-slice';
import { AboutOrgFormSchema } from '@/app/api/types';
import { useAppDispatch, useAppSelector } from '@/hook';
import { Typography, Input } from '@material-tailwind/react';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { CiGlobe } from 'react-icons/ci';
import { FaLinkedinIn, FaXTwitter } from 'react-icons/fa6';
import { toast } from 'react-toastify';
import { ZodError } from 'zod';

const EditSocialLink = () => {
  const [openSocial, setOpenSocial] = useState(false);
  const profileData = useAppSelector((state) => state.profile.profile);

  const t = useTranslations('EditProfile');

  const handleOpenSocial = () => {
    setOpenSocial((prev) => !prev);
  };
  return (
    <ProfileCard handleButtonClick={handleOpenSocial}>
      <Typography className='font-inherit font-semibold text-lg text-primary capitalize mb-2'>
        {t('Socials')}
      </Typography>
      <div className='flex space-x-3 mb-2'>
        <FaLinkedinIn size={20} className='shrink-0' />
        <div className='w-11/12'>
          <Typography className='font-poppins text-primary font-medium text-sm'>
            {t('LinkedIn')}
          </Typography>
          <Link href={profileData?.linkedIn || ''} target='_blank'>
            <Typography
              className={`font-poppins font-normal truncate text-sm ${
                profileData.linkedIn
                  ? 'text-bgPrimary underline'
                  : 'text-tertiary'
              }`}
            >
              {profileData?.linkedIn || 'Not provided'}
            </Typography>
          </Link>
        </div>
      </div>
      <div className='flex space-x-3 mb-2'>
        <FaXTwitter size={20} className='shrink-0' />
        <div className='w-11/12'>
          <Typography className='font-poppins text-primary font-medium text-sm'>
            {t('X')}
          </Typography>
          <Link href={profileData?.twitter || ''} target='_blank'>
            <Typography
              className={`font-poppins font-normal truncate text-sm ${
                profileData.twitter
                  ? 'text-bgPrimary underline'
                  : 'text-tertiary'
              }`}
            >
              {' '}
              {profileData?.twitter || 'Not provided'}
            </Typography>
          </Link>
        </div>
      </div>
      <div className='flex space-x-3 mb-2'>
        <CiGlobe size={23} className='shrink-0' />
        <div className='w-11/12'>
          <Typography className='font-poppins text-primary font-medium text-sm'>
            {t('Website')}
          </Typography>

          <Link href={profileData?.website || ''} target='_blank'>
            <Typography
              className={`font-poppins font-normal truncate text-sm ${
                profileData.website
                  ? 'text-bgPrimary underline'
                  : 'text-tertiary'
              }`}
            >
              {' '}
              {profileData?.website || 'Not provided'}
            </Typography>
          </Link>
        </div>
      </div>

      <EditSocial handleOpen={handleOpenSocial} openDialog={openSocial} />
    </ProfileCard>
  );
};
export default EditSocialLink;

const EditSocial = ({ handleOpen, openDialog }: EditProfileProps) => {
  const profileData = useAppSelector((state) => state.profile.profile);
  const dispatch = useAppDispatch();

  const t = useTranslations('EditProfile');

  const [twitter, setTwitter] = useState('');
  const [linkedIn, setLinkedIn] = useState('');
  const [website, setWebsite] = useState('');
  const [linkedInError, setLinkedInError] = useState('');
  const [twitterError, setTwitterError] = useState('');
  const [websiteError, setWebsiteError] = useState('');
  const [loading, setLoading] = useState(false);

  const [editProfileForUser] = useEditProfileForUserMutation();

  useEffect(() => {
    if (profileData.linkedIn) setLinkedIn(profileData.linkedIn);
    if (profileData.twitter) setTwitter(profileData.twitter);
    if (profileData.website) setWebsite(profileData.website);
  }, [profileData]);

  const handleLinkedInChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newLinkedIn = e.target.value;
    setLinkedIn(newLinkedIn);
    const linkedInFieldSchema = AboutOrgFormSchema.shape.linkedIn;
    try {
      linkedInFieldSchema.parse(newLinkedIn);
      setLinkedInError('');
    } catch (error) {
      if (error instanceof ZodError) {
        setLinkedInError(error.errors[0].message);
      }
    }
  };

  const handleTwitterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTwitter = e.target.value;
    setTwitter(newTwitter);
    const twitterFieldSchema = AboutOrgFormSchema.shape.twitter;
    try {
      twitterFieldSchema.parse(newTwitter);
      setTwitterError('');
    } catch (error) {
      if (error instanceof ZodError) {
        setTwitterError(error.errors[0].message);
      }
    }
  };

  const handleWebsiteChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newWebsite = e.target.value;
    setWebsite(newWebsite);
    const websiteFieldSchema = AboutOrgFormSchema.shape.website;
    try {
      websiteFieldSchema.parse(newWebsite);
      setWebsiteError('');
    } catch (error) {
      if (error instanceof ZodError) {
        setWebsiteError(error.errors[0].message);
      }
    }
  };

  const handleSaveChanges = async (e: React.FormEvent) => {
    e.preventDefault(); // Prevent form submission
    setLoading(true);

    // Create an object with the updated data
    const updatedData = {
      twitter: twitter,
      linkedIn: linkedIn,
      website: website,
    };

    const mergedData = {
      ...profileData,
      ...updatedData,
    };

    // Call the mutation function to update the profile
    await editProfileForUser(mergedData)
      .unwrap()
      .then(async () => {
        dispatch(updateProfile(updatedData));
        handleOpen();
        toast.success('Profile updated successfully!', {
          theme: 'light',
        });
      })
      .catch((errorResponse: { data: { message: string }; status: number }) => {
        if (errorResponse.data) {
          toast.error(errorResponse.data.message, {
            autoClose: false,
            theme: 'light',
          });
        } else {
          toast.error('An unknown error occurred', {
            autoClose: false,
            theme: 'light',
          });
        }
      });

    setLoading(false);
  };
  return (
    <ProfileDialog
      openDialog={openDialog || false}
      handleSaveChanges={handleSaveChanges}
      handleOpenDialog={handleOpen}
      loading={loading}
    >
      <Typography className='font-poppins text-xl font-medium text-black mb-2'>
        {t('Socials')}
      </Typography>
      <Typography className='font-poppins text-xs font-normal text-secondary'>
        {t('Socials Description')}
      </Typography>
      <div className='flex flex-col space-y-4 my-4'>
        <div>
          <div className='flex gap-2 items-center mb-1'>
            <FaLinkedinIn size={15} className='text-tertiary' />
            <label
              htmlFor='linkedIn'
              className='font-poppins font-medium text-primary text-sm'
            >
              {t('LinkedIn')}
            </label>
          </div>
          <Input
            crossOrigin={undefined}
            name='linkedIn'
            className='focus:!border-lighterPrimary border !border-gray-300 !font-poppins text-sm'
            labelProps={{ className: 'hidden' }}
            defaultValue={linkedIn}
            onChange={handleLinkedInChange}
          />
          <Typography className='text-red-500 text-xs font-poppins'>
            {linkedInError}
          </Typography>
        </div>
        <div>
          <div className='flex gap-2 items-center mb-1'>
            <FaXTwitter size={15} className='text-tertiary' />
            <label
              htmlFor='x'
              className='font-poppins font-medium text-primary text-sm'
            >
              {t('X')}
            </label>
          </div>

          <Input
            crossOrigin={undefined}
            name='phone'
            className='focus:!border-lighterPrimary border !border-gray-300 !font-poppins text-sm'
            labelProps={{ className: 'hidden' }}
            defaultValue={twitter}
            onChange={handleTwitterChange}
          />
          <Typography className='text-red-500 text-xs font-poppins'>
            {twitterError}
          </Typography>
        </div>
        <div>
          <div className='flex gap-2 items-center mb-1'>
            <CiGlobe size={18} className='text-tertiary' />
            <label
              htmlFor='website'
              className='font-poppins font-medium text-primary text-sm'
            >
              {t('Website')}
            </label>
          </div>
          <Input
            crossOrigin={undefined}
            name='address'
            className='focus:!border-lighterPrimary border !border-gray-300 !font-poppins text-sm'
            labelProps={{ className: 'hidden' }}
            defaultValue={website}
            onChange={handleWebsiteChange}
          />
          <Typography className='text-red-500 text-xs font-poppins'>
            {websiteError}
          </Typography>
        </div>
      </div>
    </ProfileDialog>
  );
};
