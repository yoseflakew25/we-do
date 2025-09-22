'use client';

import IconInCircle from '../../components/IconInCircle';
import OrgInfoWithIcon from '../../components/OrgInfoWithIcon';
import PageTitle from '../../components/PageTitle';
import { useRepostOpportunityMutation } from '@/app/api/slices/opportunity-api-slice';
import {
  OpportunityDetail,
  RepostOpportunityFormData,
  RepostOpportunityFormSchema,
} from '@/app/api/types';
import HorizontalDivider from '@/components/HorizontalDivider';
import LoadingButton from '@/components/buttons/LoadingButton';
import AllFormErrorsAlert from '@/components/forms/AllFormErrorsAlert';
import { DateSelectorField } from '@/components/forms/ValidatedInputs';
import { zodResolver } from '@hookform/resolvers/zod';
import { Checkbox } from '@material-tailwind/react';
import dateFormat from 'dateformat';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';

interface RepostOpportunityProps {
  id: string;
  opportunityData: OpportunityDetail;
  refetchOpportunity: () => Promise<void>;
}

const RepostOpportunity: React.FC<RepostOpportunityProps> = ({
  id,
  opportunityData,
  refetchOpportunity,
}) => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const t = useTranslations('RepostOpportunityPage');
  const t2 = useTranslations('PostOpportunityPage');
  const translateValidation = useTranslations('validationErrors');

  const [repostOpportunity] = useRepostOpportunityMutation();
  const [isRolling, setIsRolling] = useState(
    opportunityData.isRolling as boolean
  );

  const {
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useForm<RepostOpportunityFormData>({
    mode: 'onTouched',
    defaultValues: opportunityData,
    resolver: zodResolver(RepostOpportunityFormSchema),
  });

  // Function to handle checkbox change
  const handleRollingChange = async (checked: boolean) => {
    setValue('isRolling', checked);
    setIsRolling(checked);
  };
  const onHandleSubmit = async (data: RepostOpportunityFormData) => {
    toast.dismiss();
    setLoading(true);

    if (id) {
      await repostOpportunity({ id: id, data: data })
        .unwrap()
        .then(async () => {
          await refetchOpportunity();
          toast.success('Successfully Reposted.', {
            theme: 'light',
          });
          router.back();
        })
        .catch(
          (errorResponse: { data: { message: string }; status: number }) => {
            toast.error(errorResponse.data.message, {
              autoClose: false,
              theme: 'light',
            });
          }
        );
    } else {
      console.error('Could not load org ID');
    }

    setLoading(false);
  };
  const plusIcon = <img src='/assets/icons/plus.svg' />;

  return (
    <section className='container px-8 py-8'>
      <form
        onSubmit={handleSubmit(onHandleSubmit)}
        className='font-epilogue pb-16'
      >
        <div className='mb-8'>
          <PageTitle
            title={t('pageTitle')}
            onClick={() => router.back()}
            rightComponent={
              <OrgInfoWithIcon
                key='posted'
                title={t('postedOn')}
                value={dateFormat(opportunityData.datePosted, 'mmm dS, yyyy')}
                icon={<IconInCircle icon={plusIcon} />}
              />
            }
          />
        </div>

        {/* Step 1 */}
        {/* Opportunity Type*/}
        <div className='form-section flex flex-row '>
          <div className='basis-1/3'>
            <p className='text-neutrals100 text-xl font-semibold'>
              {t('opportunityTitle')}
            </p>
          </div>
          <div className='basis-2/3  items-center '>
            <h1 className='font-poppins font-black text-xl md:text-2xl text-neutrals100 flex items-center tracking-wide'>
              {opportunityData.title}
            </h1>
          </div>
        </div>
        <HorizontalDivider />

        <div className='form-section flex flex-row space-x-16'>
          <div className='flexflex-row space-x-16'>
            <div className=' flex flex-col gap-y-3'>
              {/* Start Date*/}
              <div className=' flex flex-col gap-y-3 md:flex-row md:space-x-16 sm:mb-6 mb-3'>
                <div className='basis-1/3'>
                  <p className='text-neutrals100 text-xl font-semibold'>
                    {t2('opportunityInformationSection.startDate.title')}
                    <span className='text-redAccent'>*</span>
                  </p>
                  <p className='text-neutrals60 font-normal text-lg'>
                    {t2('opportunityInformationSection.startDate.description')}
                  </p>
                </div>
                <div className='basis-2/3 max-w-lg'>
                  <DateSelectorField
                    placeholder='Select a date'
                    name={'startDate'}
                    className='rounded-full'
                    control={control}
                    crossOrigin={undefined}
                    message={
                      errors.startDate?.message
                        ? translateValidation(`${errors.startDate?.message}`)
                        : errors.startDate?.message
                    }
                    disabled={isRolling}
                  />
                </div>
              </div>
              <div className=' flex flex-col gap-y-3 md:flex-row md:space-x-16 sm:mb-6'>
                <div className='basis-1/3'>
                  <p className='text-neutrals100 text-xl font-semibold'>
                    {t2('opportunityInformationSection.EndDate.title')}
                  </p>
                  <p className='text-neutrals60 font-normal text-lg'>
                    {t2('opportunityInformationSection.EndDate.description')}
                  </p>
                </div>
                <div className='basis-2/3 max-w-lg'>
                  <DateSelectorField
                    placeholder='Select a date'
                    name={'endDate'}
                    className='rounded-full'
                    control={control}
                    crossOrigin={undefined}
                    message={
                      errors.endDate?.message
                        ? translateValidation(`${errors.endDate?.message}`)
                        : errors.endDate?.message
                    }
                    disabled={isRolling}
                  />
                </div>
              </div>
              <div className='sm:hidden'>
                <HorizontalDivider />
              </div>
              {/* Application Deadline*/}
              <div className=' flex flex-col gap-y-3 md:flex-row md:space-x-16'>
                <div className='basis-1/3'>
                  <p className='text-neutrals100 text-xl font-semibold'>
                    {t2('opportunityInformationSection.deadline.title')}
                    <span className='text-redAccent'>*</span>
                  </p>
                  <p className='text-neutrals60 font-normal text-lg'>
                    {t2('opportunityInformationSection.deadline.description')}
                  </p>
                </div>
                <div className='basis-2/3 max-w-lg mb-4'>
                  <DateSelectorField
                    name={'deadline'}
                    placeholder='Set the deadline'
                    className='rounded-full'
                    control={control}
                    crossOrigin={undefined}
                    message={
                      errors.deadline?.message
                        ? translateValidation(`${errors.deadline?.message}`)
                        : errors.deadline?.message
                    }
                    disabled={isRolling}
                  />
                </div>
              </div>

              {/* Is Rolling */}
              <Checkbox
                label={
                  <p className='text-neutrals60 font-normal mt-0.5 text-lg'>
                    {t2('opportunityInformationSection.rolling.description')}
                  </p>
                }
                crossOrigin={undefined}
                onChange={(e) => handleRollingChange(e.target.checked)}
                checked={isRolling}
              />
            </div>
          </div>
        </div>

        <section>
          <AllFormErrorsAlert errors={errors} className='mb-5' />

          {/* Submit button */}
          <div className='flex justify-end mt-4'>
            <LoadingButton
              size='lg'
              className='rounded-full bg-primary capitalize'
              type='submit'
              loading={loading}
              color='amber'
            >
              {t('buttonText')}
            </LoadingButton>
          </div>
        </section>
      </form>
    </section>
  );
};
export default RepostOpportunity;
