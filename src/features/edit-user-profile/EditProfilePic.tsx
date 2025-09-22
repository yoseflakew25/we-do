import { EditProfileProps } from './EditSkills';
import ProfileCompletion from './ProfileCompletion';
import ProfileCard from './components/ProfileCard';
import ProfileDialog from './components/ProfileDialog';
import { setProfile, updateProfile } from './profile-slice';
import {
  useDeleteProfilePictureForUserMutation,
  useGetProfileQuery,
} from '@/app/api/slices/volunteer-api-slice';
import {
  useEditProfileForUserMutation,
  useEditProfilePictureForUserMutation,
} from '@/app/api/slices/volunteer-api-slice';
import LoadingButton from '@/components/buttons/LoadingButton';
import { useAppDispatch, useAppSelector, useAvatarImage } from '@/hook';
import { PROFESSION_OPTIONS } from '@/select-options';
import { Avatar, Typography } from '@material-tailwind/react';
import { Input, Select, Option } from '@material-tailwind/react';
import { useSession } from 'next-auth/react';
import { useTranslations } from 'next-intl';
import { useState, useEffect, useRef } from 'react';
import { toast } from 'react-toastify';

const EditProfilePic = () => {
  const [openImage, setOpenImage] = useState(false);
  const getAvatar = useAvatarImage();
  const handleOpenImage = () => {
    setOpenImage((prev) => !prev);
  };
  const { data } = useGetProfileQuery();
  const dispatch = useAppDispatch();
  const profileData = useAppSelector((state) => state.profile.profile);

  // Update profile data in the store when data is fetched
  useEffect(() => {
    if (data?.data) {
      dispatch(setProfile(data.data));
    }
  }, [data, dispatch]);

  return (
    <ProfileCard handleButtonClick={handleOpenImage} style='items-center'>
      <Avatar
        variant='circular'
        className='rounded-full h-32 w-32 object-cover border border-lighterPrimary'
        src={getAvatar(profileData?.name || '', profileData?.profilePicUrl)}
        alt='profile pic'
      />
      <Typography className='font-poppins font-semibold text-2xl text-primary mt-2 capitalize'>
        {profileData?.name}
      </Typography>
      <Typography className='font-poppins font-normal text-lg text-tertiary capitalize '>
        {profileData?.currentPosition}
      </Typography>
      <EditImage openDialog={openImage} handleOpen={handleOpenImage} />
      <hr className='border w-[110%] border-gray-300 mt-6 mb-4' />
      <ProfileCompletion />
    </ProfileCard>
  );
};
export default EditProfilePic;

