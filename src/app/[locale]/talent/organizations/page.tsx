import OrganizationsList from '@/features/volunteer/ngos/OrganizationsList';
import { Metadata } from 'next';
import React from 'react';

export const metadata: Metadata = {
  title: 'HOOPOE - Organizations list',
};

function TalentOrganizationPage() {
  return <OrganizationsList />;
}

export default TalentOrganizationPage;
