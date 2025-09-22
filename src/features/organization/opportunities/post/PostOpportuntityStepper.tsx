'use client';

import VerticalDivider from '@/components/dividers/VerticalDivider';
import { useAppSelector } from '@/hook';
import { useTranslations } from 'next-intl';

const PostOpportunityStepper = () => {
  // const { step } = useFormState();
  const step = useAppSelector((state) => state.opportunity.step);
  const t = useTranslations('ThreeStageStepper');

  const docIcon = <img src='/assets/icons/doc.svg'></img>;
  const tickCircleIcon = <img src='/assets/icons/tick-circle.svg'></img>;
  const caseIcon = <img src='/assets/icons/case.svg'></img>;
  const giftIcon = <img src='/assets/icons/gift.svg'></img>;

  const smallScreen = (
    <ol className='md:hidden flex w-full justify-center rounded-lg border-2 border-lightGrey my-4'>
      <li className='flex items-center space-x-2.5 p-2 lg:p-4'>
        <span className='flex items-center justify-center w-10 h-10 rounded-full bg-lighterPrimary shrink-0 '>
          {docIcon}
        </span>
        <span>
          <p className='text-base font-normal text-bgPrimary'>
            {step === 1 ? `${t('postOpportuntySteps.step1')}` : null}
            {step === 2 ? `${t('postOpportuntySteps.step2')}` : null}
            {step === 3 ? `${t('postOpportuntySteps.step3')}` : null}
          </p>
          <p className='font-semibold text-neutrals100 leading-tight'>
            {step === 1
              ? `${t('postOpportunity.opportunityDescription')}`
              : null}
            {step === 2
              ? `${t('postOpportunity.opportunityInformation')}`
              : null}
            {step === 3 ? `${t('postOpportunity.review')}` : null}
          </p>
        </span>
      </li>
    </ol>
  );

  return (
    <div>
      {smallScreen}
      <ol className=' hidden  md:flex  w-full space-y-2 lg:space-x-4 md:flex-row md:justify-around md:items-center rounded-lg border-2 border-lightGrey  md:my-10 '>
        <li className='flex items-center space-x-2.5 p-2 lg:p-4'>
          <span className='flex items-center justify-center w-10 h-10 md:w-12 md:h-12 lg:w-14 lg:h-14 rounded-full bg-lighterPrimary shrink-0 '>
            {step === 1 ? docIcon : tickCircleIcon}
          </span>
          <span>
            <p className='text-base font-normal text-bgPrimary'>
              {t('postOpportuntySteps.step1')}
            </p>
            <p
              className={`font-semibold md:text-base lg:text-lg ${
                step > 1 ? 'text-neutrals100' : 'text-neutrals60'
              } leading-tight `}
            >
              {t('postOpportunity.opportunityDescription')}
            </p>
          </span>
        </li>

        <li>
          <VerticalDivider height='60px' color='#d6ddeb' />
        </li>

        <li className='flex items-center  space-x-2.5 p-2 lg:p-4'>
          {step <= 2 ? (
            <span
              className={`flex items-center justify-center w-10 h-10 md:w-12 md:h-12 lg:w-14 lg:h-14  rounded-full  shrink-0 ${
                step >= 2 ? 'bg-lighterPrimary' : 'bg-tertiary text-neutrals80'
              }`}
            >
              {step < 2 ? caseIcon : docIcon}
            </span>
          ) : (
            <span
              className={`flex items-center justify-center w-10 h-10 md:w-12 md:h-12 lg:w-14 lg:h-14  rounded-full  shrink-0 ${
                step >= 2 ? 'bg-lighterPrimary' : 'bg-tertiary text-neutrals80'
              }`}
            >
              {tickCircleIcon}
            </span>
          )}

          <span>
            <p className='text-base font-normal text-bgPrimary'>
              {t('postOpportuntySteps.step2')}
            </p>
            <p
              className={`font-semibold md:text-base lg:text-lg ${
                step > 2 ? 'text-neutrals100' : 'text-neutrals60'
              } leading-tight `}
            >
              {t('postOpportunity.opportunityInformation')}
            </p>
          </span>
        </li>

        <li>
          <VerticalDivider height='60px' color='#d6ddeb' />
        </li>

        <li className='flex items-center  space-x-2.5 p-2 lg:p-4'>
          {step <= 3 ? (
            <span
              className={`flex items-center justify-center w-10 h-10 md:w-12 md:h-12 lg:w-14 lg:h-14  rounded-full  shrink-0 ${
                step >= 3 ? 'bg-lighterPrimary' : 'bg-tertiary text-neutrals80'
              }`}
            >
              {step < 3 ? caseIcon : docIcon}
            </span>
          ) : (
            <span
              className={`flex items-center justify-center w-10 h-10 md:w-12 md:h-12 lg:w-14 lg:h-14  rounded-full  shrink-0 ${
                step >= 3 ? 'bg-lighterPrimary' : 'bg-tertiary text-neutrals80'
              }`}
            >
              {tickCircleIcon}
            </span>
          )}

          <span>
            <p className='text-base font-normal text-bgPrimary'>
              {t('postOpportuntySteps.step3')}
            </p>
            <p
              className={`font-semibold md:text-base lg:text-lg ${
                step > 2 ? 'text-neutrals100' : 'text-neutrals60'
              } leading-tight `}
            >
              {t('postOpportunity.additionalQuestions')}
            </p>
          </span>
        </li>

        <li className='block'>
          <VerticalDivider height='60px' color='#d6ddeb' />
        </li>

        <li className='flex items-center  space-x-2.5 p-2 md:p-4'>
          <span
            className={`flex items-center justify-center w-10 h-10 md:w-12 md:h-12 lg:w-14 lg:h-14 rounded-full  shrink-0 ${
              step === 4 ? 'bg-lighterPrimary' : 'bg-tertiary'
            }`}
          >
            {step < 4 ? docIcon : giftIcon}
          </span>
          <span>
            <p className='text-base font-normal text-bgPrimary'>
              {t('postOpportuntySteps.step4')}
            </p>
            <p
              className={`font-semibold md:text-base lg:text-lg ${
                step > 3 ? 'text-neutrals100' : 'text-neutrals60'
              } leading-tight `}
            >
              {t('postOpportunity.review')}
            </p>
          </span>
        </li>
      </ol>
    </div>
  );
};

export default PostOpportunityStepper;
