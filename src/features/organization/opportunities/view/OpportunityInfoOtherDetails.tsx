import IconInCircle from '../../components/IconInCircle';
import OrgDetailWithIcon from '../../components/OrgDetailWithIcon';
import OrgInfoWithIcon from '../../components/OrgInfoWithIcon';
import OrgTitleAndDetail from '../../components/OrgTitleAndDetail';
import Tag from '../../components/Tag';
import CustomQuestionForm from '../custom-questions/CustomQuestionForm';
import RichTextDisplay from './opportunity-info/OpportunityInfoWithRichText';
import { OpportunityDetail, OpportunityFormData } from '@/app/api/types';
import HorizontalDivider from '@/components/HorizontalDivider';
import { useAppSelector } from '@/hook';
import {
  Accordion,
  AccordionBody,
  AccordionHeader,
  Spinner,
} from '@material-tailwind/react';
import { GoogleMap, MarkerF, useJsApiLoader } from '@react-google-maps/api';
import dateFormat from 'dateformat';
import { useSession } from 'next-auth/react';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import React from 'react';
import { FiCheckCircle } from 'react-icons/fi';
import { LuCalendarCheck, LuCalendarClock } from 'react-icons/lu';
import { MdOutlineLocationOn, MdOutlineWorkHistory } from 'react-icons/md';

