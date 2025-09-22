'use client';

import { useGetOrgProfileQuery } from '@/app/api/slices/org-api-slice';
import ErrorPage from '@/components/ErrorPage';
import LoadingPage from '@/components/LoadingPage';
import EditProfile from '@/features/organization/profile/EditProfile';

const EditProfilePage = () => {
  const { data, isFetching, isError, refetch } = useGetOrgProfileQuery();

  const handleOnSave = () => {
    refetch();
  };

  if (isFetching) {
    return <LoadingPage />;
  }

  if (isError || !data?.data) {
    return <ErrorPage />;
  }

  return <EditProfile orgProfile={data.data} onUpdateComplete={handleOnSave} />;
};

export default EditProfilePage;
