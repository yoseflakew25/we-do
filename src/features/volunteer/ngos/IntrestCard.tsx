import { useUpdateUserInterestMutation } from '@/app/api/slices/volunteer-api-slice';
import ThreeDotsLoading from '@/components/ThreeDotsLoading';
import LoadingButton from '@/components/buttons/LoadingButton';
import ProfileDialog from '@/features/edit-user-profile/components/ProfileDialog';
import { Typography } from '@material-tailwind/react';
import React, { useState } from 'react';
import { toast } from 'react-toastify';

interface InterestCardProps {
  interestStatus: string;
  orgId: string;
}

const InterestCard: React.FC<InterestCardProps> = ({
  interestStatus,
  orgId,
}) => {
  const [updateUserInterest, { isLoading }] = useUpdateUserInterestMutation();
  const [interestStatusValue, setInterestStatus] = useState<string | undefined>(
    interestStatus
  );
  const [openDialog, setOpenDialog] = useState(false);

  const handleOpenDialog = () => {
    setOpenDialog((prev) => !prev);
  };

  const triggerRevalidation = async (tag: string) => {
    try {
      await fetch(`/api/revalidate?tag=${tag}`);
    } catch (error) {
      console.error('Error triggering revalidation:', error);
    }
  };

  const toggleInterest = async () => {
    const newStatus =
      interestStatusValue === 'not-interested'
        ? 'interested'
        : 'not-interested';

    try {
      await updateUserInterest({
        orgID: orgId,
        interestStatus: newStatus,
      }).unwrap();
      setInterestStatus(newStatus);
      handleOpenDialog();
      toast.success(
        `You have successfully ${
          newStatus === 'interested' ? 'shown' : 'removed'
        } interest in working with this organization.`
      );
      triggerRevalidation('interestStatus');
    } catch (error) {
      toast.error('An error occurred. Please try again.');
    }
  };

  return (
    <>
      <div
        className={`mx-4 p-8 cursor-pointer font-poppins shadow-xl rounded-3xl w-80 h-40 text-center flex justify-center items-center ${
          interestStatusValue === 'interested'
            ? 'border border-b-[16px] border-x-0 border-t-0 border-green'
            : 'border border-b-[16px] border-x-0 border-t-0 border-primary'
        }`}
        onClick={handleOpenDialog}
      >
        {isLoading ? (
          <ThreeDotsLoading />
        ) : (
          <>
            {interestStatusValue === 'interested' ? (
              <span className=' text-green font-semibold'>
                You have shown interest in working with this organization.
              </span>
            ) : (
              <span className='text-bgPrimary font-semibold'>
                Interested in working with this organization in the future?
              </span>
            )}
          </>
        )}
      </div>
      {interestStatusValue === 'interested' ? (
        <CancelInterestPopup
          openDialog={openDialog}
          toggleInterest={toggleInterest}
          handleOpen={handleOpenDialog}
        />
      ) : (
        <InterestedPopup
          openDialog={openDialog}
          toggleInterest={toggleInterest}
          handleOpen={handleOpenDialog}
        />
      )}
    </>
  );
};

export default InterestCard;

interface InterestPopupProps {
  openDialog: boolean;
  handleOpen: () => void;
  toggleInterest: () => void;
}

const InterestedPopup = ({
  openDialog,
  handleOpen,
  toggleInterest,
}: InterestPopupProps) => {
  const [loading, setLoading] = useState(false);
  const handleSaveChanges = async (
    e: React.FormEvent<HTMLFormElement> | React.MouseEvent<HTMLElement>
  ) => {
    e.preventDefault();
    setLoading(true);
    toggleInterest();
    setLoading(false);
  };
  return (
    <ProfileDialog
      openDialog={openDialog || false}
      handleSaveChanges={handleSaveChanges}
      handleOpenDialog={handleOpen}
      loading={loading}
      hideButtons={true}
    >
      <Typography className='font-poppins text-lg font-semibold text-black mb-2'>
        Interested in working with this organization?
      </Typography>
      <Typography className='font-poppins text-s font-normal text-secondary mb-2'>
        Please review the following consent terms before proceeding.
      </Typography>
      <ul className='list-disc pl-5 text-s'>
        <li className='font-poppins font-normal text-secondary'>
          <span className='font-medium'>Data Sharing:</span> Your profile
          information and contact details will be shared with the organization.
        </li>
        <li className='font-poppins font-normal text-secondary'>
          <span className='font-medium'>Data Usage:</span> The organization may
          use your data to contact you and send relevant opportunities.
        </li>
        <li className='font-poppins font-normal text-secondary'>
          <span className='font-medium'>Your Rights:</span> You can withdraw
          your consent at any time or request the deletion of your data by
          contacting HOOPOE.
        </li>
      </ul>
      <div className='flex justify-end gap-4 mt-4'>
        <LoadingButton
          loading={loading}
          type='submit'
          size='sm'
          onClick={(e) => handleSaveChanges(e)}
          className='w-28 shadow-none font-poppins capitalize rounded-full font-light text-base bg-primary'
        >
          Accept
        </LoadingButton>
        <LoadingButton
          onClick={handleOpen}
          size='sm'
          className='w-28 shadow-none font-poppins capitalize rounded-full font-light text-base border border-primary text-bgPrimary bg-transparent'
        >
          Decline
        </LoadingButton>
      </div>
    </ProfileDialog>
  );
};

const CancelInterestPopup = ({
  openDialog,
  handleOpen,
  toggleInterest,
}: InterestPopupProps) => {
  const [loading, setLoading] = useState(false);

  const handleSaveChanges = async (
    e: React.FormEvent<HTMLFormElement> | React.MouseEvent<HTMLElement>
  ) => {
    e.preventDefault();
    setLoading(true);
    toggleInterest();
    setLoading(false);
  };

  return (
    <ProfileDialog
      openDialog={openDialog || false}
      handleSaveChanges={handleSaveChanges}
      handleOpenDialog={handleOpen}
      loading={loading}
      hideButtons={true}
    >
      <Typography className='font-poppins text-lg font-semibold text-black mb-2'>
        Cancel your interest in this organization?
      </Typography>
      <Typography className='font-poppins text-s font-normal text-secondary mb-2'>
        Before proceeding, please review the following information.
      </Typography>
      <ul className='list-disc pl-5 text-s'>
        <li className='font-poppins font-normal text-secondary'>
          <span className='font-medium'>Action Reversal:</span> You will no
          longer be marked as interested in this organization.
        </li>
        <li className='font-poppins font-normal text-secondary'>
          <span className='font-medium'>Data Sharing:</span> Your data will no
          longer be shared with this organization.
        </li>
        <li className='font-poppins font-normal text-secondary'>
          <span className='font-medium'>Opportunities:</span> You may miss out
          on opportunities shared by this organization in the future.
        </li>
      </ul>
      <div className='flex justify-end gap-4 mt-4'>
        <LoadingButton
          loading={loading}
          type='submit'
          size='sm'
          onClick={(e) => handleSaveChanges(e)}
          className='w-28 shadow-none font-poppins capitalize rounded-full font-light text-base bg-primary'
        >
          Confirm
        </LoadingButton>
        <LoadingButton
          onClick={handleOpen}
          size='sm'
          className='w-28 shadow-none font-poppins capitalize rounded-full font-light text-base border border-primary text-bgPrimary bg-transparent'
        >
          Cancel
        </LoadingButton>
      </div>
    </ProfileDialog>
  );
};
