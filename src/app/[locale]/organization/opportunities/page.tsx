'use client';

import Opportunities from '@/features/organization/opportunities/Opportunities';
import EmptyDashboard from '@/features/organization/opportunities/post/EmptyDashboard';
import { useSession } from 'next-auth/react';
import React from 'react';

const OpportunitiesPage: React.FC = () => {
  const { data: session } = useSession();
  const isAccountVerified = session?.user?.profileStatus === 'verified';
  return (
    <div>{isAccountVerified ? <Opportunities /> : <EmptyDashboard />}</div>
  );
};

export default OpportunitiesPage;
