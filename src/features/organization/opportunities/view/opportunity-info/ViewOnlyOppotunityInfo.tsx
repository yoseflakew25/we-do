import OpportunityInfoOtherDetails from '../OpportunityInfoOtherDetails';
import OpportunityTop from '../OpportunityTopSection';
import { useGetOrgDetailByIDQuery } from '@/app/api/slices/org-api-slice';
import { OpportunityDetail } from '@/app/api/types';
import ErrorPage from '@/components/ErrorPage';
import LoadingPage from '@/components/LoadingPage';
import SocialShareButtons from '@/components/SocialShareButtons';
import {
  Button,
  Popover,
  PopoverHandler,
  PopoverContent,
  Tooltip,
  IconButton,
} from '@material-tailwind/react';
import Link from 'next/link';
import { ComponentProps } from 'react';
import { AiOutlineShareAlt } from 'react-icons/ai';
import { BiLogoTelegram } from 'react-icons/bi';

const ViewOnlyOppotunityInfo: React.FC<{
  formData: OpportunityDetail;
  refetch: () => void;
}> = ({ formData: opportunityResponse, refetch }) => {
  const {
    data: orgProfileData,
    isFetching,
    isError,
  } = useGetOrgDetailByIDQuery(opportunityResponse.orgID);

  const sharableUrl =
    typeof window !== 'undefined'
      ? window.location.href
          .replace(/\/(admin|organization)/, '/volunteer')
          .split('?')[0]
      : '';

  const socials = SocialShareButtons({ sharableUrl });

  const actions: ComponentProps<typeof Button>[] = [
    {
      children: (
        <Popover placement='bottom'>
          <PopoverHandler>
            <div className='flex items-center'>
              <AiOutlineShareAlt className='h-4 w-4 mr-1' />
              Share
            </div>
          </PopoverHandler>
          <PopoverContent className='flex gap-2'>
            {socials.map(({ name, renderButton, renderIcon }) => (
              <Tooltip content={name} key={name}>
                {renderButton({
                  url: sharableUrl,
                  children: (
                    <IconButton
                      className='rounded-full overflow-hidden'
                      size='sm'
                    >
                      {renderIcon({})}
                    </IconButton>
                  ),
                })}
              </Tooltip>
            ))}
          </PopoverContent>
        </Popover>
      ),
      color: 'amber',
      className: 'rounded-full h-fit',
      variant: 'text',
    },
    {
      children: (
        <Link
          href={`https://t.me/akilconnectbot?start=opportunity_${opportunityResponse.id}`}
          className='flex items-center'
          target='_blank'
        >
          <BiLogoTelegram className='h-4 w-4 mr-1' />
          Apply on Telegram
        </Link>
      ),
      color: 'blue',
      className: 'rounded-full h-fit',
    },
  ];

  if (isFetching) {
    return <LoadingPage />;
  }

  if (isError || !orgProfileData) {
    return <ErrorPage />;
  }

  const orgDetail = orgProfileData.data;

  return (
    <div>
      <OpportunityTop
        opportunityResponse={opportunityResponse}
        refetch={refetch}
        orgDetail={orgDetail}
        actions={actions}
      />
      <div className='container mx-auto'>
        <OpportunityInfoOtherDetails formData={opportunityResponse} />
      </div>
    </div>
  );
};

export default ViewOnlyOppotunityInfo;
