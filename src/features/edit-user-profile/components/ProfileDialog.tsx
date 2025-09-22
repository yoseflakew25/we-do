import LoadingButton from '@/components/buttons/LoadingButton';
import { Dialog, IconButton } from '@material-tailwind/react';
import { useTranslations } from 'next-intl';
import { ReactNode } from 'react';
import { IoIosClose } from 'react-icons/io';

interface ProfileDialogProps {
  children: ReactNode;
  openDialog: boolean;
  loading: boolean;
  hideButtons?: boolean;
  handleOpenDialog: () => void;
  handleSaveChanges?: (
    // eslint-disable-next-line unused-imports/no-unused-vars
    e: React.MouseEvent<HTMLElement> | React.FormEvent<HTMLFormElement>
  ) => Promise<void>;
}
const ProfileDialog = ({
  children,
  openDialog,
  loading,
  hideButtons,
  handleOpenDialog,
  handleSaveChanges,
}: ProfileDialogProps) => {
  const t = useTranslations('EditProfile');

  return (
    <Dialog
      className='rounded-xl relative py-2'
      open={openDialog || false}
      handler={() => {}}
      size='sm'
    >
      <IconButton
        className='!absolute top-1.5 right-1.5 p-0 text-secondary hover:bg-transparent active:bg-transparent'
        variant='text'
        ripple={false}
        onClick={handleOpenDialog}
      >
        <IoIosClose size={35} />
      </IconButton>
      <div className='container py-6 flex flex-col justify-center'>
        {children}
        {!hideButtons && (
          <div className='flex mt-4 space-x-2'>
            <LoadingButton
              loading={loading}
              type='submit'
              size='sm'
              onClick={(e) => handleSaveChanges && handleSaveChanges(e)}
              className='w-28 shadow-none font-poppins capitalize rounded-full font-light text-sm bg-primary'
            >
              {t('Save')}
            </LoadingButton>
            <LoadingButton
              onClick={handleOpenDialog}
              size='sm'
              className='w-28 shadow-none font-poppins capitalize rounded-full font-light text-sm border border-primary text-bgPrimary bg-transparent'
            >
              {t('Cancel')}
            </LoadingButton>
          </div>
        )}
      </div>
    </Dialog>
  );
};

export default ProfileDialog;
