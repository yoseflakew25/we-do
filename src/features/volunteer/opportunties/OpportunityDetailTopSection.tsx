import { OpportunityDetail, OrganizationProfile } from '@/app/api/types';
import IconInCircle from '@/features/organization/components/IconInCircle';
import OpportunityHeaderCard from '@/features/organization/components/OpportunityHeaderCard';
import OrgInfoWithIcon from '@/features/organization/components/OrgInfoWithIcon';
import PageTitle from '@/features/organization/components/PageTitle';
import { OP_TYPE_OPTIONS, OPPORTUNITY_TYPE_OPTIONS } from '@/select-options';
import { Avatar, Button, Typography } from '@material-tailwind/react';
import dateFormat from 'dateformat';
import { useSession } from 'next-auth/react';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next-nprogress-bar';
import Link from 'next/link';
import { ComponentProps } from 'react';
import { BiLinkExternal } from 'react-icons/bi';
import { BsClockHistory, BsCalendar2Week, BsBuildings } from 'react-icons/bs';
import { MdOutlinePaid } from 'react-icons/md';

export const OpportunityDetailTopSection: React.FC<{
  opportunityResponse: OpportunityDetail;
  refetch: () => void;
  handleOnEdit?: () => void;
  orgDetail: OrganizationProfile;
  actions: ComponentProps<typeof Button>[];
}> = ({ opportunityResponse, handleOnEdit, orgDetail, actions: actions }) => {
  // IDs for testing
  const opportunityDetailOppTitleTestId = `opportunity-detail-opp-title`;
  const opportunityDetailOrgNameTestId = `opportunity-detail-org-name`;
  const opportunityDetailOrgLinkTestId = `opportunity-detail-org-link`;

  const router = useRouter();
  const t = useTranslations('ViewOpportunityInfoPage.topSection');
  const { data: user } = useSession();
  const isAuthenticated = Boolean(user?.user);
  const deadlineValue = opportunityResponse.isRolling
    ? 'Rolling'
    : dateFormat(opportunityResponse.deadline!, 'mmm dd, yyyy');
  const opType = OP_TYPE_OPTIONS.find(
    ({ value }) => value == opportunityResponse.opType
  )?.label;
  const engagementType = OPPORTUNITY_TYPE_OPTIONS.find(
    ({ value }) => value == opportunityResponse.engagementType
  )?.label;

  const headlineItems = [
    {
      title: `${t('postedOn')}`,
      value: dateFormat(opportunityResponse.datePosted, 'mmm dd, yyyy'),
      renderIcon: (props: ComponentProps<typeof BsClockHistory>) => (
        <BsClockHistory {...props} />
      ),
    },
    {
      title: `${t('deadline')}`,
      value: deadlineValue,
      renderIcon: (props: ComponentProps<typeof BsClockHistory>) => (
        <BsCalendar2Week {...props} />
      ),
    },
    {
      title: `${t('opType')}`,
      value: opType,
      renderIcon: (props: ComponentProps<typeof BsClockHistory>) => (
        <BsBuildings {...props} />
      ),
    },

    ...(engagementType
      ? [
          {
            title: `${t('engagementType')}`,
            value: engagementType,
            renderIcon: (props: ComponentProps<typeof BsClockHistory>) => (
              <BsBuildings {...props} />
            ),
          },
        ]
      : []),
    {
      title: `Salary / Compensation`,
      value: opportunityResponse.isPaid
        ? `${
            opportunityResponse.paymentOption
              ? opportunityResponse.paymentOption.amount
                ? ` ${opportunityResponse?.paymentOption?.amount} ${opportunityResponse?.paymentOption?.currency}`
                : opportunityResponse.paymentOption?.min
                ? `${opportunityResponse?.paymentOption?.min} - ${opportunityResponse?.paymentOption?.max} ${opportunityResponse?.paymentOption?.currency}`
                : 'Yes'
              : 'Yes'
          }`
        : 'No',
      renderIcon: (props: ComponentProps<typeof BsClockHistory>) => (
        <MdOutlinePaid {...props} />
      ),
    },
  ];

  const underTitleTexts: JSX.Element[] = handleOnEdit
    ? []
    : [
        isAuthenticated ? (
          <Link
            key='orgName'
            href={`/talent/organizations/${orgDetail.id}`}
            className='flex'
            data-testid={opportunityDetailOrgNameTestId}
          >
            {orgDetail.orgName}
            <BiLinkExternal
              className='text-[#26A4FF] text-xs ml-1 self-center'
              data-testid={opportunityDetailOrgLinkTestId}
            />
          </Link>
        ) : (
          <div key='orgName-obscured' className='flex items-center'>
            <span className='blur-xl opacity-40 select-none pointer-events-none'>
              {orgDetail.orgName}
            </span>
            <button
              onClick={() => router.push('/login')}
              className='ml-2 text-primary underline text-xs'
            >
              Log in to view
            </button>
          </div>
        ),
      ];

  return (
    <div className='mt-10 md:mt-0 '>
      <OpportunityHeaderCard
        hasBorder={false}
        title={
          <PageTitle
            title={
              <div className='gird grid-col-1 md:flex flex-row md:gap-4 p-4 space-y-2 md:space-y-0'>
                <div className='relative flex self-center justify-self-center md:col-span-1'>
                  <Avatar
                    size='lg'
                    variant='circular'
                    src={
                      orgDetail.LogoUrl || '/assets/organization-default.png'
                    }
                    alt='org logo'
                    className={`flex self-center justify-self-center md:col-span-1 ${
                      isAuthenticated
                        ? ''
                        : 'blur-xl opacity-40 pointer-events-none'
                    }`}
                  />
                  {!isAuthenticated && (
                    <div className='absolute inset-0 rounded-full ring-1 ring-white/40' />
                  )}
                </div>

                <div className='col-span-3'>
                  <h1
                    className='text-md sm:text-xl lg:text-3xl font-poppins'
                    data-testid={opportunityDetailOppTitleTestId}
                  >
                    {opportunityResponse.title}
                  </h1>
                  <Typography className='flex flex-wrap font-poppins text-tertiary '>
                    {underTitleTexts}
                  </Typography>
                </div>

                <div className='sm:hidden col-span-4 flex flex-row gap-2 items-center mt-1 justify-center'>
                  {actions.map(({ onClick, ...buttonProps }, index) => (
                    <Button
                      key={index}
                      {...buttonProps}
                      size='sm'
                      className={`h-fit ${buttonProps.className}`}
                      onClick={onClick}
                    />
                  ))}
                </div>
              </div>
            }
            onClick={() => router.back()}
            rightComponent={
              <div className='hidden sm:flex shrink-0 flex-col gap-2 sm:flex-row items-center mt-4'>
                {actions.map(({ onClick, ...buttonProps }, index) => (
                  <Button
                    key={index}
                    {...buttonProps}
                    size='sm'
                    className={`h-fit ${buttonProps.className}`}
                    onClick={onClick}
                  />
                ))}
              </div>
            }
          />
        }
        details={
          <div className='mx-auto flex justify-between overflow-x-auto lg:overflow-visible items-center w-full gap-4'>
            {headlineItems.map(({ renderIcon, ...props }) => (
              <OrgInfoWithIcon
                key={props.title}
                {...props}
                icon={
                  <IconInCircle
                    icon={renderIcon({ size: 18, color: '#26A4FF' })}
                  />
                }
              />
            ))}
          </div>
        }
      />
    </div>
  );
};

export default OpportunityDetailTopSection;
