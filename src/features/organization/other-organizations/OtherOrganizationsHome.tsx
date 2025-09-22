'use client';

import { UnderlineTabs } from '../components/UnderlineTabs';
import OrganizationsList from '@/features/volunteer/ngos/OrganizationsList';
import OpportunitiesList from '@/features/volunteer/opportunties/OpportunitiesList';

const OtherOrganizationsHome: React.FC = () => {
  return (
    <div className='container '>
      <UnderlineTabs
        data={[
          {
            label: `Other Organizations`,
            value: 'ngo',
            desc: <OrganizationsList />,
          },
          {
            label: `Opportunities By Other Organizations`,
            value: 'Opportunities',
            desc: <OpportunitiesList />,
          },
        ]}
      />
    </div>
  );
};

export default OtherOrganizationsHome;
