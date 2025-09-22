'use client';

import ViewOpportunity from '@/features/organization/opportunities/view/ViewOpportunity';
import React from 'react';

function ViewOpportunityPage({ params }: { params: { id: string } }) {
  return <ViewOpportunity id={params.id} />;
}

export default ViewOpportunityPage;
