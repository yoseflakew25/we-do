'use client';

import { useGetOrgProfileQuery } from '@/app/api/slices/org-api-slice';
import ErrorPage from '@/components/ErrorPage';
import LoadingPage from '@/components/LoadingPage';
import { getProfileStart } from '@/features/organization/organization-slice';
import ProfilePage from '@/features/organization/profile/Profile';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';

const Profile: React.FC = () => {
  const { data, isFetching, isError } = useGetOrgProfileQuery();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getProfileStart());
  }, [dispatch]);

  if (isFetching) {
    return <LoadingPage />;
  }

  if (isError || !data) {
    return <ErrorPage />;
  }

  const orgDetail = data.data;

  return <ProfilePage orgDetail={orgDetail} />;
};

export default Profile;
