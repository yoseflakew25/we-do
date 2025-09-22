import Header from '../../components/Header';
import {
  faPlus,
  faContactBook,
  faStreetView,
  faEdit,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button } from '@material-tailwind/react';
import { useSession } from 'next-auth/react';
import { useTranslations } from 'next-intl';
import Link from 'next/link';

const EmptyDashboard: React.FC = () => {
  const { data: session } = useSession();
  const t = useTranslations('EmptyDashboard');
  const isProfileDisabled = session?.user?.profileStatus === 'disabled';
  const isProfileDeclined = session?.user?.profileStatus === 'rejected';
  const isAccountNotVerified = session?.user?.profileStatus === 'complete';

  // for trial subscription
  // const { data: mySubscription } = useGetCurrentSubscriptionQuery();

  // const [isOpen, setIsOpen] = useState(false);

  // const toggleModal = () => {
  //   setIsOpen((prev) => !prev);
  // };

  return (
    <>
      <div className=''>
        <Header logoUrl='/assets/akil-logo.png' logoWidth={120} title='' />
      </div>

      <div className='container text-center'>
        {/* Heading */}
        <div className='px-5 flex flex-wrap sm:px-6 sm:flex-nowrap'>
          <div className='mt-4'>
            <h3 className='text-2xl font-black text-left font-poppins leading-10 text-[#25324B]'>
              {t('opportunityListing.title')}
            </h3>
            <p className='px-2 mt-1 text-base text-[#7C8493] font-medium leading-6'>
              {t('opportunityListing.subTitle')}
            </p>
          </div>
        </div>
        {/* Body */}

        {isProfileDisabled ? (
          <div>
            <h3 className='mt-2 text-2xl font-black font-poppins text-[#25324B] leading-10'>
              {t('disabledAccount.title')}
            </h3>
            <p className='px-2 mt-1 text-lg font-semibold text-[#515B6F] leading-7 text-center'>
              {t('disabledAccount.message')}
            </p>
            <div className='mt-6'>
              <Link href='/about-us'>
                <Button
                  size='lg'
                  color='amber'
                  className='flex rounded-full py-5 mx-auto'
                >
                  <FontAwesomeIcon
                    size='xl'
                    className='mr-3 my-auto'
                    icon={faContactBook}
                  />
                  {t('contactUsButtonText')}
                </Button>
              </Link>
            </div>
          </div>
        ) : isProfileDeclined ? (
          <div>
            <h3 className='mt-2 text-2xl font-black font-poppins text-[#25324B] leading-10'>
              {t('declinedAccount.title')}
            </h3>
            <p className=' px-2 mt-1 text-lg font-semibold text-[#515B6F] leading-7 text-center'>
              {t('declinedAccount.message')}
            </p>
            <div className='mt-6 flex justify-center'>
              <Link href='/organization/profile/edit'>
                <Button
                  size='lg'
                  color='amber'
                  className='flex rounded-full py-5 mx-auto mr-4'
                >
                  <FontAwesomeIcon
                    size='xl'
                    className='mr-3 my-auto'
                    icon={faEdit}
                  />
                  {t('editOrgProfileButtonText')}
                </Button>
              </Link>
              <Link href='/about-us'>
                <Button
                  size='lg'
                  color='amber'
                  className='flex rounded-full py-5 mx-auto'
                >
                  <FontAwesomeIcon
                    size='xl'
                    className='mr-3 my-auto'
                    icon={faContactBook}
                  />
                  {t('contactUsButtonText')}
                </Button>
              </Link>
            </div>
          </div>
        ) : isAccountNotVerified ? (
          <div>
            <h3 className='mt-2 text-2xl font-black font-poppins text-[#25324B] leading-10'>
              {t('notVerifiedAccount.title')!}
            </h3>
            <p className='px-2 mt-1 text-lg font-semibold text-[#515B6F] leading-7 text-center'>
              {t('notVerifiedAccount.message')}
            </p>
            <div className='mt-6'>
              <Link href='/organization/profile'>
                <Button
                  size='lg'
                  color='amber'
                  className='flex rounded-full py-5 mx-auto'
                >
                  <FontAwesomeIcon
                    size='xl'
                    className='mr-3 my-auto'
                    icon={faStreetView}
                  />
                  {t('viewOrgProfileButtonText')}
                </Button>
              </Link>
            </div>
          </div>
        ) : (
          // trial subsription section
          // : mySubscription?.data === null ? (
          //   <div className='mt-4 flex flex-col justify-center gap-4'>
          //     <p className='text-lg font-semibold text-[#515B6F] text-center'>
          //       You have no posted opportunities. Start by subscribing to a plan or try a trial to explore. View all packages on the pricing page.
          //     </p>
          //     <div className='flex justify-center space-x-4'>
          //       {/* Button */}
          //       <Button
          //         onClick={toggleModal}
          //         className='bg-lighterPrimary text-white px-6 py-2 rounded-full shadow hover:bg-lightBlue-600 transition'
          //       >
          //         Start Trial
          //       </Button>

          //       {/* Modal for trial card*/}
          //       {isOpen && (
          //         <div className='fixed inset-0 z-50 flex items-center justify-center'>
          //           <div
          //             className='fixed inset-0 bg-black bg-opacity-50'
          //             onClick={toggleModal}
          //           ></div>

          //           <div className='relative bg-white rounded-lg shadow-xl p-6 max-w-sm w-full'>
          //             <button
          //               onClick={toggleModal}
          //               className='absolute top-2 right-2 text-gray-500 hover:text-gray-700 focus:outline-none'
          //             >
          //               <AiOutlineClose size={24} />
          //             </button>
          //             <TrialCard />
          //           </div>
          //         </div>
          //       )}
          //       <Link href='/organization/pricing'>
          //         <Button
          //           size='lg'
          //           color='amber'
          //           className='flex rounded-full py-2'
          //         >
          //           Packages
          //         </Button>
          //       </Link>
          //     </div>
          //   </div>
          // )
          <div className='py-12 px-24'>
            <div>
              <h3 className='mt-2 text-2xl font-black font-poppins text-[#25324B] leading-10'>
                {session?.user.name
                  ? t('welcome', { name: `${session?.user.name}` })
                  : t('welcome', { name: 'User' })}
              </h3>
              <p className='px-2 mt-1 text-lg font-semibold text-[#515B6F] leading-7 text-center'>
                {t('info')}
              </p>
              <div className='mt-6'>
                <Link href='/organization/opportunities/post'>
                  <Button
                    size='lg'
                    className='flex rounded-full py-5 mx-auto text-white bg-primary'
                  >
                    <FontAwesomeIcon
                      size='xl'
                      className='mr-3 my-auto'
                      icon={faPlus}
                    />
                    {t('postButtonText')}
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};
export default EmptyDashboard;
