import {
  useCreateBookMarkedOpportunitiesMutation,
  useDeleteBookMarkedOpportunitiesMutation,
} from '@/app/api/slices/opportunity-api-slice';
import { useAvatarImage } from '@/hook';
import {
  Avatar,
  Card,
  Chip,
  List,
  ListItem,
  ListItemPrefix,
  Typography,
} from '@material-tailwind/react';
import dateFormat from 'dateformat';
import { useSession } from 'next-auth/react';
import { useState } from 'react';
import { toast } from 'react-toastify';

export interface BookMarkedOpportunityCardProps {
  eventId: string;
  eventTitle: string;
  opType: string;
  orgName: string;
  dateBookmarked: string;
  orgLogoURL: string;
  datePosted: string;
}

const BookMarkedOpportunityCard: React.FC<BookMarkedOpportunityCardProps> = ({
  eventTitle,
  eventId,
  orgName,
  dateBookmarked,
  orgLogoURL,
  opType,
}) => {
  const getAvatar = useAvatarImage();
  const { data: user } = useSession();
  const [createBookmark] = useCreateBookMarkedOpportunitiesMutation();
  const [deleteBookmark] = useDeleteBookMarkedOpportunitiesMutation();
  const [isBookmarked, setIsBookmark] = useState(true);

  const toggleBookmark = async (opportunityId: string) => {
    // setIsBookmark((prevState) => !prevState);
    const wasBookmarked = isBookmarked;
    // Optimistically update the UI
    setIsBookmark(!wasBookmarked);

    try {
      if (!wasBookmarked) {
        await createBookmark(opportunityId).unwrap();
      } else {
        await deleteBookmark(opportunityId).unwrap();
      }
    } catch (error) {
      // Revert the UI update in case of an error
      setIsBookmark(wasBookmarked);

      toast.error('Failed to update bookmark status', {
        theme: 'light',
      });
    }
  };

  return (
    <Card
      color='white'
      className='w-full border rounded-2xl border-gray-300 shadow-lg'
    >
      <List>
        <ListItem>
          <ListItemPrefix>
            <Avatar
              size='lg'
              variant='rounded'
              src={getAvatar(orgName || '', orgLogoURL)}
            />
          </ListItemPrefix>
          <div className='flex flex-col  gap-2 w-full'>
            <div className='flex w-full justify-between'>
              <Typography
                variant='h5'
                color='blue-gray'
                className='font-epilogue font-bold'
              >
                <div className='flex gap-1'>{eventTitle}</div>

                <Typography
                  color='gray'
                  className='font-epilogue '
                  variant='h6'
                >
                  {orgName}
                </Typography>
              </Typography>
              <div>
                {user && (
                  <div>
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      width='24'
                      height='24'
                      viewBox='0 0 24 24'
                      fill={isBookmarked ? '#000000' : 'none'}
                      stroke='#7C8493'
                      strokeWidth='2'
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      onClick={(event) => {
                        event.stopPropagation();
                        toggleBookmark(eventId);
                      }}
                    >
                      <path d='M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z'></path>
                    </svg>
                  </div>
                )}
              </div>
            </div>
            <div>
              <Typography color='gray' className='font-epilogue'>
                Bookmarked on : {dateFormat(dateBookmarked, 'mmm dd, yyyy')}
              </Typography>
              <Chip
                variant='ghost'
                value={opType}
                className='rounded-2xl capitalize p-2 w-fit'
                color={opType === 'Remote' ? 'deep-purple' : 'light-blue'}
              />
            </div>
          </div>
        </ListItem>
      </List>
    </Card>
  );
};

export default BookMarkedOpportunityCard;
