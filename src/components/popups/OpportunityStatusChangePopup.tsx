import { Button, Dialog, DialogFooter } from '@material-tailwind/react';
import { useTranslations } from 'next-intl';
import React, { ReactElement } from 'react';

interface OpportunityStatusChangePopupProps {
  title: string;
  subTitle: string;
  buttonText: string;
  deadline: string;
  applicants: string;
  inReview: string;
  declined: string;
  accepted: string;
  onCancel: () => void;
  onConfirm: () => void;
  icon?: ReactElement;
}

export function OpportunityStatusChangePopup({
  title,
  subTitle,
  buttonText,
  deadline,
  applicants,
  inReview,
  declined,
  accepted,
  onCancel,
  onConfirm,
}: OpportunityStatusChangePopupProps) {
  const [open, setOpen] = React.useState(true);
  const t = useTranslations('ViewOpportunityInfoPage.statusChangePopup');

  const handleOpen = () => {
    setOpen(!open);
  };

  const handleConfirm = () => {
    setOpen(!open);
    onConfirm();
  };

  return (
    <>
      <Dialog
        open={open}
        handler={handleOpen}
        animate={{
          mount: { scale: 1, y: 0 },
          unmount: { scale: 0.9, y: -100 },
        }}
      >
        <div className=' w-10/12 ml-8 my-8'>
          <h1 className='text-neutrals100 text-center font-poppins font-extrabold text-2xl mb-2'>
            {title} ?
          </h1>
          <div className='text-neutrals-80 font-epilogue text-base font-normal leading-7'>
            {subTitle}
          </div>
          <div className=' flex justify-between my-4'>
            <h3>
              {t('deadline')} <span>{deadline}</span>
            </h3>
            <h3>
              {applicants} <span>{t('applicants')} </span>
            </h3>
          </div>

          <div className=' flex justify-between'>
            <div className=' border-t-4 border-yellow-600 border-b  border-x border-b-gray-200 border-x-gray-200 p-1 px-1 text-neutrals-100 font-epilogue text-sm font-semibold leading-7'>
              <span className='w-[10px] h-[10px] bg-yellow-600 inline-block mr-2 rounded-full'></span>
              {t('inReview')}{' '}
              <span className='bg-blue-gray-100 p-1'>{inReview}</span>
            </div>
            <div className=' border-t-4 border-red-600 border-b  border-x border-b-gray-200 border-x-gray-200 p-1 px-1 text-neutrals-100 font-epilogue text-sm font-semibold leading-7'>
              <span className='w-[10px] h-[10px] bg-red-600 inline-block mr-2 rounded-full'></span>
              {t('declined')}{' '}
              <span className='bg-blue-gray-100 p-1'>{declined}</span>
            </div>
            <div className=' border-t-4 border-green border-b  border-x border-b-gray-200 border-x-gray-200 p-1 px-1 text-neutrals-100 font-epilogue text-sm font-semibold leading-7'>
              <span className='w-[10px] h-[10px] bg-green inline-block mr-2 rounded-full'></span>
              {t('accepted')}{' '}
              <span className='bg-blue-gray-100 p-1'>{accepted}</span>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button
            variant='outlined'
            className={`mr-5 rounded-3xl  ${
              buttonText === 'Reopen' || buttonText === 'ክፈት'
                ? 'border-red-500 text-red-500'
                : 'border-teal-500  text-teal-500 '
            }`}
            onClick={() => {
              onCancel();
            }}
          >
            <span>{t('cancelButton')} </span>
          </Button>
          <Button
            variant='filled'
            onClick={handleConfirm}
            className={`rounded-3xl ${
              buttonText === 'Reopen' || buttonText === 'ክፈት'
                ? 'bg-teal-500'
                : 'bg-red-500'
            }`}
          >
            <span>{buttonText}</span>
          </Button>
        </DialogFooter>
      </Dialog>
    </>
  );
}
