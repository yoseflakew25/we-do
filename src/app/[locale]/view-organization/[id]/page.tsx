'use client';

import { useGetOrgDetailByIDQuery } from '@/app/api/slices/org-api-slice';
import ErrorPage from '@/components/ErrorPage';
import LoadingPage from '@/components/LoadingPage';
import { setCurrentOrgProfile } from '@/features/organization/organization-slice';
import ProfilePage from '@/features/organization/profile/Profile';
import { useDispatch } from 'react-redux';

const ViewOnlyProfile: React.FC<{ params: { id: string } }> = ({ params }) => {
  const {
    data: orgDetail,
    isFetching,
    isError,
  } = useGetOrgDetailByIDQuery(params.id);

  const dispatch = useDispatch();

  if (isFetching) {
    return <LoadingPage />;
  }

  if (isError || !orgDetail?.data) {
    return <ErrorPage />;
  }
  dispatch(setCurrentOrgProfile(orgDetail.data));

  return (
    <>
      <title>HOOPOE - Organization Profile</title>
      <ProfilePage orgDetail={orgDetail.data} viewOnly={true} />
    </>
  );
};

export default ViewOnlyProfile;
