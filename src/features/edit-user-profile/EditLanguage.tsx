import ProfileCard from './components/ProfileCard';
import ProfileDialog from './components/ProfileDialog';
import { updateProfile } from './profile-slice';
import { useEditProfileForUserMutation } from '@/app/api/slices/volunteer-api-slice';
import { useAppDispatch, useAppSelector } from '@/hook';
import { POPULAR_LANGUAGES } from '@/select-options';
import { Typography, Chip, IconButton } from '@material-tailwind/react';
import { useTranslations } from 'next-intl';
import React, { useEffect, useState } from 'react';
import { CiSearch } from 'react-icons/ci';
import { LiaTimesSolid } from 'react-icons/lia';
import { toast } from 'react-toastify';

const EditLanguages = () => {
  const [openLanguage, setOpenLanguage] = useState(false);
  const handleOpenLanguage = () => {
    setOpenLanguage((prev) => !prev);
  };
  const t = useTranslations('EditProfile');
  const profileData = useAppSelector((state) => state.profile.profile);

  return (
    <ProfileCard handleButtonClick={handleOpenLanguage}>
      <Typography className='font-inherit font-semibold text-lg text-primary capitalize mb-2'>
        {t('Languages')}
      </Typography>

      <div className='flex flex-wrap gap-2 '>
        {profileData?.languages?.map((item, index) => {
          return (
            <Chip
              variant='ghost'
              key={index}
              value={item}
              className='rounded-full !bg-chip capitalize font-poppins text-bgPrimary text-sm font-medium'
            />
          );
        })}
      </div>
      <EditLanguage handleOpen={handleOpenLanguage} openDialog={openLanguage} />
    </ProfileCard>
  );
};
export default EditLanguages;

export interface EditProfileProps {
  handleOpen: () => void;
  openDialog?: boolean;
}

export const EditLanguage = ({ handleOpen, openDialog }: EditProfileProps) => {
  const languageOptions = POPULAR_LANGUAGES.map((language) => language.value);
  const profileData = useAppSelector((state) => state.profile.profile);
  const dispatch = useAppDispatch();

  const [loading, setLoading] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>([]);

  const [suggestedLanguages, setSuggestedLanguages] = useState<string[]>([]);
  const [editProfileForUser] = useEditProfileForUserMutation();

  const t = useTranslations('EditProfile');

  useEffect(() => {
    if (profileData.languages) setSelectedLanguages(profileData.languages);
  }, [profileData.languages]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);
    const filteredLanguages = languageOptions.filter((language) =>
      language.toLowerCase().includes(value.toLowerCase())
    );
    setSuggestedLanguages(filteredLanguages);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (inputValue.trim() !== '') {
        setSelectedLanguages((prev) => [...prev, inputValue]);
        setInputValue('');
      }
    }
  };

  const handleSelectLanguage = (language: any) => {
    setSelectedLanguages((prev) => [...prev, language]);
    setInputValue('');
    setSuggestedLanguages([]);
  };

  const handleRemoveLanguage = (index: number) => {
    setSelectedLanguages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleAddTypedLanguage = async () => {
    setLoading(true);
    const updatedData = {
      languages: selectedLanguages,
    };
    const mergedData = {
      ...profileData,
      ...updatedData,
    };

    await editProfileForUser(mergedData)
      .unwrap()
      .then(() => {
        handleOpen();
        toast.success(t('Languages updated successfully!'), {
          theme: 'light',
        });
        dispatch(updateProfile(mergedData));
        setSelectedLanguages([]);
        setSuggestedLanguages([]);
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
      handleOpenDialog={handleOpen}
      loading={loading}
      handleSaveChanges={handleAddTypedLanguage}
    >
      <Typography className='font-poppins text-xl font-semibold text-black mb-2'>
        {t('Languages')}
      </Typography>
      <Typography className='font-poppins text-xs font-normal text-secondary'>
        {t('Languages Description')}
      </Typography>
      <div className='relative'>
        <IconButton
          size='sm'
          className='!absolute left-2 top-6 p-0 m-0 !bg-transparent text-secondary shadow-none hover:shadow-none active:shadow-none'
          onClick={() => setInputValue('')}
        >
          <CiSearch size={25} />
        </IconButton>
        <input
          type='text'
          value={inputValue}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          className='border border-gray-300 text-secondary text-sm font-poppins rounded-3xl py-3 pl-10 pr-4 w-full focus:outline-none active:border-none focus:border-lighterPrimary mt-4'
          placeholder='Type to search skills...'
        />
        {inputValue && (
          <IconButton
            size='sm'
            className='!absolute right-2 top-6 p-0 m-0 !bg-transparent text-secondary shadow-none hover:shadow-none active:shadow-none'
            onClick={() => setInputValue('')}
          >
            <LiaTimesSolid size={20} />
          </IconButton>
        )}
      </div>

      <div className='flex flex-wrap gap-2 mt-4'>
        {selectedLanguages.map((language, index) => (
          <Chip
            value={language}
            onClose={() => handleRemoveLanguage(index)}
            key={index}
            className='rounded-full !bg-tertiary capitalize font-poppins font-medium'
            variant='ghost'
          />
        ))}
      </div>
      {inputValue && suggestedLanguages.length > 0 && (
        <div className='w-full font-poppins text-secondary max-h-64 text-sm overflow-y-auto bg-white border border-gray-300 rounded-md mt-4'>
          {suggestedLanguages.map((language, index) => (
            <div
              key={index}
              className='px-4 py-1 hover:bg-gray-50 cursor-pointer'
              onClick={() => handleSelectLanguage(language)}
            >
              {language}
            </div>
          ))}
        </div>
      )}
    </ProfileDialog>
  );
};
