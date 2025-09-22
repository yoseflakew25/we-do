import Location from '../../signup/components/Location';
import { handleBack, handleNext, setOpportunity } from '../opportunity-slice';
import {
  OpportunityFormData,
  OpportunityInformationFormSchema,
} from '@/app/api/types';
import HorizontalDivider from '@/components/HorizontalDivider';
import FormLabel from '@/components/forms/FormLabel';
import {
  DateSelectorField,
  InputField,
  MultiSelectField,
  RadioField,
  SelectField,
} from '@/components/forms/ValidatedInputs';
import FormStepperActions from '@/components/steppers/FormStepperActions';
import { useAppSelector, useAppDispatch } from '@/hook';
import {
  LOCATION_OPTIONS,
  OP_TYPE_OPTIONS,
  PERKS_AND_BENEFITS_OPTIONS,
  SKILLS_OPTIONS,
  OP_PAID_OPTIONS,
  OPPORTUNITY_TYPE_OPTIONS,
  PAYMENT_TYPE_OPTIONS,
  CURRENCY_OPTIONS,
} from '@/select-options';
import { zodResolver } from '@hookform/resolvers/zod';
import { Checkbox } from '@material-tailwind/react';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

const OpportunityInformationForm: React.FC = () => {
  const opportunityData = useAppSelector(
    (state) => state.opportunity.opportunity
  );
  const dispatch = useAppDispatch();
  const t = useTranslations(
    'PostOpportunityPage.opportunityInformationSection'
  );
  const translateValidation = useTranslations('validationErrors');
  const [isRolling, setIsRolling] = useState(false);
  const [customErrors, setCustomErrors] = useState<{
    startDate?: string;
    deadline?: string;
  }>({});

  const {
    register,
    handleSubmit,
    setValue,
    control,
    watch,
    formState: { errors },
    setError,
    clearErrors,
  } = useForm<OpportunityFormData>({
    defaultValues: opportunityData,
    mode: 'onTouched',
    resolver: zodResolver(OpportunityInformationFormSchema),
  });

  const isPaid = watch('isPaid');
  const isRange = watch('paymentOption.rangePayment') === 'with-range';

  // Function to handle checkbox change
  const handleRollingChange = async (checked: boolean) => {
    setValue('isRolling', checked);
    setIsRolling(checked);

    // Clear custom errors when switching to rolling
    if (checked) {
      setCustomErrors({});
      clearErrors(['startDate', 'deadline']);
    }
  };

  const handleRangeCheck = (checked: boolean) => {
    setValue(
      'paymentOption.rangePayment',
      checked ? 'with-range' : 'with-out-range'
    );
  };

  const handleLocationChange = (newLocation: { lat: number; lng: number }) => {
    const newLocationData = {
      ...opportunityData,
      geoLocation: {
        latitude: newLocation.lat,
        longitude: newLocation.lng,
      },
    };
    setValue; //Don't know what this does
    dispatch(setOpportunity(newLocationData));
  };

  // Custom validation for non-rolling events
  const validateNonRollingDates = (data: OpportunityFormData): boolean => {
    const newCustomErrors: { startDate?: string; deadline?: string } = {};

    if (!data.isRolling) {
      if (!data.startDate) {
        newCustomErrors.startDate =
          'Start date is required for non-rolling events';
        setError('startDate', {
          type: 'manual',
          message: 'Start date is required for non-rolling events',
        });
      } else {
        clearErrors('startDate');
      }

      if (!data.deadline) {
        newCustomErrors.deadline =
          'Application deadline is required for non-rolling events';
        setError('deadline', {
          type: 'manual',
          message: 'Application deadline is required for non-rolling events',
        });
      } else {
        clearErrors('deadline');
      }
    } else {
      // Clear errors for rolling events
      clearErrors(['startDate', 'deadline']);
    }

    setCustomErrors(newCustomErrors);
    return Object.keys(newCustomErrors).length === 0;
  };

  function onHandleSubmit(data: OpportunityFormData) {
    // Validate non-rolling event dates before submission
    if (!validateNonRollingDates(data)) {
      return; // Stop submission if validation fails
    }

    data.isPaid = String(data.isPaid) === 'true';
    dispatch(setOpportunity(data));
    window?.scrollTo({
      top: 0,
      behavior: 'auto',
    });
    dispatch(handleNext());
  }

  const requiredSkillsError =
    errors.requiredSkills &&
    (errors.requiredSkills[0] || errors.requiredSkills);

  // Get error message for start date (custom or schema validation)
  const getStartDateError = () => {
    if (customErrors.startDate) return customErrors.startDate;
    if (errors.startDate?.message)
      return translateValidation(`${errors.startDate.message}`);
    return errors.startDate?.message;
  };

  // Get error message for deadline (custom or schema validation)
  const getDeadlineError = () => {
    if (customErrors.deadline) return customErrors.deadline;
    if (errors.deadline?.message)
      return translateValidation(`${errors.deadline.message}`);
    return errors.deadline?.message;
  };

  return (
    <form
      onSubmit={handleSubmit(onHandleSubmit)}
      className='font-epilogue pb-16'
    >
      <p className='text-neutrals100 text-xl font-semibold'>
        {t('basicInformation.title')}
      </p>
      <p className='text-neutrals60 font-normal text-lg'>
        {t('basicInformation.description')}
      </p>
      <HorizontalDivider />

      {/* Opportunity Type */}
      <div className=' flex flex-col gap-y-3 md:flex-row md:space-x-16'>
        <div className='basis-1/3'>
          <p className='text-neutrals100 text-xl font-semibold'>
            {t('engagementType.title')}
            <span className='text-redAccent'>*</span>
          </p>
          <p className='text-neutrals60 font-normal text-lg'>
            {t('engagementType.description')}{' '}
          </p>
        </div>

        <div className='basis-2/3 max-w-md'>
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
            {t('opType.title')}
            <span className='text-redAccent'>*</span>
          </p>
          <p className='text-neutrals60 font-normal text-lg'>
            {t('opType.description')}{' '}
          </p>
        </div>

        <div className='basis-2/3 max-w-md'>
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

      <HorizontalDivider />
      {/* isPaid */}
      <div className=' flex flex-col gap-y-3 md:flex-row md:space-x-16'>
        <div className='basis-1/3'>
          <p className='text-neutrals100 text-xl font-semibold'>
            {t('isPaid.title')}
            <span className='text-redAccent'>*</span>
          </p>
          <p className='text-neutrals60 font-normal text-lg'>
            {t('isPaid.description')}
          </p>
        </div>

        <div className='basis-2/3 max-w-md'>
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
                {t('salary.title')}
              </p>
              <p className='text-neutrals60 font-normal text-lg'>
                {t('salary.description')}
              </p>
            </div>
            <div className='basis-2/3 max-w-md'>
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
                    placeholder={t('salary.inputAreaPlaceholder')}
                  />
                </div>
              )}
            </div>
          </div>
        </>
      )}
      <HorizontalDivider />
      <div className=' flex flex-col gap-y-3'>
        {/* Start Date*/}
        <div className=' flex flex-col gap-y-3 md:flex-row md:space-x-16 sm:mb-6 mb-3'>
          <div className='basis-1/3'>
            <p className='text-neutrals100 text-xl font-semibold'>
              {t('startDate.title')}
              <span className='text-redAccent'>*</span>
            </p>
            <p className='text-neutrals60 font-normal text-lg'>
              {t('startDate.description')}
            </p>
          </div>
          <div className='basis-2/3 max-w-md'>
            <DateSelectorField
              placeholder='Select a date'
              name={'startDate'}
              className='rounded-full'
              control={control}
              crossOrigin={undefined}
              message={getStartDateError()}
              disabled={isRolling}
            />
          </div>
        </div>
        <div className=' flex flex-col gap-y-3 md:flex-row md:space-x-16 sm:mb-6'>
          <div className='basis-1/3'>
            <p className='text-neutrals100 text-xl font-semibold'>
              {t('EndDate.title')}
            </p>
            <p className='text-neutrals60 font-normal text-lg'>
              {t('EndDate.description')}
            </p>
          </div>
          <div className='basis-2/3 max-w-md'>
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
              {t('deadline.title')}
              <span className='text-redAccent'>*</span>
            </p>
            <p className='text-neutrals60 font-normal text-lg'>
              {t('deadline.description')}
            </p>
          </div>
          <div className='basis-2/3 max-w-md mb-4'>
            <DateSelectorField
              name={'deadline'}
              placeholder='Set the deadline'
              className='rounded-full'
              control={control}
              crossOrigin={undefined}
              message={getDeadlineError()}
              disabled={isRolling}
            />
          </div>
        </div>

        {/* Is Rolling */}
        <Checkbox
          label={
            <p className='text-neutrals60 font-normal mt-0.5 text-lg'>
              {t('rolling.description')}
            </p>
          }
          crossOrigin={undefined}
          onChange={(e) => handleRollingChange(e.target.checked)}
        />
      </div>
      <HorizontalDivider />

      {/* Required Skills */}
      <div className=' flex flex-col gap-y-3 md:flex-row md:space-x-16'>
        <div className='basis-1/3'>
          <p className='text-neutrals100 text-xl font-semibold'>
            {t('requiredSkills.title')}
          </p>
          <p className='text-neutrals60 font-normal text-lg'>
            {t('requiredSkills.description')}
          </p>
        </div>
        <div className='basis-2/3 max-w-md'>
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
            {t('perksAndBenefits.title')}
          </p>
          <p className='text-neutrals60 font-normal text-lg'>
            {t('perksAndBenefits.description')}
          </p>
        </div>
        <div className='basis-2/3 max-w-md'>
          <MultiSelectField
            options={PERKS_AND_BENEFITS_OPTIONS}
            name={'perksAndBenefits'}
            control={control}
          />
        </div>
      </div>
      <HorizontalDivider />

      {/* City */}
      <div className=' flex flex-col gap-y-3 md:flex-row md:space-x-16'>
        <div className='basis-1/3'>
          <p className='text-neutrals100 text-xl font-semibold'>
            {t('location.title')}
            <span className='text-redAccent'>*</span>
          </p>
          <p className='text-neutrals60 font-normal text-lg'>
            {t('location.description')}
          </p>
        </div>
        <div className='basis-2/3 max-w-md'>
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

      {/* Where and When */}
      <div className=' flex flex-col gap-y-3 md:flex-row md:space-x-16'>
        <div className='basis-1/3'>
          <p className='text-neutrals100 text-xl font-semibold'>
            {t('onboardingSession.title')}
          </p>
          <p className='text-neutrals60 font-normal text-lg'>
            {t('onboardingSession.description')}
          </p>
        </div>
        <div className='basis-2/3 max-w-md'>
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
            placeholder={t('onboardingSession.inputAreaPlaceholder')}
          />
        </div>
      </div>

      <HorizontalDivider />
      {/* Location on Map */}
      <div className=' flex flex-col gap-y-3 md:flex-row md:space-x-16'>
        <div className='basis-1/3'>
          <p className='text-neutrals100 text-xl font-semibold'>
            {t('locationOnMap.title')}
          </p>
          <p className='text-neutrals60 font-normal text-lg'>
            {t('locationOnMap.description')}
          </p>
        </div>
        <div className='basis-2/3 max-w-xl'>
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
      <HorizontalDivider />

      {/* button */}

      <FormStepperActions
        nextDisabled={
          Object.keys(errors).length > 0 || Object.keys(customErrors).length > 0
        }
        onHandleBack={() => dispatch(handleBack())}
        className='mt-4'
      />
    </form>
  );
};

export default OpportunityInformationForm;
