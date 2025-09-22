import { useAppSelector } from '@/hook';
import { Progress, Typography } from '@material-tailwind/react';
import { useTranslations } from 'next-intl';
import React, { useEffect, useState } from 'react';
import { FiInfo } from 'react-icons/fi';

const ProfileCompletion = () => {
  const profileData = useAppSelector((state) => state.profile.profile);
  const [completion, setCompletion] = useState(0);

  useEffect(() => {
    if (profileData.profileCompletePercentage) {
      setCompletion(profileData.profileCompletePercentage);
    }
  }, [profileData]);

  const t = useTranslations('EditProfile');

  // Profile completion suggestions
  const profileCompletionSteps = [
    {
      label: 'Contact Information',
      description: 'Add your phone number and email address to stay connected.',
      completed: !!profileData.phone && !!profileData.email,
    },
    {
      label: 'Social Links',
      description: 'Connect your LinkedIn or other social media accounts.',
      completed:
        !!profileData.linkedIn ||
        !!profileData.twitter ||
        !!profileData.website,
    },
    {
      label: 'Resume',
      description:
        'Uploading your resume increases your visibility to recruiters.',
      completed: !!profileData.resumeFile?.fileURL,
    },
    {
      label: 'About',
      description: 'Write a short bio to let others know more about you.',
      completed: !!profileData.aboutMe,
    },
    {
      label: 'Skills',
      description: 'List your skills to highlight your strengths.',
      completed: profileData.skills && profileData.skills?.length > 0,
    },
    {
      label: 'Languages',
      description: 'Add the languages you speak to showcase your diversity.',
      completed: profileData.languages && profileData.languages?.length > 0,
    },
  ];

  return (
    <div className='w-full'>
      <Typography className='font-inherit font-semibold text-lg text-primary capitalize'>
        {t('Profile Completion')}
      </Typography>
      <div className='flex items-center justify-center gap-2'>
        <Progress className='progress' value={completion} />
        <Typography className='font-poppins text-secondary'>
          {completion}%
        </Typography>
      </div>
      {
        <div className='gap-2 mt-2'>
          {profileCompletionSteps.map((step, index) => (
            <div key={index} className='flex items-center space-x-3'>
              {step.completed ? null : (
                <Typography className='flex gap-2 items-center font-poppins font-normal text-xs text-secondary'>
                  <FiInfo size={20} className='shrink-0' />
                  {step.description}
                </Typography>
              )}
            </div>
          ))}
        </div>
      }
    </div>
  );
};

export default ProfileCompletion;
