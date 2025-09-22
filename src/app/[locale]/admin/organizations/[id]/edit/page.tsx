'use client';

import { useGetOrgDetailByIDQuery } from '@/app/api/slices/org-api-slice';
import ErrorPage from '@/components/ErrorPage';
import LoadingPage from '@/components/LoadingPage';
import EditProfile from '@/features/organization/profile/EditProfile';

const EditProfilePage = ({ params }: { params: { id: string } }) => {
  const { data, isFetching, isError, refetch } = useGetOrgDetailByIDQuery(
    params.id
  );

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
