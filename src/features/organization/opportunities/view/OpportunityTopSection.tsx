import Header from '../../components/Header';
import IconInCircle from '../../components/IconInCircle';
import OpportunityHeaderCard from '../../components/OpportunityHeaderCard';
import OrgInfoWithIcon from '../../components/OrgInfoWithIcon';
import PageTitle from '../../components/PageTitle';
import { OpportunityDetail, OrganizationProfile } from '@/app/api/types';
import { OP_TYPE_OPTIONS, OPPORTUNITY_TYPE_OPTIONS } from '@/select-options';
import { Button, Typography } from '@material-tailwind/react';
import dateFormat from 'dateformat';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next-nprogress-bar';
import Link from 'next/link';
import { ComponentProps } from 'react';
// import { BiLinkExternal } from 'react-icons/bi';
import {
  BsClockHistory,
  BsCalendar2Week,
  BsBuildings,
  BsDot,
} from 'react-icons/bs';
import { MdLogin, MdOutlinePaid } from 'react-icons/md';

export const OpportunityTop: React.FC<{
  opportunityResponse: OpportunityDetail;
  refetch: () => void;
  handleOnEdit?: () => void;
  orgDetail: OrganizationProfile;
  actions: ComponentProps<typeof Button>[];
}> = ({ opportunityResponse, handleOnEdit, orgDetail, actions: actions }) => {
  const router = useRouter();

  const t = useTranslations('ViewOpportunityInfoPage.topSection');
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
            value: (
              <span className='bg-amber-50 py-1 px-2 w-fit text-amber-600 text-sm rounded-sm'>
                {engagementType}
              </span>
            ),
            renderIcon: (props: ComponentProps<typeof BsClockHistory>) => (
              <BsBuildings {...props} />
            ),
          },
        ]
      : []),
    {
      title: `Paid`,
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
        <Link
          key='orgName'
          href={`/view-organization/${orgDetail.id}`}
          className='flex'
        >
          {orgDetail.orgName}
          {/* <BiLinkExternal className='text-[#26A4FF] text-xs ml-1' /> */}
        </Link>,

        ...opportunityResponse.location.map((loc) => (
          <span key={`location-${loc}`}>{loc}</span>
        )),

        <span key={'opType'}>{opType}</span>,
      ];

  return (
    <div>
      {!handleOnEdit && (
        <Header
          logoUrl='/assets/akil-logo.png'
          logoWidth={120}
          title=''
          rightComponent={
            <Link href={`/login`}>
              <Button
                variant='text'
                size='lg'
                type='submit'
                color='amber'
                className='text-bgPrimary flex capitalize items-center gap-1'
              >
                Login as an Organization <MdLogin size={18} />
              </Button>
            </Link>
          }
        />
      )}

      <div className='container mx-auto'>
        <OpportunityHeaderCard
          hasBorder={false}
          title={
            <PageTitle
              title={
                <div>
                  <h1 className=' text-sm  sm:text-3xl '>
                    {opportunityResponse.title}
                  </h1>
                  <Typography variant='paragraph' className='flex flex-wrap'>
                    {underTitleTexts.map((text, index) => (
                      <span key={index} className='flex items-center'>
                        {index > 0 && (
                          <BsDot size={15} className='text-secondary' />
                        )}
                        {text}
                      </span>
                    ))}
                  </Typography>
                </div>
              }
              onClick={() => router.back()}
              hideBack={!handleOnEdit}
              rightComponent={
                <div className='flex shrink-0 flex-col gap-2 sm:flex-row items-center'>
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
            <div className='container mx-auto flex flex-wrap justify-between items-center px-2 lg:px-4'>
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
    </div>
  );
};

export default OpportunityTop;
