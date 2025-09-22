'use client';

import EditAboutMe from './EditAboutMe';
import EditContacts from './EditContacts';
import EditLanguages from './EditLanguage';
import EditProfilePic from './EditProfilePic';
import { EditResume } from './EditResume';
import EditSkills from './EditSkills';
import EditSocialLink from './EditSocialLink';
import OrgReviewCard from './OrgReviewCard';
import ProfileActiveSwitch from './ProfileActiveSwitch';
import { ShowCertificate } from './ShowCertificate';
import { useGetProfileQuery } from '@/app/api/slices/volunteer-api-slice';
import LoadingPage from '@/components/LoadingPage';

const EditUserProfile: React.FC = () => {
  const { data, isFetching } = useGetProfileQuery();

  if (isFetching) {
    return <LoadingPage />;
  }

  const profileData = data?.data;
  return (
    <div className=' bg-tertiary w-full grid grid-cols-1 lg:grid-cols-3'>
      {/* Left Side */}
      <div className='lg:col-span-1 flex flex-col gap-6 p-8'>
        <EditProfilePic />
        <ProfileActiveSwitch />
        <EditAboutMe />
        <EditSkills />
        <EditLanguages />
      </div>
      {/* Right Side */}
      <div className='lg:col-span-2 flex flex-col gap-6 p-8 lg:pl-0'>
        <EditContacts />
        <EditSocialLink />
        <EditResume />
        <ShowCertificate />
        <OrgReviewCard id={profileData?.userID} />
      </div>
    </div>
  );
};

export default EditUserProfile;
