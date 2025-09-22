import OrgHeader from '../components/OrgHeader';
import OrgDetailOpportunitySection from './OrgDetailOpportunitySection';
import Profile from './Profile';
import { OrganizationProfile } from '@/app/api/types';
import { UnderlineTabs } from '@/features/organization/components/UnderlineTabs';
import { BackButton } from '@vkruglikov/react-telegram-web-app';
import { useRouter } from 'next/navigation';

interface OrganizationDetailsProps {
  orgDetail: OrganizationProfile;
  id: string;
}
const OrganizationDetails: React.FC<OrganizationDetailsProps> = ({
  id,
  orgDetail,
}) => {
  const router = useRouter();
  const goBack = () => {
    router.back();
  };
  return (
    <>
      <BackButton onClick={goBack} />
      <div className='bg-white' font-epilogue>
        <OrgHeader
          name={orgDetail.orgName}
          details={<>{orgDetail.location}</>}
          logoUrl={orgDetail.LogoUrl}
        />
        {/* tabs */}
        <UnderlineTabs
          data={[
            {
              label: `Profile`,
              value: 'profile',
              desc: <Profile orgDetail={orgDetail} />,
            },
            {
              label: `Opportunities`,
              value: 'Opportunities',
              desc: <OrgDetailOpportunitySection orgId={id} />,
            },
          ]}
        />
      </div>
    </>
  );
};

export default OrganizationDetails;
