import Paragraph from './components/ui/Paragraph';
import { TypewriterEffectSmooth } from './components/ui/TypewriterEffect';
import { useGetAllOrgsWithLogoQuery } from '@/app/api/slices/org-api-slice';
import { OrganizationProfile } from '@/app/api/types';
import { Avatar } from '@material-tailwind/react';
import { useTranslations } from 'next-intl';

const OurPartners = () => {
  const data = useGetAllOrgsWithLogoQuery();
  const allOrgList: OrganizationProfile[] = data?.data?.data || [];
  const t = useTranslations('LandingPage.OurPartners');

  const words = [
    {
      text: t('title.our'),
    },
    {
      text: t('title.partners'),
      className: 'text-[#C4897B]',
    },
  ];
  return (
    <div>
      <div className='flex mx-auto flex-col items-center justify-between'>
        <TypewriterEffectSmooth words={words} />
        <Paragraph text1={t('description')} />
      </div>
      <div className='flex overflow-hidden space-x-16 my-10'>
        <div className='flex space-x-16 animate-loop-scroll'>
          {allOrgList?.map(
            (org: OrganizationProfile) =>
              org.LogoUrl && (
                <Avatar
                  key={org.id}
                  src={org.LogoUrl}
                  alt={org.orgName}
                  size='xl'
                />
              )
          )}
        </div>
      </div>
    </div>
  );
};
export default OurPartners;
