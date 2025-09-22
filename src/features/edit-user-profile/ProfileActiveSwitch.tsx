import { updateProfile } from './profile-slice';
import { useEditProfileForUserMutation } from '@/app/api/slices/volunteer-api-slice';
import { useAppDispatch, useAppSelector } from '@/hook';
import { Card, Switch, Typography } from '@material-tailwind/react';
import { useEffect, useState } from 'react';
import { FiInfo } from 'react-icons/fi';
import { toast } from 'react-toastify';

const ProfileActiveSwitch = () => {
  const profileData = useAppSelector((state) => state.profile.profile);
  const dispatch = useAppDispatch();
  const [editProfileForUser] = useEditProfileForUserMutation();
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    setIsActive(profileData?.visibility === 'visible');
  }, [profileData]);

  const handleToggle = async () => {
    const updatedVisibility = !isActive ? 'visible' : 'hidden';

    try {
      setIsActive(!isActive);
      await editProfileForUser({
        ...profileData,
        visibility: updatedVisibility,
      }).unwrap();

      dispatch(updateProfile({ visibility: updatedVisibility }));
      toast.success(`Profile visibility updated to ${updatedVisibility}`);
    } catch (error) {
      console.error('Update error:', error);
      toast.error('Failed to update profile visibility. Please try again.');
      setIsActive(isActive);
    }
  };

  return (
    <Card shadow={false} className='flex flex-col p-6'>
      <div className='flex justify-between items-center mb-2'>
        <Typography className='font-inherit font-semibold text-lg text-primary capitalize'>
          Make your profile visible
        </Typography>
        <Switch
          crossOrigin='anonymous'
          id='profile-active-switch'
          checked={isActive}
          color='blue'
          onChange={handleToggle}
          ripple={false}
          className={`${
            isActive ? 'bg-primary' : 'bg-gray-200'
          } transition-colors duration-300 ease-in-out h-full w-full checked:bg-primary`}
          containerProps={{
            className: 'transition-transform duration-300 ease-in-out w-11 h-6',
          }}
          circleProps={{
            className:
              'transform transition-transform duration-300 ease-in-out before:hidden left-0.5 border-none',
          }}
        />
      </div>

      <div className='flex space-x-4 mt-2 xl:mt-0'>
        <Typography className='flex gap-2 items-center font-poppins font-normal text-xs text-secondary'>
          <FiInfo className='shrink-0' size={20} />
          Enable public visibility for your profile, allowing organizations to
          discover you.
        </Typography>
      </div>
    </Card>
  );
};

export default ProfileActiveSwitch;
