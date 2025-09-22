import DescriptionCard from './components/DescriptionCard';
import ImageContainer from './components/ImageContainer';
import Paragraph from './components/ui/Paragraph';
import { TypewriterEffectSmooth } from './components/ui/TypewriterEffect';
import { useTranslations } from 'next-intl';

const ForOrganizations = () => {
  const t = useTranslations('LandingPage.forOrganizations');
  const words = [
    {
      text: t('title.for'),
    },
    {
      text: t('title.organizations'),
      className: 'text-[#C4897B]',
    },
  ];
  return (
    <div>
      <div className='flex text-center m-auto flex-col items-center justify-between mb-6'>
        <TypewriterEffectSmooth words={words} />
        <Paragraph text1={t('text1')} text2={t('text2')} />
      </div>
      <div className='lg:grid lg:grid-cols-2 items-center justify-between gap-10 px-16'>
        <div className='flex flex-col gap-6 lg:col-span-1'>
          <DescriptionCard
            src='/assets/receipt-search.svg'
            title={t('cards.expandYourReach.title')}
            description={t('cards.expandYourReach.description')}
          />
          <DescriptionCard
            src='/assets/copyicon.svg'
            title={t('cards.manageOpportunities.title')}
            description={t('cards.manageOpportunities.description')}
          />
          <DescriptionCard
            src='/assets/medal.svg'
            title={t('cards.donationChannel.title')}
            description={t('cards.donationChannel.description')}
          />
        </div>
        <div className='hidden lg:flex lg:col-span-1 justify-center'>
          <ImageContainer />
        </div>
      </div>
    </div>
  );
};
export default ForOrganizations;
