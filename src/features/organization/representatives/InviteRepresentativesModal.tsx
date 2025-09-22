import { useInviteOrgRepresentativesMutation } from '@/app/api/slices/org-api-slice';
import LoadingButton from '@/components/buttons/LoadingButton';
import { InputField } from '@/components/forms/ValidatedInputs';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Button,
  Dialog,
  DialogHeader,
  DialogFooter,
  List,
  ListItem,
  ListItemPrefix,
  IconButton,
  Typography,
  ListItemSuffix,
} from '@material-tailwind/react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { IoMdAdd } from 'react-icons/io';
import { IoMdCloseCircleOutline } from 'react-icons/io';
import { toast } from 'react-toastify';
import { z } from 'zod';

const InviteSchema = z.object({
  first_name: z.string().min(1, 'First Name is required'),
  last_name: z.string().min(1, 'Last Name is required'),
  email: z.string().email('Invalid email').min(1, 'Email is required'),
  title: z.string().min(1, 'Title is required'),
});

type InviteFormValues = z.infer<typeof InviteSchema>;

interface InviteModalProps {
  setIsModalOpen: (_isOpen: boolean) => void;
  refetch: () => void;
  isOpen: boolean;
}
function TrashIcon() {
  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      viewBox='0 0 24 24'
      fill='currentColor'
      className='h-6 w-6'
    >
      <path
        fillRule='evenodd'
        d='M16.5 4.478v.227a48.816 48.816 0 013.878.512.75.75 0 11-.256 1.478l-.209-.035-1.005 13.07a3 3 0 01-2.991 2.77H8.084a3 3 0 01-2.991-2.77L4.087 6.66l-.209.035a.75.75 0 01-.256-1.478A48.567 48.567 0 017.5 4.705v-.227c0-1.564 1.213-2.9 2.816-2.951a52.662 52.662 0 013.369 0c1.603.051 2.815 1.387 2.815 2.951zm-6.136-1.452a51.196 51.196 0 013.273 0C14.39 3.05 15 3.684 15 4.478v.113a49.488 49.488 0 00-6 0v-.113c0-.794.609-1.428 1.364-1.452zm-.355 5.945a.75.75 0 10-1.5.058l.347 9a.75.75 0 101.499-.058l-.346-9zm5.48.058a.75.75 0 10-1.498-.058l-.347 9a.75.75 0 001.5.058l.345-9z'
        clipRule='evenodd'
      />
    </svg>
  );
}
const InviteModal: React.FC<InviteModalProps> = ({
  setIsModalOpen,
  isOpen,
  refetch,
}) => {
  const {
    handleSubmit,
    register,
    reset,
    formState: { errors: filedErrors },
  } = useForm<InviteFormValues>({
    resolver: zodResolver(InviteSchema),
  });
  const [inviteRepresentatives] = useInviteOrgRepresentativesMutation();
  const [loading, setLoading] = useState(false);
  const [representatives, setRepresentatives] = useState<InviteFormValues[]>(
    []
  );

  const handleAddAnother = (data: InviteFormValues) => {
    setRepresentatives((prev) => [...prev, data]);
    reset();
  };

  const onSubmit = async (data: InviteFormValues) => {
    const allRepresentatives = [...representatives, data];
    setLoading(true);
    await inviteRepresentatives(allRepresentatives)
      .unwrap()
      .then((response) => {
        toast.success(response.message, {
          theme: 'light',
        });
        refetch();
      })
      .catch((errorResponse: { data: { message: string }; status: number }) => {
        const errorMessage =
          errorResponse.data?.message ||
          'An unexpected error occurred. Please try again later.';
        toast.error(errorMessage, {
          autoClose: false,
          theme: 'light',
        });
      });
    setLoading(false);
    setIsModalOpen(false);
  };

  return (
    <Dialog
      open={isOpen}
      size='md'
      handler={setIsModalOpen}
      animate={{
        mount: { scale: 1, y: 0 },
        unmount: { scale: 0.9, y: -100 },
      }}
      className='bg-white px-6 rounded-lg max-h-[90vh] flex flex-col'
    >
      <DialogHeader className='justify-between'>
        <h1 className='font-poppins font-extrabold text-2xl text-neutrals100'>
          Add Representatives
        </h1>

        <IoMdCloseCircleOutline
          size={32}
          onClick={() => setIsModalOpen(false)}
          className='cursor-pointer'
        />
      </DialogHeader>
      {/* <DialogBody className='text-neutrals-80 font-epilogue text-base font-normal leading-7 text-center'> */}
      <form
        onSubmit={handleSubmit(onSubmit)}
        className='flex-1 overflow-y-auto mb-4'
        autoComplete='off'
      >
        {/* Display added colleagues as tiles */}

        {representatives.length > 0 && (
          <List>
            {representatives.map((rep, index) => (
              <ListItem
                key={index}
                className=' rounded-md bg-gray-100 mb-2'
                ripple={false}
              >
                <ListItemPrefix>
                  <IconButton
                    variant='text'
                    color='blue-gray'
                    onClick={() => {
                      const newReps = representatives.filter(
                        (_, i) => i !== index
                      );
                      setRepresentatives(newReps);
                    }}
                  >
                    <TrashIcon />
                  </IconButton>
                </ListItemPrefix>
                <div className='mr-2'>
                  <Typography variant='h6' color='blue-gray'>
                    {rep.first_name} {rep.last_name}
                  </Typography>
                  <Typography
                    variant='small'
                    color='gray'
                    className='font-normal'
                  >
                    {rep.email}
                  </Typography>
                </div>
                <ListItemSuffix>
                  <Typography
                    variant='paragraph'
                    color='gray'
                    className='font-normal'
                  >
                    {rep.title}
                  </Typography>
                </ListItemSuffix>
              </ListItem>
            ))}
          </List>
        )}

        {/* Form fields for new colleague */}
        <div className=' px-4'>
          <div className='mb-2  flex flex-wrap gap-3'>
            <div className='flex-1'>
              <label
                className='block text-neutrals80 text-base font-semibold mb-1'
                htmlFor='first_name'
              >
                First Name
              </label>

              <InputField
                name='first_name'
                register={register}
                crossOrigin={undefined}
                message={filedErrors.first_name?.message}
                required
                autoComplete='new_first_name'
              />
            </div>

            <div className='flex-1'>
              <label
                className='block text-neutrals80 text-base font-semibold mb-1 text-[#515B6F]'
                htmlFor='last_name'
              >
                Last Name
              </label>

              <InputField
                name='last_name'
                register={register}
                crossOrigin={undefined}
                message={filedErrors.last_name?.message}
                required
                autoComplete='new_last_name'
              />
            </div>
          </div>

          <div className='mb-2'>
            <label
              className='block text-neutrals80 text-base font-semibold mb-1 text-[#515B6F]'
              htmlFor='email'
            >
              Email Address
            </label>
            <InputField
              name='email'
              register={register}
              crossOrigin={undefined}
              message={filedErrors.email?.message}
              required
              autoComplete='new_email'
            />
          </div>

          <div className='mb-2'>
            <label
              className='block text-neutrals80 text-base font-semibold mb-1 text-[#515B6F]'
              htmlFor='title'
            >
              Title
            </label>
            <InputField
              name='title'
              register={register}
              crossOrigin={undefined}
              message={filedErrors.title?.message}
              required
              autoComplete='new_title'
            />
          </div>
        </div>
      </form>
      {/* </DialogBody> */}

      <DialogFooter>
        <Button
          type='button'
          onClick={handleSubmit(handleAddAnother)}
          variant='outlined'
          color='amber'
          className='rounded-3xl  mr-4 flex items-center p-2 capitalize'
        >
          <IoMdAdd size={20} /> Add Another
        </Button>
        <LoadingButton
          loading={loading}
          onClick={handleSubmit(onSubmit)}
          type='submit'
          variant='filled'
          className='rounded-3xl bg-primary capitalize'
        >
          Done
        </LoadingButton>
      </DialogFooter>
    </Dialog>
  );
};

export default InviteModal;
