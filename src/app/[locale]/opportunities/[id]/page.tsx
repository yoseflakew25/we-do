'use client';

import ViewOpportunity from '@/features/organization/opportunities/view/ViewOpportunity';
import React from 'react';

function ViewOpportunityPage({ params }: { params: { id: string } }) {
  return (
    <>
      <title>HOOPOE - Opportunity Details</title>
      <ViewOpportunity id={params.id} viewOnly={true} />
    </>
  );
}

export default ViewOpportunityPage;
