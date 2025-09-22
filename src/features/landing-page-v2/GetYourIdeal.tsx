import IdealVolunteersCard from './components/IdealVolunteersCard';
import { motion, useAnimate, useInView } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { useEffect } from 'react';
import { TypewriterEffectSmooth } from './components/ui/TypewriterEffect';

const GetYourIdeal = () => {
  const [scope, animate] = useAnimate();
  const isInView = useInView(scope);
  const handleAnimation = async () => {
    if (isInView) {
      await animate(
        '#firstCard',
        { y: 0, scale: 1, opacity: 1 },
        { duration: 0.5, ease: 'easeOut', delay: 0.1 }
      );
      await animate(
        '#secondCard',
        { y: 0, scale: 1, opacity: 1 },
        { duration: 0.5, ease: 'easeOut', delay: 0.1 }
      );
      await animate(
        '#thirdCard',
        { y: 0, scale: 1, opacity: 1 },
        { duration: 0.5, ease: 'easeOut', delay: 0.1 }
      );
    } else {
      animate(
        '#firstCard',
        { y: -100, scale: 0.5, opacity: 0 },
        { duration: 0.5, ease: 'easeInOut' }
      );
      animate(
        '#secondCard',
        { y: 100, scale: 0.5, opacity: 0 },
        { duration: 0.5, ease: 'easeInOut' }
      );
      animate(
        '#thirdCard',
        { y: -100, scale: 0.5, opacity: 0 },
        { duration: 0.5, ease: 'easeInOut' }
      );
    }
  };
  useEffect(() => {
    handleAnimation();
  }, [isInView]);

  const t = useTranslations('LandingPage.GetYourIdeal');
  const words = [
    {
      text: t('title.main'),
    },
    {
      text: t('title.steps'),
      className: 'text-[#C4897B]',
    },
  ];

  return (
    <section ref={scope} className='container mx-auto my-12'>
      <div className='flex text-center m-auto  flex-col items-center justify-between gap-3 mb-6'>
        <div className='flex mx-auto flex-col items-center justify-between'>
                  <TypewriterEffectSmooth words={words} />
                </div>
      </div>
      <div className=' flex flex-col xl:flex-row overflow-auto'>
        <motion.span
          id='firstCard'
          className='p-4 w-full min-h-80 cursor-default'
        >
          <IdealVolunteersCard
            title={t('cards.registerOrg.title')}
            description={t('cards.registerOrg.description')}
            src='/assets/feature.svg'
          />
        </motion.span>
        <motion.span
          id='secondCard'
          className='p-4 w-full min-h-80 cursor-default'
        >
          <IdealVolunteersCard
            title={t('cards.postOpportunities.title')}
            description={t('cards.postOpportunities.description')}
            src='/assets/signpost.svg'
          />
        </motion.span>
        <motion.span
          id='thirdCard'
          className='p-4 w-full min-h-80 cursor-default'
        >
          <IdealVolunteersCard
            title={t('cards.manageApplications.title')}
            description={t('cards.manageApplications.description')}
            src='/assets/medal.svg'
          />
        </motion.span>
      </div>
    </section>
  );
};
export default GetYourIdeal;