export function EditImage({
  openDialog,
  handleOpen, // refetchProfile,
}: EditProfileProps) {
  const getAvatar = useAvatarImage();
  const profileData = useAppSelector((state) => state.profile.profile);
  const dispatch = useAppDispatch();
  const { update } = useSession();
  const [image, setImage] = useState<string | null>(null);
  const [firstname, setFirstName] = useState('');
  const [lastname, setLastName] = useState('');
  const [currentPosition, setCurrentPosition] = useState('');
  const [photo, setPhoto] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [editProfileForUser] = useEditProfileForUserMutation();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [editProfilePictureForUser] = useEditProfilePictureForUserMutation();
  const [deleteProfilePictureForUser] =
    useDeleteProfilePictureForUserMutation();
  const t = useTranslations('EditProfile');
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (profileData?.currentPosition) {
      setCurrentPosition(profileData.currentPosition);
    }
    if (profileData?.name) {
      const [first, last] = profileData.name.split(' ').concat(['', '']);
      setFirstName(first);
      setLastName(last);
    }
    if (profileData?.profilePicUrl) {
      setImage(profileData.profilePicUrl);
    }
  }, [profileData]);

  const openFileInput = () => {
    fileInputRef.current?.click();
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const fileType = file.type.split('/')[0];
      const fileSize = file.size / 1024 / 1024; // Convert size to MB

      if (fileType !== 'image') {
        setErrorMessage(t('Only image files are allowed'));

        return;
      }

      if (fileSize > 5) {
        setErrorMessage(t('File size should not exceed 5MB'));

        return;
      }
      if (file) {
        setErrorMessage('');
        const reader = new FileReader();
        reader.onloadend = () => {
          setImage(reader.result as string);
        };
        reader.readAsDataURL(file);
        setPhoto(file);
      }
    }
  };

  const handleError = (errorResponse: {
    data: { message: string };
    status: number;
  }) => {
    const message = errorResponse?.data?.message || 'An unknown error occurred';
    toast.error(message, {
      theme: 'light',
    });
    handleOpen();
  };

  const handleSaveChanges = async (
    e: React.MouseEvent<HTMLElement> | React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();
    toast.dismiss();
    setLoading(true);

    const updatedData = {
      name: firstname + ' ' + lastname || profileData?.name,
      currentPosition: currentPosition,
      profilePicUrl: '',
    };

    try {
      // Update profile picture if a photo is provided
      if (photo) {
        const res = await editProfilePictureForUser({
          photo: photo as File,
        }).unwrap();
        updatedData.profilePicUrl = res?.data?.profilePicUrl;
      }

      // Merge updated data with existing profile data
      const mergedData = {
        ...profileData,
        ...updatedData,
      };

      // Update profile
      await editProfileForUser(mergedData).unwrap();
      dispatch(updateProfile(updatedData));
      update(updatedData);

      // Success
      handleOpen();
      toast.success(t('Profile updated successfully!'), {
        theme: 'light',
      });
    } catch (errorResponse) {
      handleError(
        errorResponse as { data: { message: string }; status: number }
      );
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveImage = () => {
    setLoading(true);
    toast.dismiss();
    deleteProfilePictureForUser()
      .unwrap()
      .then(() => {
        const updatedData = {
          profilePicUrl: '',
        };
        dispatch(updateProfile(updatedData));
        setImage(null);
        handleOpen();
        update(updatedData);
        toast.success(t('Profile picture removed successfully'), {
          theme: 'light',
        });
      })
      .catch(handleError)
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <ProfileDialog
      openDialog={openDialog || false}
      handleSaveChanges={handleSaveChanges}
      handleOpenDialog={handleOpen}
      loading={loading}
    >
      <Typography className='font-poppins text-xl font-semibold text-black mb-4'>
        {t('Personal Details')}{' '}
      </Typography>
      <Avatar
        variant='circular'
        className='rounded-full h-40 w-40 object-cover border border-lighterPrimary mb-4'
        src={getAvatar(profileData?.name || '', image || '')}
        alt='profile pic'
      />
      <div className='flex gap-2 mb-2'>
        {/* change this form to react-hook-form */}
        <form className='flex gap-2 mb-2' onSubmit={(e) => e.preventDefault()}>
          <input
            type='file'
            ref={fileInputRef}
            className='hidden'
            accept='image/*'
            onChange={handleImageChange}
          />
          <LoadingButton
            type='submit'
            onClick={openFileInput}
            size='sm'
            className='w-fit shadow-none font-poppins capitalize rounded-full font-normal text-sm border border-primary text-bgPrimary bg-transparent'
          >
            Change Photo
          </LoadingButton>
        </form>
        <LoadingButton
          variant='text'
          size='sm'
          onClick={handleRemoveImage}
          className='w-fit shadow-none font-poppins capitalize rounded-full font-normal text-sm text-bgPrimary'
        >
          Remove Photo
        </LoadingButton>
      </div>
      <Typography className='font-poppins text-xs font-normal text-neutrals60'>
        Maximum file size: 5MB. Supported formats: JPG, GIF, or PNG.
      </Typography>

      {errorMessage && (
        <Typography className='flex items-center justify-center text-red-500 text-sm m-2'>
          {errorMessage}
        </Typography>
      )}

      <div className='flex flex-col space-y-4 my-4'>
        <div>
          <div className='mb-1'>
            <label
              htmlFor='firstName'
              className='font-poppins font-medium text-primary text-sm'
            >
              First Name
            </label>
          </div>

          <Input
            crossOrigin={undefined}
            name='firstName'
            className='focus:!border-lighterPrimary border !border-gray-300 font-poppins text-sm'
            labelProps={{ className: 'hidden' }}
            value={firstname}
            onChange={(e) => setFirstName(e.target.value)}
          />
        </div>
        <div>
          <div className='mb-1'>
            <label
              htmlFor='lastName'
              className='font-poppins font-medium text-primary text-sm'
            >
              Last Name
            </label>
          </div>
          <Input
            crossOrigin={undefined}
            name='lastName'
            className='focus:!border-lighterPrimary border !border-gray-300 font-poppins text-sm'
            labelProps={{ className: 'hidden' }}
            value={lastname}
            onChange={(e) => setLastName(e.target.value)}
          />
        </div>
        <div>
          <div className='mb-1'>
            <label
              htmlFor='currentPosition'
              className='font-poppins font-medium text-primary text-sm'
            >
              Current Profession
            </label>
          </div>
          <Select
            name='currentPosition'
            className=' focus:!border-lighterPrimary pt-3 border !border-gray-300 font-poppins text-sm'
            labelProps={{ className: 'hidden' }}
            value={currentPosition}
            onChange={(value) => setCurrentPosition(value || '')}
          >
            {PROFESSION_OPTIONS.map((option) => (
              <Option key={option.value} value={option.value}>
                {option.label}
              </Option>
            ))}
          </Select>
        </div>
      </div>
    </ProfileDialog>
  );
}
