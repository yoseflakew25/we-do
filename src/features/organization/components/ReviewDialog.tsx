import {
  Dialog,
  Card,
  CardBody,
  CardFooter,
  Button,
  Typography,
  Avatar,
  Textarea,
  Rating,
} from '@material-tailwind/react';
import React from 'react';

interface ReviewDialogProps {
  open: boolean;
  handleOpenAddReview: () => void;
  logo_url: string;
  recipientId: string;
  reviewerId: string;
  recipientName: string;
  reviewerName: string;
  title: string;
  subTitle: string;
}

const ReviewDialog: React.FC<ReviewDialogProps> = ({
  open,
  handleOpenAddReview,
  //   recipientId,
  recipientName,
  //   reviewerId,
  logo_url,
  subTitle,
  title,
}) => {
  return (
    <Dialog
      size='lg'
      open={open}
      handler={handleOpenAddReview}
      className='bg-transparent shadow-none'
    >
      <Card className='mx-auto w-full max-w-[24rem]'>
        <CardBody className='flex flex-col gap-4 py-10'>
          <Typography
            className='mb-3 font-normal text-neutrals100'
            variant='paragraph'
          >
            Reviewing {recipientName}
          </Typography>

          <div className='flex gap-3 items-center '>
            <Avatar
              size='sm'
              variant='circular'
              alt='Logo'
              className='border-2 border-white'
              src={logo_url}
            />
            <div>
              <Typography variant='h5' className='text-neutrals100'>
                {title}
              </Typography>
              <Typography variant='paragraph' className='text-neutrals60'>
                {subTitle}
              </Typography>
            </div>
          </div>

          <div className='text-center'>
            <Rating />
          </div>
          <Textarea
            label='Write your feedback here...'
            className=' text-neutrals60'
          />
        </CardBody>
        <CardFooter className='pt-0'>
          <div className='flex justify-end fit'>
            <Button variant='text' onClick={handleOpenAddReview}>
              Cancel
            </Button>

            <Button
              color='amber'
              className='ml-1 font-bold rounded-full'
              onClick={handleOpenAddReview}
            >
              Done
            </Button>
          </div>
        </CardFooter>
      </Card>
    </Dialog>
  );
};

export default ReviewDialog;
