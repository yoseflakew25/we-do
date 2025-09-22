import ProfileCard from './components/ProfileCard';
import ProfileDialog from './components/ProfileDialog';
import { updateProfile } from './profile-slice';
import { useEditProfileForUserMutation } from '@/app/api/slices/volunteer-api-slice';
import { useAppDispatch, useAppSelector } from '@/hook';
import { POPULAR_SKILLS } from '@/select-options';
import { Typography, Chip, IconButton } from '@material-tailwind/react';
import { useTranslations } from 'next-intl';
import React, { useEffect, useState } from 'react';
import { CiSearch } from 'react-icons/ci';
import { LiaTimesSolid } from 'react-icons/lia';
import { toast } from 'react-toastify';

const EditSkills = () => {
  const [openSkill, setOpenSkill] = useState(false);
  const handleOpenSkill = () => {
    setOpenSkill((prev) => !prev);
  };
  const t = useTranslations('EditProfile');
  const profileData = useAppSelector((state) => state.profile.profile);

  return (
    <ProfileCard handleButtonClick={handleOpenSkill}>
      <Typography className='font-inherit font-semibold text-lg text-primary capitalize mb-2'>
        {t('Skills')}
      </Typography>

      <div className='flex flex-wrap gap-2 '>
        {profileData?.skills?.map((item, index) => {
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
      <EditSkill handleOpen={handleOpenSkill} openDialog={openSkill} />
    </ProfileCard>
  );
};
export default EditSkills;
export interface EditProfileProps {
  openDialog?: boolean;
  handleOpen: () => void;
}

export const EditSkill = ({ handleOpen, openDialog }: EditProfileProps) => {
  const skillOptions = POPULAR_SKILLS.map((skill) => skill.value);
  const profileData = useAppSelector((state) => state.profile.profile);
  const dispatch = useAppDispatch();

  const [loading, setLoading] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);

  const [suggestedSkills, setSuggestedSkills] = useState<string[]>([]);
  const [editProfileForUser] = useEditProfileForUserMutation();

  const t = useTranslations('EditProfile');

  useEffect(() => {
    if (profileData.skills) setSelectedSkills(profileData.skills);
  }, [profileData.skills]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);
    const filteredSkills = skillOptions.filter((skill) =>
      skill.toLowerCase().includes(value.toLowerCase())
    );
    setSuggestedSkills(filteredSkills);
  };
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (inputValue.trim() !== '') {
        setSelectedSkills((prevSkills) => [...prevSkills, inputValue]);
        setInputValue('');
      }
    }
  };

  const handleSelectSkill = (skill: any) => {
    setSelectedSkills((prevSkills) => [...prevSkills, skill]);
    setInputValue('');
    setSuggestedSkills([]);
  };

  const handleRemoveSkill = (index: Number) => {
    setSelectedSkills((prevSkills) => prevSkills.filter((_, i) => i !== index));
  };

  const handleAddTypedSkill = async () => {
    setLoading(true);
    const updatedData = {
      skills: selectedSkills,
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
        toast.success(t('Skills updated successfully!'), {
          theme: 'light',
        });
        dispatch(updateProfile(mergedData));
        setSelectedSkills([]);
        setSuggestedSkills([]);
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
      handleSaveChanges={handleAddTypedSkill}
    >
      <Typography className='font-poppins text-xl font-semibold text-black mb-2'>
        {t('Skills')}
      </Typography>
      <Typography className='font-poppins text-xs font-normal text-secondary'>
        {t('Skills Description')}
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
        {selectedSkills.map((skill, index) => (
          <Chip
            value={skill}
            onClose={() => handleRemoveSkill(index)}
            key={index}
            className='rounded-full !bg-tertiary capitalize font-poppins font-medium'
            variant='ghost'
          />
        ))}
      </div>
      {inputValue && suggestedSkills.length > 0 && (
        <div className='w-full font-poppins text-secondary max-h-64 text-sm overflow-y-auto bg-white border border-gray-300 rounded-md mt-4'>
          {suggestedSkills.map((skill, index) => (
            <div
              key={index}
              className='px-4 py-1 hover:bg-gray-50 cursor-pointer'
              onClick={() => handleSelectSkill(skill)}
            >
              {skill}
            </div>
          ))}
        </div>
      )}
    </ProfileDialog>
  );
};
