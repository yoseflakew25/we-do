import OpportunityInfoOtherDetails from '../OpportunityInfoOtherDetails';
import { OpportunityFormData } from '@/app/api/types';
import IconInCircle from '@/features/organization/components/IconInCircle';
import OpportunityHeaderCard from '@/features/organization/components/OpportunityHeaderCard';
import OrgInfoWithIcon from '@/features/organization/components/OrgInfoWithIcon';
import OrgTitleAndDetail from '@/features/organization/components/OrgTitleAndDetail';
import { OP_TYPE_OPTIONS, OPPORTUNITY_TYPE_OPTIONS } from '@/select-options';
import dateFormat from 'dateformat';
import { useTranslations } from 'next-intl';
import { MdOutlinePaid } from 'react-icons/md';

const ReviewOppotunityInfo: React.FC<{ formData: OpportunityFormData }> = ({
  formData: opportunityFormData,
}) => {
  const opType = OP_TYPE_OPTIONS.find(
    ({ value }) => value == opportunityFormData.opType
  )?.label;

  const engagementType = OPPORTUNITY_TYPE_OPTIONS.find(
    ({ value }) => value == opportunityFormData.engagementType
  )?.label;
  const t = useTranslations('PostOpportunityPage.reviewSection');

  const postedOn = dateFormat(new Date(), 'mmm dd, yyyy');
  const plusIcon = <img src='/assets/icons/plus.svg' />;
  const calendarWithNumIcon = <img src='/assets/icons/calendar-with-num.svg' />;
  const buildingIcon = <img src='/assets/icons/building.svg' />;
  const deadlineValue = opportunityFormData.isRolling
    ? 'Rolling'
    : dateFormat(opportunityFormData.deadline!, 'mmm dd, yyyy');
  return (
    <div>
      <OpportunityHeaderCard
        hasBorder
        title={<OrgTitleAndDetail title={opportunityFormData.title} />}
        details={
          <div className='mx-auto flex justify-between items-center flex-wrap w-full space-y-4 sm:flex sm:space-x-8 sm:space-y-0 px-2'>
            <OrgInfoWithIcon
              key='posted'
              title={t('postedOn')}
              value={postedOn}
              icon={<IconInCircle icon={plusIcon} />}
            />

            <OrgInfoWithIcon
              key='deadline'
              title={t('deadline')}
              value={deadlineValue}
              icon={<IconInCircle icon={calendarWithNumIcon} />}
            />

            <OrgInfoWithIcon
              key='opType'
              title={t('opType')}
              value={opType}
              icon={<IconInCircle icon={buildingIcon} />}
            />

            <OrgInfoWithIcon
              key='oppportunityType'
              title={t('engagementType')}
              value={
                <span className='bg-amber-50 py-1 px-2 w-fit text-amber-600 text-sm rounded-sm'>
                  {engagementType}
                </span>
              }
              icon={<IconInCircle icon={buildingIcon} />}
            />

            <OrgInfoWithIcon
              key='paid'
              title={'Paid'}
              value={
                opportunityFormData.isPaid
                  ? `${
                      opportunityFormData.paymentOption
                        ? opportunityFormData.paymentOption.amount
                          ? ` ${opportunityFormData?.paymentOption?.amount} ${opportunityFormData?.paymentOption?.currency}`
                          : opportunityFormData.paymentOption?.min
                          ? `${opportunityFormData?.paymentOption?.min} - ${opportunityFormData?.paymentOption?.max} ${opportunityFormData?.paymentOption?.currency}`
                          : 'Yes'
                        : 'Yes'
                    }`
                  : 'No'
              }
              icon={
                <IconInCircle
                  icon={<MdOutlinePaid size={18} color='#26A4FF' />}
                />
              }
            />
          </div>
        }
      />
      <OpportunityInfoOtherDetails formData={opportunityFormData} />
    </div>
  );
};

export default ReviewOppotunityInfo;
