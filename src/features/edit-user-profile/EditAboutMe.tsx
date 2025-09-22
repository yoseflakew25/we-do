import { EditProfileProps } from './EditSkills';
import ProfileCard from './components/ProfileCard';
import ProfileDialog from './components/ProfileDialog';
import { updateProfile } from './profile-slice';
import { useEditProfileForUserMutation } from '@/app/api/slices/volunteer-api-slice';
import { useAppDispatch, useAppSelector } from '@/hook';
import { Typography, Textarea } from '@material-tailwind/react';
import { useTranslations } from 'next-intl';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

const EditAboutMe = () => {
  const [openAboutMe, setOpenAboutMe] = useState(false);
  const t = useTranslations('EditProfile');
  const handleOpenAboutMe = () => {
    setOpenAboutMe((prev) => !prev);
  };
  const profileData = useAppSelector((state) => state.profile.profile);

  return (
    <ProfileCard handleButtonClick={handleOpenAboutMe}>
      <Typography className='font-inherit font-semibold text-lg text-primary capitalize mb-2'>
        {t('About Me')}
      </Typography>

      <Typography className='font-inherit text-sm font-normal text-secondary'>
        {profileData.aboutMe}
      </Typography>
      <EditAbout handleOpen={handleOpenAboutMe} openDialog={openAboutMe} />
    </ProfileCard>
  );
};

export default EditAboutMe;

export const EditAbout = ({ openDialog, handleOpen }: EditProfileProps) => {
  const profileData = useAppSelector((state) => state.profile.profile);
  const dispatch = useAppDispatch();

  const [aboutMe, setAboutMe] = useState('');
  const [loading, setLoading] = useState(false);
  const [editProfileForUser] = useEditProfileForUserMutation();
  const [error, setError] = useState(''); // State for storing error message
  const t = useTranslations('EditProfile');
  const minWords = 50;
  const maxWords = 2500;

  useEffect(() => {
    if (profileData.aboutMe) setAboutMe(profileData.aboutMe);
  }, [profileData.aboutMe]);

  const handleSaveChanges = async (
    e: React.FormEvent<HTMLFormElement> | React.MouseEvent<HTMLElement>
  ) => {
    e.preventDefault(); // Prevent form submission
    const wordCount = aboutMe.trim().split(/\s+/).length;
    if (aboutMe && (wordCount < minWords || wordCount > maxWords)) {
      setError(
        `Your input must be empty or between ${minWords} and ${maxWords} words.`
      );
      return;
    }
    setError(''); // Clear error message if validation passes

    setLoading(true);
    // Create an object with the updated data
    const updatedData = {
      aboutMe: aboutMe,
    };

    const mergedData = {
      ...profileData,
      ...updatedData,
    };

    // Call the mutation function to update the profile
    await editProfileForUser(mergedData)
      .unwrap()
      .then(async () => {
        handleOpen();
        toast.success(t('About Me Updated successfully!'), {
          theme: 'light',
        });
        dispatch(updateProfile(mergedData));
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
      <Typography className='font-poppins text-xl font-semibold text-black mb-2'>
        {t('About')}
      </Typography>
      <Typography className='font-poppins text-xs font-normal text-secondary'>
        {t('About Description')}
      </Typography>
      <form onSubmit={handleSaveChanges}>
        <Textarea
          value={aboutMe}
          rows={8}
          className=' !border-gray-300 !font-poppins !text-sm text-secondary focus:!border-primary overflow-y-auto !rounded-2xl mt-4'
          labelProps={{
            className: 'hidden',
          }}
          onClick={(e) => {
            e.stopPropagation();
          }}
          onChange={(e) => setAboutMe(e.target.value)}
        />
        {/* Display error or validation message */}
        <p className='text-xs font-poppins text-red-600'>{error}</p>
        <p className='text-xs font-poppins text-gray-600'>
          Word count: {aboutMe.trim().split(/\s+/).length}/{maxWords}
        </p>
      </form>
    </ProfileDialog>
  );
};
