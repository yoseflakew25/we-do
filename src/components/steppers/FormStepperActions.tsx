import LoadingButton from '../buttons/LoadingButton';
import { faArrowRight, faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button } from '@material-tailwind/react';
import { useTranslations } from 'next-intl';
import React from 'react';

interface FormStepperActionsProps {
  onHandleBack?: () => void;
  className?: string;
  nextLoading?: boolean;
  isLast?: boolean;
  nextDisabled?: boolean;
}

const FormStepperActions: React.FC<FormStepperActionsProps> = ({
  onHandleBack,
  className,
  nextLoading,
  isLast,
  nextDisabled,
}) => {
  const t = useTranslations('OrganizationSignupPage');

  return (
    <div className={`flex gap-4 justify-end ${className}`}>
      {onHandleBack && (
        <Button
          onClick={onHandleBack}
          color='amber'
          size='lg'
          variant='outlined'
          className='rounded-full text-bgPrimary border-primary'
          disabled={nextLoading}
        >
          <FontAwesomeIcon size='lg' className='mr-2' icon={faArrowLeft} />
          {t('buttonText.back')}
        </Button>
      )}

      <LoadingButton
        loading={nextLoading}
        type='submit'
        color='amber'
        size='lg'
        className='rounded-full bg-primary'
        disabled={nextDisabled}
      >
        {isLast ? `${t('buttonText.finish')}` : `${t('buttonText.next')}`}
        {!isLast && (
          <FontAwesomeIcon size='lg' className='ml-2' icon={faArrowRight} />
        )}
      </LoadingButton>
    </div>
  );
};

export default FormStepperActions;
