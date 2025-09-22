import { Button, Dialog, DialogFooter } from '@material-tailwind/react';
import React, { ReactElement } from 'react';

interface ApplicantStatusChangePopupProps {
  title: string;
  subTitle: string;
  buttonText: string;
  onCancel: () => void;
  onConfirm: () => void;
  icon?: ReactElement;
}

export function ApplicantStatusChangePopup({
  title,
  subTitle,
  buttonText,
  onCancel,
  onConfirm,
}: ApplicantStatusChangePopupProps) {
  const [open, setOpen] = React.useState(true);

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
        <div className=' w-10/12 ml-10 my-8'>
          <h1 className='text-neutrals100 text-center font-poppins font-extrabold text-2xl mb-2'>
            {title} ?
          </h1>
          <div className='text-neutrals-80 font-epilogue text-base font-normal leading-7'>
            {subTitle}
          </div>
        </div>
        <DialogFooter>
          <Button
            variant='outlined'
            className={`mr-5 rounded-3xl  ${
              buttonText === 'Accept' ||
              buttonText === 'In Review' ||
              buttonText === 'Interview' ||
              buttonText === 'Offer Extended' ||
              buttonText === 'Hire' ||
              buttonText === 'Certify' ||
              buttonText === 'ተቀበል'
                ? 'border-red-500 text-red-500'
                : 'border-teal-500  text-teal-500 '
            }`}
            onClick={() => {
              onCancel();
            }}
          >
            <span>Cancel</span>
          </Button>
          <Button
            variant='filled'
            className={`rounded-3xl ${
              buttonText === 'Accept' ||
              buttonText === 'In Review' ||
              buttonText === 'Interview' ||
              buttonText === 'Offer Extended' ||
              buttonText === 'Hire' ||
              buttonText === 'Certify' ||
              buttonText === 'ተቀበል'
                ? 'bg-teal-500'
                : 'bg-red-500'
            }`}
            onClick={handleConfirm}
          >
            <span>{buttonText}</span>
          </Button>
        </DialogFooter>
      </Dialog>
    </>
  );
}
