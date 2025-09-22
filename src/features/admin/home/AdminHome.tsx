'use client';

import OpportunityCharts from './chart-groups/OpportunityCharts';
import OrganizationCharts from './chart-groups/OrganizationCharts';
import OverviewCharts from './chart-groups/OverviewCharts';
import VolunteerCharts from './chart-groups/VolunteerCharts';
import { UnderlineTabs } from '@/features/organization/components/UnderlineTabs';
import React from 'react';

const AdminHome: React.FC = () => {
  return (
    <div className='container min-h-[90vh]'>
      <UnderlineTabs
        data={[
          {
            label: `Home`,
            value: 'home',
            desc: <OverviewCharts />,
          },
          {
            label: `Organizations`,
            value: 'ngo',
            desc: <OrganizationCharts />,
          },
          {
            label: `Opportunities`,
            value: 'opportunity',
            desc: <OpportunityCharts />,
          },
          {
            label: `Opportunity Seekers`,
            value: 'volunteer',
            desc: <VolunteerCharts />,
          },
        ]}
      />
    </div>
  );
};

export default AdminHome;
