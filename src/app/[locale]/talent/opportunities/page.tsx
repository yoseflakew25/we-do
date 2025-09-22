import OpportunitiesList from '@/features/volunteer/opportunties/OpportunitiesList';
import { Metadata } from 'next';
import React from 'react';

export const metadata: Metadata = {
  title: 'HOOPOE - Volunteer Opportunties',
};

function VolunteerOpportunitiesPage() {
  return <OpportunitiesList />;
}

export default VolunteerOpportunitiesPage;
