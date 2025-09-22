import LandingButton from './components/Button';
import RecentOpportunityCard from './components/RecentOpportunityCard';
import Paragraph from './components/ui/Paragraph';
import { TypewriterEffectSmooth } from './components/ui/TypewriterEffect';
import { useGetAllVolunteerOpportunitiesQuery } from '@/app/api/slices/volunteer-api-slice';
import { Spinner } from '@material-tailwind/react';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { useRef } from 'react';
import { IoIosArrowRoundBack, IoIosArrowRoundForward } from 'react-icons/io';

const RecentOpportunity = () => {
  const t = useTranslations('LandingPage.RecentOpportunity');
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const words = [
    {
      text: t('title'),
    },
    {
      text: t('title'),
      className: 'text-[#C4897B]',
    },
  ];

  const scroll = (scrollOffset: number) => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollLeft += scrollOffset;
    }
  };
  const {
    data: volunteeringOpportunityList,
    isFetching: isFetchingOpportunities,
  } = useGetAllVolunteerOpportunitiesQuery(
    'sortDesc=createdBy&page=1&pageSize=1000'
  );
  if (isFetchingOpportunities) {
    return (
      <div className='mx-auto my-auto'>
        <Spinner color='amber' className='h-10 w-10 mx-auto opacity-50' />
      </div>
    );
  }
  return (
    <>
      <div className=''>
        <div className='flex text-center mx-auto flex-col gap-3 items-center justify-between m-auto'>
          <div className='flex mx-auto flex-col items-center justify-between'>
                  <TypewriterEffectSmooth words={words} />
                  <Paragraph text1={t('description')} />
                </div>
          <Link href='/talent/opportunities'>
            <LandingButton text={t('seeAll')} fill={true} />
          </Link>
        </div>
        <div
          ref={scrollContainerRef}
          className='flex gap-6 overflow-auto items-center w-full'
        >
          {volunteeringOpportunityList?.data?.map((opportunity) => (
            <div key={opportunity.id} className='w-full'>
              <RecentOpportunityCard
                src={opportunity.logoUrl}
                title={opportunity.title}
                orgName={opportunity.orgName}
                rate={opportunity.average_rating}
                description={opportunity.description}
                views={opportunity.viewsCount}
                type={opportunity.opType}
                status={opportunity.status}
              />
            </div>
          ))}
        </div>
        <div className='flex gap-3 justify-end'>
          <div className='bg-tertiary active:bg-lighterPrimary p-4 rounded-full w-10 h-10 grid place-content-center'>
            <IoIosArrowRoundBack
              onClick={() => scroll(-500)}
              className='text-lighterPrimary active:text-white'
              size={25}
            />
          </div>
          <div className='bg-tertiary active:bg-lighterPrimary p-4 rounded-full w-10 h-10 grid place-content-center'>
            <IoIosArrowRoundForward
              onClick={() => scroll(500)}
              className='text-lighterPrimary active:text-white'
              size={25}
            />
          </div>
        </div>
      </div>
    </>
  );
};
export default RecentOpportunity;
