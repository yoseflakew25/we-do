import LoadingButton from './buttons/LoadingButton';
import MultiSelectDropdown, {
  OpportunitySelectOption,
} from '@/features/organization/components/MultiSelectDropdown';
import {
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Button,
} from '@material-tailwind/react';
import { color } from '@material-tailwind/react/types/components/alert';
import { ReactElement, useState } from 'react';

export interface DialogData {
  title: string;
  description?: ReactElement | string;
  selectOptions?: OpportunitySelectOption[];
  action: (_selectedOptions?: OpportunitySelectOption[]) => Promise<void>;
  actionName: string;
  color: color;
}

interface TableDialogProps extends DialogData {
  dialogHandler: (_state: boolean) => void;
  isOpen: boolean;
}
const ConfirmDialog: React.FC<TableDialogProps> = ({
  title,
  description,
  selectOptions,
  action,
  actionName,
  color,
  dialogHandler,
  isOpen,
}) => {
  const [loading, setLoading] = useState(false);
  const [selectedOpportunities, setSelectedOpportunities] = useState<
    OpportunitySelectOption[]
  >([]);
  return (
    <Dialog
      open={isOpen}
      handler={dialogHandler}
      animate={{
        mount: { scale: 1, y: 0 },
        unmount: { scale: 0.9, y: -100 },
      }}
    >
      <DialogHeader className='justify-center pt-6'>
        <h1 className='font-poppins font-extrabold text-2xl text-neutrals100'>
          {title}
        </h1>
      </DialogHeader>
      <DialogBody className='text-neutrals-80 font-epilogue text-base font-normal leading-7 text-center'>
        {description ? (
          description
        ) : (
          <MultiSelectDropdown
            formFieldName={'countries'}
            options={selectOptions || []}
            onChange={(selectedOpportunities) => {
              setSelectedOpportunities(selectedOpportunities); // Update state with selected options
            }}
            prompt='Select one or more opportunities'
          />
        )}
      </DialogBody>

      <DialogFooter className='gap-2'>
        <Button
          size='sm'
          variant='outlined'
          onClick={() => {
            dialogHandler(false);
          }}
        >
          <span>Cancel</span>
        </Button>
        <LoadingButton
          size='sm'
          loading={loading}
          variant='filled'
          onClick={async () => {
            setLoading(true);
            await action(selectedOpportunities);
            setLoading(false);
            dialogHandler(false);
          }}
          color={color}
        >
          <span>{actionName}</span>
        </LoadingButton>
      </DialogFooter>
    </Dialog>
  );
};

export default ConfirmDialog;
