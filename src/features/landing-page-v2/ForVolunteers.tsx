import DescriptionCard from './components/DescriptionCard';
import ImageContainer from './components/ImageContainer';
import Paragraph from './components/ui/Paragraph';
import { TypewriterEffectSmooth } from './components/ui/TypewriterEffect';
import { useTranslations } from 'next-intl';
import { RevealWrapper } from 'next-reveal';

const ForVolunteers = () => {
  const t = useTranslations('LandingPage.ForVolunteers');

  const words = [
    {
      text: t('words.for'),
    },
    {
      text: t('words.opportunitySeekers'),
      className: 'text-[#C4897B]',
    },
  ];
  return (
    <div>
      <div className='flex text-center m-auto flex-col items-center justify-between mb-6'>
        <TypewriterEffectSmooth words={words} />
        <Paragraph text1={t('paragraph.text1')} text2={t('paragraph.text2')} />
      </div>
      <RevealWrapper>
        <div className='lg:grid lg:grid-cols-2 items-center justify-between gap-10 px-16'>
          <div className='hidden lg:flex lg:col-span-1 justify-center'>
            <ImageContainer />
          </div>
          <div className='flex flex-col gap-6 lg:col-span-1'>
            <DescriptionCard
              src='/assets/document-filter.svg'
              title={t('cards.discoverOpportunities.title')}
              description={t('cards.discoverOpportunities.description')}
            />
            <DescriptionCard
              src='/assets/medal.svg'
              title={t('cards.aiAssistance.title')}
              description={t('cards.aiAssistance.description')}
            />
            <DescriptionCard
              src='/assets/star.svg'
              title={t('cards.trackApplications.title')}
              description={t('cards.trackApplications.description')}
            />
          </div>
        </div>
      </RevealWrapper>
    </div>
  );
};
export default ForVolunteers;
