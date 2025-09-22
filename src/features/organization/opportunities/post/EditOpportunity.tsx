'use client';

import IconInCircle from '../../components/IconInCircle';
import OrgInfoWithIcon from '../../components/OrgInfoWithIcon';
import PageTitle from '../../components/PageTitle';
import Location from '../../signup/components/Location';
import CustomQuestionForm from '../custom-questions/CustomQuestionForm';
import { setOpportunity } from '../opportunity-slice';
import { useUpdateOpportunityMutation } from '@/app/api/slices/opportunity-api-slice';
import {
  CombinedOpportunityFormSchema,
  OpportunityDetail,
  OpportunityFormData,
  QuestionInterface,
} from '@/app/api/types';
import HorizontalDivider from '@/components/HorizontalDivider';
import LoadingButton from '@/components/buttons/LoadingButton';
import AllFormErrorsAlert from '@/components/forms/AllFormErrorsAlert';
import FormLabel from '@/components/forms/FormLabel';
import {
  AIInputField,
  AITextAreaField,
  DateSelectorField,
  InputField,
  MultiSelectField,
  EnglishOnlyMultiSelectField,
  RadioField,
  SelectField,
} from '@/components/forms/ValidatedInputs';
import { useAppDispatch, useAppSelector } from '@/hook';
import {
  ORG_AREA_OPTIONS,
  LOCATION_OPTIONS,
  SKILLS_OPTIONS,
  OP_TYPE_OPTIONS,
  PERKS_AND_BENEFITS_OPTIONS,
  OP_PAID_OPTIONS,
  CURRENCY_OPTIONS,
  PAYMENT_TYPE_OPTIONS,
  OPPORTUNITY_TYPE_OPTIONS,
} from '@/select-options';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Accordion,
  AccordionBody,
  AccordionHeader,
  Checkbox,
} from '@material-tailwind/react';
import dateFormat from 'dateformat';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { toast } from 'react-toastify';

interface EditOpportunityProps {
  id: string;
  opportunityData: OpportunityDetail;
  refetchOpportunity: () => Promise<void>;
}

type CustomQuestionsData = {
  formTitle: string;
  formDescription: string;
  questions: QuestionInterface[];
};

