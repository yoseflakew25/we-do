'use client';

import Header from '../components/Header';
import OrganizationsViewAnalytics from '../home/ViewOpportunityAnalytics';
import EmptyDashboard from './post/EmptyDashboard';
import ViewOpportunitiesTable from './view/ViewOpportunitiesTable';
import { useGetOrgOpportunitiesQuery } from '@/app/api/slices/opportunity-api-slice';
import { useGetOrgProfileQuery } from '@/app/api/slices/org-api-slice';
import ErrorPage from '@/components/ErrorPage';
import LoadingPage from '@/components/LoadingPage';
import { useOrgLogo } from '@/hook';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button } from '@material-tailwind/react';
import { useTranslations } from 'next-intl';
import Link from 'next/link';

const Opportunities: React.FC = () => {
  const t = useTranslations('orgOpportunities');
  const getOrgLogo = useOrgLogo();
  // const {
  //   data: mySubscription,
  //   isLoading: loadingSubscription,
  //   error: subscriptionError,
  // } = useGetCurrentSubscriptionQuery();

  const {
    data: opportunities,
    isFetching: isFetchingOpportunities,
    isError: isOpportunityError,
  } = useGetOrgOpportunitiesQuery(undefined);

  const {
    data: orgProfileData,
    isFetching: isFetchingProfile,
    isError: isOrgError,
  } = useGetOrgProfileQuery();

  // const [isModalOpen, setIsModalOpen] = useState(false);

  // useEffect(() => {
  //   if (
  //     mySubscription?.data?.status !== 'Active' &&
  //     opportunities?.data?.length
  //   ) {
  //     setIsModalOpen(true);
  //   }
  // }, [mySubscription, opportunities]);

  // const closeModal = () => setIsModalOpen(false);

  if (isFetchingOpportunities || isFetchingProfile) {
    return <LoadingPage />;
  }

  if (
    isOpportunityError ||
    isOrgError ||
    !orgProfileData
    // subscriptionError
  ) {
    return <ErrorPage />;
  }
  if (opportunities?.data?.length) {
    return (
      <>
        <Header
          logoUrl={getOrgLogo(orgProfileData.data.LogoUrl)}
          title={orgProfileData.data.orgName}
          rightComponent={
            <Link href='/organization/opportunities/post'>
              <Button
                className='text-sm flex p-2 px-8 rounded-full whitespace-nowrap text-white bg-primary'
              >
                <FontAwesomeIcon
                  size='xl'
                  className='mr-3 my-auto'
                  icon={faPlus}
                />
                {t('headerButtonText')}
              </Button>
            </Link>
          }
        />
        <OrganizationsViewAnalytics />
        <ViewOpportunitiesTable />

        {/* Show the dialog ONLY when subscription is not active */}
        {/* {mySubscription?.data?.status !== 'Active' && (
        <Dialog open={isModalOpen} handler={closeModal}>
          <div className='flex justify-between'>
            <DialogHeader className='p-4'>
              Your Plan Has Expired
            </DialogHeader>
            <Button
              variant='text'
              size='sm'
              color='gray'
              onClick={closeModal}
              className='m-4 bg-grey'
            >
              <IoIosClose className='text-black' style={{ border: 'none' }} />
            </Button>
          </div>

          <DialogBody>
            <p className='text-redAccent text-lg text-center font-poppins'>
              Your current plan has expired. Renew now to keep posting
              opportunities and accessing AI resume filtering.
            </p>
          </DialogBody>
          <DialogFooter>
            <Link href='/organization/pricing'>
              <Button
                size='lg'
                color='white'
                className='flex rounded-full py-2 bg-primary text-white'
              >
                Renew Plan
              </Button>
            </Link>
          </DialogFooter>
        </Dialog>
      )} */}
      </>
    );
  }
  return <EmptyDashboard />;
};

export default Opportunities;
