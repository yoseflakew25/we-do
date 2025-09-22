'use client';

import ApplicantDetail from '@/features/organization/opportunities/applicant/ApplicantDetail';
import React from 'react';

function ApplicantDetailPage({
  params,
}: {
  params: { id: string; applicant_id: string };
}) {
  return (
    <section>
      <div>
        <ApplicantDetail id={params.id} applicantion_id={params.applicant_id} />
      </div>
    </section>
  );
}

export default ApplicantDetailPage;
