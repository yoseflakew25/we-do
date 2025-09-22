import VerticalDivider from '../dividers/VerticalDivider';
import { useFormState } from '@/features/organization/signup/components/OrgSignupFormContext';
import { useTranslations } from 'next-intl';

const ThreeStageStepper = () => {
  const { step, setStep } = useFormState();
  const t = useTranslations('ThreeStageStepper');

  const handleNextStep = (clickedStep: number) => {
    //  if (stageDisabled){
    setStep(clickedStep);
    //  }
  };

  const editSvg = (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      width='25'
      height='24'
      viewBox='0 0 25 24'
      fill='none'
    >
      <path
        d='M21 7C21 4 19.5 2 16 2L8 2C4.5 2 3 4 3 7L3 17C3 20 4.5 22 8 22L16 22'
        stroke='white'
        strokeWidth='2'
        strokeMiterlimit='10'
        strokeLinecap='round'
        strokeLinejoin='round'
      />
      <path
        d='M14.5 4.5L14.5 6.5C14.5 7.6 15.4 8.5 16.5 8.5L18.5 8.5'
        stroke='white'
        strokeWidth='2'
        strokeMiterlimit='10'
        strokeLinecap='round'
        strokeLinejoin='round'
      />
      <path
        d='M23.8881 10.175C22.6756 8.96254 21.4881 8.93129 20.2443 10.175L19.4881 10.9313C19.4256 10.9938 19.4006 11.0938 19.4256 11.1813C19.9006 12.8375 21.2256 14.1625 22.8818 14.6375C22.9068 14.6438 22.9318 14.65 22.9568 14.65C23.0256 14.65 23.0881 14.625 23.1381 14.575L23.8881 13.8188C24.5068 13.2063 24.8068 12.6125 24.8068 12.0125C24.8131 11.3938 24.5131 10.7938 23.8881 10.175Z'
        fill='white'
      />
      <path
        d='M21.7562 15.2062C21.575 15.1187 21.4 15.0313 21.2312 14.9313C21.0937 14.85 20.9625 14.7625 20.8312 14.6687C20.725 14.6 20.6 14.5 20.4812 14.4C20.4687 14.3937 20.425 14.3563 20.375 14.3063C20.1687 14.1312 19.9375 13.9063 19.7312 13.6563C19.7125 13.6437 19.6812 13.6 19.6375 13.5437C19.575 13.4687 19.4687 13.3437 19.375 13.2C19.3 13.1062 19.2125 12.9687 19.1312 12.8312C19.0312 12.6625 18.9437 12.4937 18.8562 12.3187C18.7415 12.0729 18.4188 11.9999 18.227 12.1917L14.7125 15.7062C14.6312 15.7875 14.5562 15.9437 14.5375 16.05L14.2 18.4437C14.1375 18.8687 14.2562 19.2687 14.5187 19.5375C14.7437 19.7562 15.0562 19.875 15.3937 19.875C15.4687 19.875 15.5437 19.8687 15.6187 19.8562L18.0187 19.5188C18.1312 19.5 18.2875 19.425 18.3625 19.3437L21.8828 15.8234C22.0708 15.6354 22.0002 15.312 21.7562 15.2062Z'
        fill='white'
      />
      <path
        d='M8 13L12 13'
        stroke='white'
        strokeWidth='2'
        strokeMiterlimit='10'
        strokeLinecap='round'
        strokeLinejoin='round'
      />
      <path
        d='M8 17L13 17'
        stroke='white'
        strokeWidth='2'
        strokeMiterlimit='10'
        strokeLinecap='round'
        strokeLinejoin='round'
      />
    </svg>
  );

  const docSvg = (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      width='25'
      height='25'
      viewBox='0 0 25 25'
      fill='none'
    >
      <path
        d='M9.46875 5.0163L7.46875 5.01498C6.93832 5.01464 6.42947 5.22502 6.05415 5.59984C5.67883 5.97467 5.46779 6.48324 5.46744 7.01367L5.45956 19.0137C5.45921 19.5441 5.66959 20.0529 6.04442 20.4283C6.41925 20.8036 6.92782 21.0146 7.45825 21.015L17.4582 21.0215C17.9887 21.0219 18.4975 20.8115 18.8728 20.4367C19.2482 20.0619 19.4592 19.5533 19.4596 19.0229L19.4674 7.02286C19.4678 6.49243 19.2574 5.98358 18.8826 5.60826C18.5077 5.23294 17.9992 5.0219 17.4687 5.02155L15.4687 5.02023'
        stroke='#7C8493'
        strokeWidth='2'
        strokeLinecap='round'
        strokeLinejoin='round'
      />
      <path
        d='M13.4697 3.01923L11.4697 3.01791C10.3652 3.01719 9.46914 3.91203 9.46841 5.0166C9.46769 6.12117 10.3625 7.01719 11.4671 7.01791L13.4671 7.01923C14.5717 7.01995 15.4677 6.12511 15.4684 5.02054C15.4691 3.91597 14.5743 3.01995 13.4697 3.01923Z'
        stroke='#7C8493'
        strokeWidth='2'
        strokeLinecap='round'
        strokeLinejoin='round'
      />
      <path
        d='M9.46387 12.0166L9.47387 12.0166'
        stroke='#7C8493'
        strokeWidth='2'
        strokeLinecap='round'
        strokeLinejoin='round'
      />
      <path
        d='M13.4639 12.0195L15.4639 12.0208'
        stroke='#7C8493'
        strokeWidth='2'
        strokeLinecap='round'
        strokeLinejoin='round'
      />
      <path
        d='M9.46094 16.0166L9.47094 16.0166'
        stroke='#7C8493'
        strokeWidth='2'
        strokeLinecap='round'
        strokeLinejoin='round'
      />
      <path
        d='M13.4609 16.0195L15.4609 16.0208'
        stroke='#7C8493'
        strokeWidth='2'
        strokeLinecap='round'
        strokeLinejoin='round'
      />
    </svg>
  );

  const smallScreen = (
    <ol className='md:hidden flex w-full justify-center rounded-lg border-2 border-lightGrey my-10'>
      <li
        className='flex items-center space-x-2.5 p-2 lg:p-4'
        onClick={() => handleNextStep(1)}
      >
        <span className='flex items-center justify-center w-10 h-10 rounded-full bg-lighterPrimary shrink-0 '>
          {docSvg}
        </span>
        <span>
          <p className='text-base font-normal text-bgPrimary'>
            {step === 1 ? `${t('steps.step1')}` : null}
            {step === 2 ? `${t('steps.step2')}` : null}
            {step === 3 ? `${t('steps.step3')}` : null}
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
      <ol className=' hidden font-poppins md:flex w-fit lg:w-full  space-y-2 lg:space-x-4 md:flex-row md:justify-around md:items-center rounded-lg border-2 border-lightGrey my-10  '>
        <li
          className='flex items-center space-x-2.5 p-2 lg:p-4'
          onClick={() => handleNextStep(1)}
        >
          <span className='flex items-center justify-center w-14 h-14 rounded-full bg-lighterPrimary  shrink-0 '>
            {editSvg}
          </span>
          <span>
            <p className='text-base font-normal text-bgPrimary'>Step 1/3</p>
            <p className='font-semibold md:text-base lg:text-lg text-neutrals60 leading-tight'>
              {t('organizationSignup.organizationDetails')}
            </p>
          </span>
        </li>
        <li>
          <VerticalDivider height='60px' color='#d6ddeb' />
        </li>
        <li
          className='flex items-center  space-x-2.5 p-2 lg:p-4'
          onClick={() => handleNextStep(2)}
        >
          <span
            className={`flex items-center justify-center w-10 h-10 md:w-12 md:h-12 lg:w-14 lg:h-14  rounded-full  shrink-0 ${
              step === 2 || step === 3 ? 'bg-lighterPrimary' : 'bg-tertiary'
            }`}
          >
            {editSvg}
          </span>
          <span>
            <p className='text-base font-normal text-bgPrimary'>Step 2/3</p>
            <p className='font-semibold text-lg text-neutrals60 leading-tight'>
              {t('organizationSignup.aboutOrganization')}
            </p>
          </span>
        </li>
        <li>
          <VerticalDivider height='60px' color='#d6ddeb' />
        </li>
        <li
          className='flex items-center  space-x-2.5 p-2 lg:p-4'
          onClick={() => handleNextStep(3)}
        >
          <span
            className={`flex items-center justify-center w-14 h-14 rounded-full  shrink-0 ${
              step === 3 ? 'bg-lighterPrimary' : 'bg-tertiary'
            }`}
          >
            {docSvg}
          </span>
          <span>
            <p className='text-base font-normal text-bgPrimary'>Step 3/3</p>
            <p className='font-semibold text-lg text-neutrals60 leading-tight'>
              {t('organizationSignup.review')}
            </p>
          </span>
        </li>
      </ol>
    </div>
  );
};

export default ThreeStageStepper;