function OpportunityInfoOtherDetails({
  formData,
}: {
  formData: OpportunityDetail | OpportunityFormData;
}) {
  const questions = useAppSelector(
    (state) => state.orgSideCustomQuestions.questions
  );

  const [open, setOpen] = React.useState(0);
  const handleOpen = (value: number) => setOpen(open === value ? 0 : value);

  const t = useTranslations('PostOpportunityPage.reviewSection');
  const router = useRouter();
  const description = formData.description;
  const requirements = formData.requirements;
  const responsibilities = formData.responsibilities;
  const idealCandidate = formData.idealCandidate;
  const catagories = formData.categories;
  const startDate = dateFormat(formData.startDate!, 'mmm dS, yyyy');
  const endDate = formData.endDate
    ? dateFormat(formData.endDate, 'mmm dS, yyyy')
    : null;
  const requiredSkills = formData.requiredSkills;
  const cities = formData.location;
  const whenAndWhere = formData.whenAndWhere;
  const perksAndBenefits = formData.perksAndBenefits;
  const NOTPROVIDED = (
    <p className=' text-tertiary font-poppins font-normal'>
      {t('notProvided')}
    </p>
  );
  const handleCategoryClick = (category: string) => {
    router.push(`/talent/opportunities?categories=${category}`);
  };
  const { data: user } = useSession();

  const mapContainerStyle = {
    width: '100%',
    height: '300px',
  };
  type Library = 'places';
  type UseLoadScriptOptions = {
    id: string;
    googleMapsApiKey: string;
    libraries: Library[];
  };

  const mapOptions: UseLoadScriptOptions = {
    id: 'google-map-script',
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_API_KEY || '',
    libraries: ['places'] as Library[], // Ensure this matches the libraries you need
  };
  const center =
    formData.geoLocation && Object.keys(formData.geoLocation).length > 0
      ? {
          lat: formData.geoLocation.latitude,
          lng: formData.geoLocation.longitude,
        }
      : {
          lat: 0,
          lng: 0,
        };

  const { isLoaded, loadError } = useJsApiLoader(mapOptions);

  if (loadError) {
    return (
      <p className='font-poppins text-tertiary'>
        Google Maps API key is missing or invalid.
      </p>
    );
  }

  if (!isLoaded) {
    return (
      <p className='font-poppins text-tertiary'>
        <Spinner />
      </p>
    );
  }
  return (
    <>
      <div className='flex flex-col items-start flex-wrap sm:grid sm:grid-cols-3 sm:space-x-8 space-y-4 w-full'>
        {/* left side */}
        <div className='flex flex-col flex-wrap items-start sm:gap-y-4 sm:col-span-2 text-justify sm:mr-4'>
          {/* Description */}
          {user ? (
            <RichTextDisplay title={t('description')} content={description} />
          ) : (
            <div className='relative w-full'>
              <div className='absolute inset-0 bg-gradient-to-b from-transparent via-white/80 to-white dark:via-gray-900/80 dark:to-gray-900 z-10 rounded-lg'></div>
              <div className='relative z-20 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm border border-gray-200 dark:border-gray-700 rounded-lg p-6 text-center'>
                <div className='flex flex-col items-center gap-4'>
                  <div className='w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center'>
                    <svg
                      className='w-8 h-8 text-primary'
                      fill='none'
                      stroke='currentColor'
                      viewBox='0 0 24 24'
                    >
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth={2}
                        d='M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z'
                      />
                    </svg>
                  </div>
                  <div>
                    <h3 className='text-lg font-semibold text-gray-900 dark:text-white mb-2'>
                      {t('description')}
                    </h3>
                    <p className='text-gray-600 dark:text-gray-300 text-sm mb-4'>
                      Please log in to view the full opportunity description
                    </p>
                    <button
                      onClick={() => router.push('/login')}
                      className='inline-flex items-center px-4 py-2 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary/90 transition-colors duration-200'
                    >
                      Log In to Continue
                    </button>
                  </div>
                </div>
              </div>
              <div className='blur-sm opacity-30 pointer-events-none'>
                <RichTextDisplay
                  title={t('description')}
                  content={description}
                />
              </div>
            </div>
          )}
          {/* Requirements */}
          {requirements.trim() && (
            <OrgTitleAndDetail
              title={t('requirements')}
              detailElement={
                <div className='flex flex-col gap-2 w-full break-words'>
                  {requirements.split('\n').map((value, index) => (
                    <OrgInfoWithIcon
                      key={index}
                      title={value.trim()}
                      icon={<FiCheckCircle color='teal' />}
                    />
                  ))}
                </div>
              }
            />
          )}
          {/* Responsibilities */}
          <OrgTitleAndDetail
            title={t('responsibilities')}
            detailElement={
              <div className='flex flex-col gap-2'>
                {responsibilities.split('\n').map((value, index) => (
                  <OrgInfoWithIcon
                    key={index}
                    title={value}
                    icon={<FiCheckCircle color='teal' />}
                  />
                ))}
              </div>
            }
          />
          {/* Ideal Candidate */}
          <OrgTitleAndDetail
            title={t('idealCandidate')}
            detailElement={
              <div className='flex flex-col gap-2'>
                {!idealCandidate
                  ? NOTPROVIDED
                  : idealCandidate
                      .split('\n')
                      .map((value, index) => (
                        <OrgInfoWithIcon
                          key={index}
                          title={value}
                          icon={<FiCheckCircle color='teal' />}
                        />
                      ))}
              </div>
            }
          />
          {/* Perks and Benefits */}
          <OrgTitleAndDetail
            title={t('perksAndBenefits')}
            detailElement={
              perksAndBenefits.length === 0 ? (
                NOTPROVIDED
              ) : (
                <div className='flex flex-col gap-2'>
                  {perksAndBenefits?.map((value, index) => (
                    <OrgInfoWithIcon
                      key={index}
                      title={value}
                      icon={<FiCheckCircle color='teal' />}
                    />
                  ))}
                </div>
              )
            }
          />

          {/* where and where  */}
          <OrgTitleAndDetail
            title={t('whenAndWhere')}
            detailElement={
              !whenAndWhere ? (
                NOTPROVIDED
              ) : (
                <OrgDetailWithIcon
                  key='when'
                  title={whenAndWhere}
                  icon={
                    <IconInCircle
                      icon={
                        <MdOutlineLocationOn className='h-5 w-5 text-[#26A4FF]' />
                      }
                    />
                  }
                />
              )
            }
          />

          <div
            style={{ height: '300px', width: '100%', fontFamily: 'Poppins' }}
          >
            <GoogleMap
              mapContainerStyle={mapContainerStyle}
              center={center}
              zoom={16}
            >
              <MarkerF position={center} />
            </GoogleMap>
          </div>
        </div>
        {/* right side */}
        <div className='flex flex-col items-start ml-4 sm:col-span-1 sm:ml-8'>
          {formData.isRolling ? ( // If isRolling is true, print Rolling
            <>
              <OrgTitleAndDetail title={t('timeline.title')} />
              <OrgInfoWithIcon
                key='rolling'
                title='Rolling'
                icon={
                  <MdOutlineWorkHistory className='h-5 w-5 text-[#26A4FF]' />
                }
              />
              <div className='w-full'>
                <HorizontalDivider />
              </div>
            </>
          ) : (
            // Otherwise, print the timeline
            <>
              <OrgTitleAndDetail title={t('timeline.title')} />
              <div className='flex gap-2 sm:flex-col sm:gap-y-4'>
                <OrgInfoWithIcon
                  key='start'
                  title={t('timeline.startDate')}
                  value={startDate}
                  icon={
                    <IconInCircle
                      icon={<LuCalendarClock size={20} color='#26A4FF' />}
                    />
                  }
                />
                {endDate && (
                  <OrgInfoWithIcon
                    title={t('timeline.endDate')}
                    value={endDate}
                    icon={
                      <IconInCircle
                        icon={<LuCalendarCheck size={20} color='#26A4FF' />}
                      />
                    }
                  />
                )}
              </div>
              <div className='w-full'>
                <HorizontalDivider />
              </div>
            </>
          )}

          {/* Categories */}
          <OrgTitleAndDetail title={t('categories')} />
          <div className='flex gap-1 flex-wrap justify-start cursor-pointer'>
            {catagories.length === 0
              ? NOTPROVIDED
              : catagories?.map((value, index) => (
                  <Tag
                    key={index}
                    text={value}
                    textColor={'#56CDAD'}
                    smallBorderRadius
                    onClick={() => handleCategoryClick(value)}
                  />
                ))}
          </div>
          <div className='w-full'>
            <HorizontalDivider />
          </div>
          {/* Required Skills */}
          <OrgTitleAndDetail title={t('requiredSkills')} />
          <div className='flex gap-1 flex-wrap justify-start'>
            {requiredSkills.length === 0
              ? NOTPROVIDED
              : requiredSkills?.map((value, index) => (
                  <Tag
                    key={index}
                    text={value}
                    textColor='#C4897B'
                    smallBorderRadius
                  />
                ))}
          </div>
          <div className='w-full'>
            <HorizontalDivider />
          </div>

          {/* cities */}
          <OrgTitleAndDetail title={t('cities')} />
          <div className='flex flex-col gap-y-4'>
            {cities?.length === 0 ? (
              <OrgInfoWithIcon title={NOTPROVIDED} />
            ) : (
              cities?.map((value, index) => (
                <OrgInfoWithIcon
                  key={index}
                  title={value}
                  icon={
                    <IconInCircle
                      icon={<MdOutlineLocationOn size={23} color='#26A4FF' />}
                    />
                  }
                />
              ))
            )}
          </div>

          {/* <HorizontalDivider /> */}
          {/* <AllApplicantsInfo total={0} inReview={0} hired={0} declined={0} /> */}
        </div>
      </div>

      {!(user?.user.role === 'user') && questions?.length > 0 && (
        <Accordion
          open={open === 1}
          icon={<Icon id={1} open={open} />}
          className='mb-2'
        >
          <AccordionHeader onClick={() => handleOpen(1)}>
            <h3 className='font-black font-poppins text-base sm:text-xl text-secondary text-left pb-2 sm:pb-4'>
              Additional Questions{' '}
            </h3>
          </AccordionHeader>
          <AccordionBody>
            {questions.length < 1 ? (
              <p className='font-normal font-poppins text-xs sm:text-base text-tertiary'>
                NOT ADDED
              </p>
            ) : (
              <CustomQuestionForm viewOnly={true} />
            )}
          </AccordionBody>
        </Accordion>
      )}
    </>
  );
}

function Icon({ id, open }: { id: number; open: number }) {
  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      fill='none'
      viewBox='0 0 24 24'
      strokeWidth={2}
      stroke='currentColor'
      className={`${
        id === open ? 'rotate-180' : ''
      } h-8 w-8 transition-transform text-neutrals100 `}
    >
      <path
        strokeLinecap='round'
        strokeLinejoin='round'
        d='M19.5 8.25l-7.5 7.5-7.5-7.5'
      />
    </svg>
  );
}

export default OpportunityInfoOtherDetails;