const EditOpportunity: React.FC<EditOpportunityProps> = ({
  id,
  opportunityData,
  refetchOpportunity,
}) => {
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = React.useState(0);
  const [isRolling, setIsRolling] = useState(
    opportunityData.isRolling as boolean
  );
  const [googleGeoLocation, setGoogleGeoLocation] = useState(
    opportunityData.geoLocation
  );
  const router = useRouter();
  const [updateOpportunity] = useUpdateOpportunityMutation();

  // ===== these three below related to custom (additional) questions form =====
  const formTitle = useAppSelector(
    (state) => (state.orgSideCustomQuestions as { title: string }).title
  );
  const formDescription = useAppSelector(
    (state) => (state.orgSideCustomQuestions as { desc: string }).desc
  );

  const questions = useAppSelector(
    (state) => (state.orgSideCustomQuestions as { questions: any[] }).questions
  );

  const dispatch = useAppDispatch();

  const {
    register,
    getValues,
    setValue,
    handleSubmit,
    control,
    watch,
    formState: { errors },
  } = useForm<OpportunityFormData>({
    mode: 'onTouched',
    defaultValues: opportunityData,
    resolver: zodResolver(CombinedOpportunityFormSchema),
  });

  const isPaid = watch('isPaid');
  const isRange = watch('paymentOption.rangePayment') === 'with-range';
  const opportunityTitle = useWatch({ control, name: 'title' });

  const t = useTranslations('PostOpportunityPage');
  const translateValidation = useTranslations('validationErrors');

  // Accordion state
  const handleOpen = (value: number) => setOpen(open === value ? 0 : value);

  // Function to handle checkbox change
  const handleRollingChange = async (checked: boolean) => {
    setValue('isRolling', checked);
    setIsRolling(checked);
  };

  const handleRangeCheck = (checked: boolean) => {
    setValue(
      'paymentOption.rangePayment',
      checked ? 'with-range' : 'with-out-range'
    );
    if (!checked) {
      setValue('paymentOption.min', '');
      setValue('paymentOption.max', '');
    } else {
      setValue('paymentOption.amount', '');
    }
  };

  const handleLocationChange = (newLocation: { lat: number; lng: number }) => {
    setGoogleGeoLocation({
      latitude: newLocation.lat,
      longitude: newLocation.lng,
    });
  };

  const onHandleSubmit = async (data: OpportunityFormData) => {
    toast.dismiss();
    setLoading(true);

    data = {
      ...data,
      ...(data.geoLocation = googleGeoLocation),
    };

    const customQuestionsData: CustomQuestionsData = {
      formTitle,
      formDescription,
      questions,
    };

    // Merge the collected custom questions questions with form data
    const finalFormData = {
      ...data,
      paymentOption: {
        ...data.paymentOption,
        amount: Number(data.paymentOption?.amount),
        min: Number(data.paymentOption?.min),
        max: Number(data.paymentOption?.max),
      },
      questions: customQuestionsData.questions,
    };

    dispatch(setOpportunity(finalFormData));

    if (id) {
      await updateOpportunity({ id: id, data: finalFormData })
        .unwrap()
        .then(async () => {
          await refetchOpportunity();
          toast.success('Successfully updated opportunity.', {
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

  const requiredSkillsError =
    errors.requiredSkills &&
    (errors.requiredSkills[0] || errors.requiredSkills);

  const categoriesError =
    errors.categories && (errors.categories[0] || errors.categories);

  return (
    <section className='container px-8 py-8'>
      <form
        onSubmit={handleSubmit(onHandleSubmit)}
        className='font-epilogue pb-16'
      >
        <div className='mb-8'>
          <PageTitle
            title={opportunityData.title}
            onClick={() => router.back()}
            rightComponent={
              <OrgInfoWithIcon
                key='posted'
                title={t('reviewSection.postedOn')}
                value={dateFormat(opportunityData.datePosted, 'mmm dS, yyyy')}
                icon={<IconInCircle icon={plusIcon} />}
              />
            }
          />
        </div>

        <div className=''>
          <p className='text-neutrals60 font-normal text-lg'>
            {t('opportunityInformationSection.basicInformation.description')}
          </p>
        </div>
        <hr className='text-lightGrey my-6' />

        {/* Step 1 */}

        {/* Title */}
        <div className='form-section flex flex-row space-x-16'>
          <div className='basis-1/3'>
            <p className='text-neutrals100 text-xl font-semibold'>
              {t('detailsSection.opportunityTitle.title')}
              <span className='text-redAccent'>*</span>
            </p>
            <p className='text-neutrals60 font-normal text-lg'>
              {t('detailsSection.opportunityTitle.description')}
            </p>
          </div>
          <div className='basis-2/3 ml-20 items-center'>
            <div className='mb-4'>
              <AIInputField
                name={'title'}
                className='rounded-full'
                register={register}
                setValue={setValue}
                getValues={getValues}
                crossOrigin={undefined}
                message={
                  errors.title?.message
                    ? translateValidation(`${errors.title?.message}`)
                    : errors.title?.message
                }
                placeholder={t(
                  'detailsSection.opportunityTitle.inputAreaPlaceholder'
                )}
                required
              />
            </div>
          </div>
        </div>
        <HorizontalDivider />

        {/* Description */}
        <div className='form-section flex flex-row space-x-16'>
          <div className='basis-1/3'>
            <p className='text-neutrals100 text-xl font-semibold'>
              {t('detailsSection.opportunityDescription.title')}
              <span className='text-redAccent'>*</span>
            </p>
            <p className='text-neutrals60 font-normal text-lg'>
              {t('detailsSection.opportunityDescription.description')}
            </p>
          </div>
          <div className='basis-2/3 ml-20 items-center'>
            <div className='mb-4'>
              <AITextAreaField
                title={opportunityTitle}
                maxLength={650}
                name={'description'}
                register={register}
                setValue={setValue}
                getValues={getValues}
                message={
                  errors.description?.message
                    ? translateValidation(`${errors.description?.message}`)
                    : errors.description?.message
                }
                placeholder={t(
                  'detailsSection.opportunityDescription.inputAreaPlaceholder'
                )}
                required
              />
            </div>
          </div>
        </div>
        <HorizontalDivider />
        {/* requirements */}
        <div className='form-section flex flex-row space-x-16'>
          <div className='basis-1/3'>
            <p className='text-neutrals100 text-xl font-semibold'>
              {t('detailsSection.requirements.title')}
              <span className='text-redAccent'>*</span>
            </p>
            <p className='text-neutrals60 font-normal text-lg'>
              {t('detailsSection.requirements.description')}
            </p>
          </div>
          <div className='basis-2/3 ml-20 items-center'>
            <div className='mb-4'>
              <AITextAreaField
                title={opportunityTitle}
                maxLength={650}
                name={'requirements'}
                register={register}
                setValue={setValue}
                getValues={getValues}
                message={
                  errors.requirements?.message
                    ? translateValidation(`${errors.requirements?.message}`)
                    : errors.requirements?.message
                }
                placeholder={t(
                  'detailsSection.requirements.inputAreaPlaceholder'
                )}
                required
              />
            </div>
          </div>
        </div>
        <HorizontalDivider />

        {/* Responsiblities */}
        <div className='form-section flex flex-row space-x-16'>
          <div className='basis-1/3'>
            <p className='text-neutrals100 text-xl font-semibold'>
              {t('detailsSection.responsibilities.title')}
              <span className='text-redAccent'>*</span>
            </p>
            <p className='text-neutrals60 font-normal text-lg'>
              {t('detailsSection.responsibilities.description')}
            </p>
          </div>
          <div className='basis-2/3 ml-20 items-center'>
            <div className='mb-4'>
              <AITextAreaField
                title={opportunityTitle}
                maxLength={650}
                name={'responsibilities'}
                register={register}
                setValue={setValue}
                getValues={getValues}
                message={
                  errors.responsibilities?.message
                    ? translateValidation(`${errors.responsibilities?.message}`)
                    : errors.responsibilities?.message
                }
                placeholder={t(
                  'detailsSection.responsibilities.inputAreaPlaceholder'
                )}
                required
              />
            </div>
          </div>
        </div>
        <HorizontalDivider />

        {/* Ideal Candidate */}
        <div className='form-section flex flex-row space-x-16'>
          <div className='basis-1/3'>
            <p className='text-neutrals100 text-xl font-semibold'>
              {t('detailsSection.idealCandidate.title')}
            </p>
            <p className='text-neutrals60 font-normal text-lg'>
              {t('detailsSection.idealCandidate.description')}
            </p>
          </div>
          <div className='basis-2/3 ml-20 items-center'>
            <div className='mb-4'>
              <AITextAreaField
                title={opportunityTitle}
                maxLength={650}
                name={'idealCandidate'}
                register={register}
                setValue={setValue}
                getValues={getValues}
                message={
                  errors.idealCandidate?.message
                    ? translateValidation(`${errors.idealCandidate?.message}`)
                    : errors.idealCandidate?.message
                }
                placeholder={t(
                  'detailsSection.idealCandidate.inputAreaPlaceholder'
                )}
              />
            </div>
          </div>
        </div>
        <HorizontalDivider />

        {/* Categories */}
        <div className='form-section flex flex-row space-x-16'>
          <div className='basis-1/3'>
            <p className='text-neutrals100 text-xl font-semibold'>
              {t('detailsSection.categories.title')}
              <span className='text-redAccent'>*</span>
            </p>
            <p className='text-neutrals60 font-normal text-lg'>
              {t('detailsSection.categories.description')}
            </p>
          </div>
          <div className='basis-2/3 max-w-lg items-center'>
            <div className='mb-4'>
              <FormLabel label={t('detailsSection.categories.label')} />
              <EnglishOnlyMultiSelectField
                options={ORG_AREA_OPTIONS}
                name={'categories'}
                control={control}
                message={
                  categoriesError?.message
                    ? translateValidation(`${categoriesError?.message}`)
                    : categoriesError?.message
                }
                required
              />
            </div>
          </div>
        </div>
        <HorizontalDivider />

        {/* step 2 */}

        {/* Opportunity Type*/}
        <div className=' flex flex-col gap-y-3 md:flex-row md:space-x-16'>
          <div className='basis-1/3'>
            <p className='text-neutrals100 text-xl font-semibold'>
              {t('opportunityInformationSection.engagementType.title')}
              <span className='text-redAccent'>*</span>
            </p>
            <p className='text-neutrals60 font-normal text-lg'>
              {t('opportunityInformationSection.engagementType.description')}{' '}
            </p>
          </div>

          <div className='basis-2/3 max-w-lg'>
            <SelectField
              options={OPPORTUNITY_TYPE_OPTIONS}
              name={'engagementType'}
              control={control}
              message={
                errors.engagementType?.message
                  ? translateValidation(errors.engagementType?.message)
                  : errors.engagementType?.message
              }
            />
          </div>
        </div>
        <HorizontalDivider />
        <div className=' flex flex-col gap-y-3 md:flex-row md:space-x-16'>
          <div className='basis-1/3'>
            <p className='text-neutrals100 text-xl font-semibold'>
              {t('opportunityInformationSection.opType.title')}
              <span className='text-redAccent'>*</span>
            </p>
            <p className='text-neutrals60 font-normal text-lg'>
              {t('opportunityInformationSection.opType.description')}{' '}
            </p>
          </div>

          <div className='basis-2/3 max-w-lg'>
            <RadioField
              control={control}
              name={'opType'}
              type='OP_TYPE_OPTIONS'
              radioOptions={OP_TYPE_OPTIONS}
              message={
                errors.opType?.message
                  ? translateValidation(`${errors.opType?.message}`)
                  : errors.opType?.message
              }
            />
          </div>
        </div>
        {/* isPaid */}
        <HorizontalDivider />
        <div className=' flex flex-col gap-y-3 md:flex-row md:space-x-16'>
          <div className='basis-1/3'>
            <p className='text-neutrals100 text-xl font-semibold'>
              {t('opportunityInformationSection.isPaid.title')}
              <span className='text-redAccent'>*</span>
            </p>
            <p className='text-neutrals60 font-normal text-lg'>
              {t('opportunityInformationSection.isPaid.description')}
            </p>
          </div>

          <div className='basis-2/3 max-w-lg'>
            <RadioField
              control={control}
              name='isPaid'
              type='OP_PAID_OPTIONS'
              radioOptions={OP_PAID_OPTIONS}
              message={
                errors.isPaid?.message
                  ? translateValidation(`${errors.isPaid?.message}`)
                  : errors.isPaid?.message
              }
            />
          </div>
        </div>
        {isPaid === true && (
          <>
            <HorizontalDivider />
            {/* Salary */}
            <div className=' flex flex-col gap-y-3 md:flex-row md:space-x-16'>
              <div className='basis-1/3'>
                <p className='text-neutrals100 text-xl font-semibold'>
                  {t('opportunityInformationSection.salary.title')}
                </p>
                <p className='text-neutrals60 font-normal text-lg'>
                  {t('opportunityInformationSection.salary.description')}
                </p>
              </div>
              <div className='basis-2/3 max-w-lg'>
                <div className=''>
                  <div className='flex gap-3'>
                    <div className='basis-3/4'>
                      <FormLabel label={'Payment Type'} />
                      <SelectField
                        options={PAYMENT_TYPE_OPTIONS}
                        name={'paymentOption.paymentType'}
                        control={control}
                        message=''
                      />
                    </div>
                    <div className='basis-1/4'>
                      <FormLabel label={'Currency'} />
                      <SelectField
                        options={CURRENCY_OPTIONS}
                        name={'paymentOption.currency'}
                        control={control}
                        message=''
                      />
                    </div>
                  </div>
                </div>
                <Checkbox
                  className='my-2'
                  label={
                    <p className='text-neutrals60 font-normal mt-0.5 text-lg'>
                      {'Use range for salary'}
                    </p>
                  }
                  crossOrigin={undefined}
                  onChange={(e) => handleRangeCheck(e.target.checked)}
                  checked={isRange}
                />

                {isRange ? (
                  <div className='flex sm:flex-row flex-col gap-3'>
                    <div className='basis-1/2'>
                      <FormLabel label={'Min Amount'} />
                      <div className='flex gap-3'>
                        <InputField
                          type='number'
                          name={'paymentOption.min'}
                          className='rounded-full'
                          register={register}
                          crossOrigin={undefined}
                          message={undefined}
                          placeholder={'1000'}
                        />
                      </div>
                    </div>
                    <div className='basis-1/2'>
                      <FormLabel label={'Max Amount'} />
                      <InputField
                        type='number'
                        name={'paymentOption.max'}
                        className='rounded-full'
                        register={register}
                        crossOrigin={undefined}
                        message={undefined}
                        placeholder={'40000'}
                      />
                    </div>
                  </div>
                ) : (
                  <div className='w-1/2'>
                    <FormLabel label={'Amount'} />
                    <InputField
                      type='number'
                      name={'paymentOption.amount'}
                      className='rounded-full'
                      register={register}
                      crossOrigin={undefined}
                      message={undefined}
                      placeholder={t(
                        'opportunityInformationSection.salary.inputAreaPlaceholder'
                      )}
                    />
                  </div>
                )}
              </div>
            </div>
          </>
        )}

        <HorizontalDivider />

        <div className='flexflex-row space-x-16'>
          <div className=' flex flex-col gap-y-3'>
            {/* Start Date*/}
            <div className=' flex flex-col gap-y-3 md:flex-row md:space-x-16 sm:mb-6 mb-3'>
              <div className='basis-1/3'>
                <p className='text-neutrals100 text-xl font-semibold'>
                  {t('opportunityInformationSection.startDate.title')}
                  <span className='text-redAccent'>*</span>
                </p>
                <p className='text-neutrals60 font-normal text-lg'>
                  {t('opportunityInformationSection.startDate.description')}
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
                  {t('opportunityInformationSection.EndDate.title')}
                </p>
                <p className='text-neutrals60 font-normal text-lg'>
                  {t('opportunityInformationSection.EndDate.description')}
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
                  {t('opportunityInformationSection.deadline.title')}
                  <span className='text-redAccent'>*</span>
                </p>
                <p className='text-neutrals60 font-normal text-lg'>
                  {t('opportunityInformationSection.deadline.description')}
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
                  {t('opportunityInformationSection.rolling.description')}
                </p>
              }
              crossOrigin={undefined}
              onChange={(e) => handleRollingChange(e.target.checked)}
              checked={isRolling}
            />
          </div>
        </div>

        <HorizontalDivider />

        {/* City */}
        <div className=' flex flex-col gap-y-3 md:flex-row md:space-x-16'>
          <div className='basis-1/3'>
            <p className='text-neutrals100 text-xl font-semibold'>
              {t('opportunityInformationSection.location.title')}
              <span className='text-redAccent'>*</span>
            </p>
            <p className='text-neutrals60 font-normal text-lg'>
              {t('opportunityInformationSection.location.description')}
            </p>
          </div>
          <div className='basis-2/3 max-w-lg'>
            <MultiSelectField
              options={LOCATION_OPTIONS}
              name={'location'}
              control={control}
              message={
                errors.location?.message
                  ? translateValidation(`${errors.location?.message}`)
                  : errors.location?.message
              }
            />
          </div>
        </div>
        <HorizontalDivider />

        {/* Required Skills */}
        <div className=' flex flex-col gap-y-3 md:flex-row md:space-x-16'>
          <div className='basis-1/3'>
            <p className='text-neutrals100 text-xl font-semibold'>
              {t('opportunityInformationSection.requiredSkills.title')}
            </p>
            <p className='text-neutrals60 font-normal text-lg'>
              {t('opportunityInformationSection.requiredSkills.description')}
            </p>
          </div>
          <div className='basis-2/3 max-w-lg'>
            <MultiSelectField
              options={SKILLS_OPTIONS}
              name={'requiredSkills'}
              control={control}
              message={
                requiredSkillsError?.message
                  ? translateValidation(`${requiredSkillsError?.message}`)
                  : requiredSkillsError?.message
              }
            />
          </div>
        </div>
        <HorizontalDivider />
        {/* Perks and Benefits */}
        <div className=' flex flex-col gap-y-3 md:flex-row md:space-x-16'>
          <div className='basis-1/3'>
            <p className='text-neutrals100 text-xl font-semibold'>
              {t('opportunityInformationSection.perksAndBenefits.title')}
            </p>
            <p className='text-neutrals60 font-normal text-lg'>
              {t('opportunityInformationSection.perksAndBenefits.description')}
            </p>
          </div>
          <div className='basis-2/3 max-w-lg'>
            <MultiSelectField
              options={PERKS_AND_BENEFITS_OPTIONS}
              name={'perksAndBenefits'}
              control={control}
            />
          </div>
        </div>
        <HorizontalDivider />

        {/* Where and When */}
        <div className=' flex flex-col gap-y-3 md:flex-row md:space-x-16'>
          <div className='basis-1/3'>
            <p className='text-neutrals100 text-xl font-semibold'>
              {t('opportunityInformationSection.onboardingSession.title')}
            </p>
            <p className='text-neutrals60 font-normal text-lg'>
              {t('opportunityInformationSection.onboardingSession.description')}
            </p>
          </div>
          <div className='basis-2/3 max-w-lg'>
            <InputField
              name={'whenAndWhere'}
              className='rounded-full'
              register={register}
              crossOrigin={undefined}
              message={
                errors.whenAndWhere?.message
                  ? translateValidation(`${errors.whenAndWhere?.message}`)
                  : errors.whenAndWhere?.message
              }
              placeholder={t(
                'opportunityInformationSection.onboardingSession.inputAreaPlaceholder'
              )}
            />
          </div>
        </div>
        <HorizontalDivider />
        {/* Location on Map */}
        <div className=' flex flex-col gap-y-3 sm:flex-row sm:space-x-16'>
          <div className='basis-1/3'>
            <p className='text-neutrals100 text-xl font-semibold'>
              {t('opportunityInformationSection.locationOnMap.title')}
            </p>
            <p className='text-neutrals60 font-normal text-lg'>
              {t('opportunityInformationSection.locationOnMap.description')}
            </p>
          </div>
          <div className='basis-2/3 sm:ml-20 items-center'>
            <div className='sm:mb-4'>
              <Location
                onLocationChange={handleLocationChange}
                initalPlace={
                  opportunityData.geoLocation || {
                    latitude: 9.030177384554046,
                    longitude: 38.76288469514627,
                  }
                }
              />
            </div>
          </div>
        </div>
        <HorizontalDivider />

        <Accordion open={open === 1} icon={<Icon id={1} open={open} />}>
          <AccordionHeader onClick={() => handleOpen(1)}>
            <h3 className='font-black text-base sm:text-xl text-neutrals100 text-left pb-2 sm:pb-4'>
              Additional Questions{' '}
            </h3>
          </AccordionHeader>
          <AccordionBody>
            <CustomQuestionForm isEditPage={true} />
          </AccordionBody>
        </Accordion>

        <AllFormErrorsAlert errors={errors} className='mb-5' />

        {/* Next button */}
        <div className='flex justify-end mt-4'>
          <LoadingButton
            size='lg'
            className='rounded-full bg-primary capitalize'
            type='submit'
            loading={loading}
            color='amber'
          >
            {t('saveButton')}
          </LoadingButton>
        </div>
      </form>
    </section>
  );
};

function Icon({ id, open }: { id: number; open: number }) {
  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      fill='none'
      viewBox='0 0 24 24'
      strokeWidth={2}
      stroke='currentColor'
      className={`${
        id === open ? 'rotate-180' : ''
      } h-8 w-8 transition-transform text-neutrals100 `}
    >
      <path
        strokeLinecap='round'
        strokeLinejoin='round'
        d='M19.5 8.25l-7.5 7.5-7.5-7.5'
      />
    </svg>
  );
}
export default EditOpportunity;
