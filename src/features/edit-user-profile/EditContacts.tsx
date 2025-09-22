import { EditProfileProps } from './EditSkills';
import ProfileCard from './components/ProfileCard';
import ProfileDialog from './components/ProfileDialog';
import { updateProfile } from './profile-slice';
import { useEditProfileForUserMutation } from '@/app/api/slices/volunteer-api-slice';
import { ApplicationFormSchema } from '@/app/api/types';
import { useAppDispatch, useAppSelector } from '@/hook';
import { Typography } from '@material-tailwind/react';
import { Input } from '@material-tailwind/react';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';
import { BsTelephone } from 'react-icons/bs';
import { CiLocationOn, CiMail } from 'react-icons/ci';
import { toast } from 'react-toastify';
import { ZodError } from 'zod';

const EditContacts = () => {
  const [openContact, setOpenContact] = useState(false);

  const handleOpenContact = () => {
    setOpenContact((prev) => !prev);
  };
  const t = useTranslations('EditProfile');
  const profileData = useAppSelector((state) => state.profile.profile);

  return (
    <ProfileCard handleButtonClick={handleOpenContact}>
      <Typography className='font-inherit font-semibold text-lg text-primary capitalize mb-2'>
        {t('Contact')}
      </Typography>
      <div className='flex space-x-3 mb-2'>
        <CiMail size={25} className='shrink-0' />
        <div className='w-full'>
          <Typography className='font-poppins text-primary font-medium text-sm'>
            {t('Email')}
          </Typography>

          <Typography className='font-poppins font-normal truncate text-sm text-tertiary'>
            {profileData?.email}
          </Typography>
        </div>
      </div>
      <div className='flex space-x-3 mb-2'>
        <BsTelephone size={21} className='shrink-0' />
        <div className='w-full'>
          <Typography className='font-poppins text-primary font-medium text-sm'>
            {t('Phone Number')}
          </Typography>

          <Typography className='font-poppins font-normal truncate text-sm text-tertiary'>
            {profileData?.phone}
          </Typography>
        </div>
      </div>
      <div className='flex space-x-3 mb-2'>
        <CiLocationOn size={25} className='shrink-0' />
        <div className='w-full'>
          <Typography className='font-poppins text-primary font-medium text-sm'>
            {t('Location')}
          </Typography>

          <Typography className='font-poppins font-normal truncate text-sm text-tertiary'>
            {profileData?.address}
          </Typography>
        </div>
      </div>
      <EditContact handleOpen={handleOpenContact} openDialog={openContact} />
    </ProfileCard>
  );
};
export default EditContacts;

const EditContact = ({ handleOpen, openDialog }: EditProfileProps) => {
  const profileData = useAppSelector((state) => state.profile.profile);
  const dispatch = useAppDispatch();

  const t = useTranslations('EditProfile');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  // const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [_phoneError, setPhoneError] = useState('');

  const [editProfileForUser] = useEditProfileForUserMutation();

  useEffect(() => {
    if (profileData.phone) setPhone(profileData.phone);
    if (profileData.address) setAddress(profileData.address);
    // if (profileData.email) setEmail(profileData.email);
  }, [profileData]);

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPhone = e.target.value;
    setPhone(newPhone);
    const phoneFieldSchema = ApplicationFormSchema.shape.phone;
    try {
      phoneFieldSchema.parse(newPhone);
      setPhoneError('');
    } catch (error) {
      if (error instanceof ZodError) {
        setPhoneError(error.errors[0].message);
      }
    }
  };

  const handleSaveChanges = async (e: React.FormEvent) => {
    e.preventDefault(); // Prevent form submission
    setLoading(true);
    // Create an object with the updated data
    const updatedData = {
      phone: phone,
      address: address,
      // email: email,
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
        toast.success(t('Profile updated successfully!'), {
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
        {t('Contact')}
      </Typography>
      <Typography className='font-poppins text-xs font-normal text-secondary'>
        {t('Languages Description')}
      </Typography>
      <div className='flex flex-col space-y-4 my-4'>
        {/* <div>
          <div className='flex gap-2 items-center mb-1'>
            <CiMail size={20} />
            <label
              htmlFor='email'
              className='font-poppins font-medium text-primary text-sm'
            >
              {t('Email')}
            </label>
          </div>
          <Input
            crossOrigin={undefined}
            name='email'
            className='focus:!border-lighterPrimary border !border-gray-300 !font-poppins text-sm'
            labelProps={{ className: 'hidden' }}
            defaultValue={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div> */}
        <div>
          <div className='flex gap-2 items-center mb-1'>
            <BsTelephone size={17} />
            <label
              htmlFor='phone'
              className='font-poppins font-medium text-primary text-sm'
            >
              {t('Phone Number')}
            </label>
          </div>

          <Input
            crossOrigin={undefined}
            name='phone'
            className='focus:!border-lighterPrimary border !border-gray-300 !font-poppins text-sm'
            labelProps={{ className: 'hidden' }}
            defaultValue={phone}
            onChange={handlePhoneChange}
          />
          <Typography className='text-red-500 text-xs font-poppins'>
            {_phoneError}
          </Typography>
        </div>
        <div>
          <div className='flex gap-2 items-center mb-1'>
            <CiLocationOn size={20} />
            <label
              htmlFor='address'
              className='font-poppins font-medium text-primary text-sm'
            >
              {t('Location')}
            </label>
          </div>
          <Input
            crossOrigin={undefined}
            name='address'
            className='focus:!border-lighterPrimary border !border-gray-300 !font-poppins text-sm'
            labelProps={{ className: 'hidden' }}
            defaultValue={address}
            onChange={(e) => setAddress(e.target.value)}
          />
        </div>
      </div>
    </ProfileDialog>
  );
};
