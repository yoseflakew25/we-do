import { handleNext, setOpportunity } from '../opportunity-slice';
import {
  OpportunityDescriptionFormSchema,
  OpportunityFormData,
} from '@/app/api/types';
import HorizontalDivider from '@/components/HorizontalDivider';
import {
  AIInputField,
  AITextAreaField,
  AIWithRichTextField,
  EnglishOnlyMultiSelectField,
  TextAreaField,
} from '@/components/forms/ValidatedInputs';
import FormStepperActions from '@/components/steppers/FormStepperActions';
import { useAppDispatch, useAppSelector } from '@/hook';
import { ORG_AREA_OPTIONS } from '@/select-options';
import { zodResolver } from '@hookform/resolvers/zod';
import { Radio, Typography } from '@material-tailwind/react';
import { useTranslations } from 'next-intl';
import { useForm, useWatch } from 'react-hook-form';
import { Controller } from 'react-hook-form';

const OpportunityDescriptionForm: React.FC = () => {
  const opportunityData = useAppSelector(
    (state) => state.opportunity.opportunity
  );
  const dispatch = useAppDispatch();

  const {
    register,
    getValues,
    handleSubmit,
    setValue,
    control,
    watch,
    formState: { errors },
  } = useForm<OpportunityFormData>({
    defaultValues: opportunityData,
    mode: 'onTouched',
    resolver: zodResolver(OpportunityDescriptionFormSchema),
  });

  console.log('opp', opportunityData);

  const opportunityTitle = useWatch({ control, name: 'title' });
  const t = useTranslations('PostOpportunityPage.detailsSection');
  const translateValidation = useTranslations('validationErrors');

  function onHandleSubmit(data: OpportunityFormData) {
    dispatch(setOpportunity(data));
    window?.scrollTo({
      top: 0,
      behavior: 'auto',
    });
    dispatch(handleNext());
  }

  const categoriesError =
    errors.categories && (errors.categories[0] || errors.categories);

  return (
    <form
      onSubmit={handleSubmit(onHandleSubmit)}
      className='font-epilogue pb-16'
    >
      <div>
        <p className='text-neutrals100 text-xl font-semibold'>
          {t('details.title')}
        </p>
        <p className='text-neutrals60 font-normal text-lg'>
          {t('details.description')}
        </p>
      </div>
      <HorizontalDivider />

      {/* Title */}
      <div className='fo flex flex-col gap-y-3 sm:flex-row sm:space-x-16'>
        <div className='basis-1/3'>
          <p className='text-neutrals100 text-xl font-semibold'>
            {t('opportunityTitle.title')}
            <span className='text-redAccent'>*</span>
          </p>
          <p className='text-neutrals60 font-normal text-lg'>
            {t('opportunityTitle.description')}
          </p>
        </div>
        <div className='basis-2/3 sm:ml-20 items-center'>
          <div className='sm:mb-4'>
            <AIInputField
              name={'title'}
              register={register}
              setValue={setValue}
              getValues={getValues}
              crossOrigin={undefined}
              message={
                errors.title?.message
                  ? translateValidation(`${errors.title?.message}`)
                  : errors.title?.message
              }
              placeholder={t('opportunityTitle.inputAreaPlaceholder')}
            />
          </div>
        </div>
      </div>
      <HorizontalDivider />

      {/* Description */}
      <div className='flex flex-col gap-y-3 sm:flex-row sm:space-x-16'>
        <div className='basis-1/3'>
          <p className='text-neutrals100 text-xl font-semibold'>
            {t('opportunityDescription.title')}
            <span className='text-redAccent'>*</span>
          </p>
          <p className='text-neutrals60 font-normal text-lg'>
            {t('opportunityDescription.description')}
          </p>
        </div>
        <div className='basis-2/3 sm:ml-20 items-center'>
          <div className='sm:mb-4'>
            <AIWithRichTextField
              title={opportunityTitle}
              name={'description'}
              control={control}
              setValue={setValue}
              getValues={getValues}
              message={
                errors.description?.message
                  ? translateValidation(`${errors.description?.message}`)
                  : errors.description?.message
              }
              placeholder={t('opportunityDescription.inputAreaPlaceholder')}
            />
          </div>
        </div>
      </div>
      <HorizontalDivider />

      {/* Requirements */}
      <div className='flex flex-col gap-y-3 sm:flex-row sm:space-x-16'>
        <div className='basis-1/3'>
          <p className='text-neutrals100 text-xl font-semibold'>
            {t('requirements.title')}
            <span className='text-redAccent'>*</span>
          </p>
          <p className='text-neutrals60 font-normal text-lg'>
            {t('requirements.description')}
          </p>
        </div>
        <div className='basis-2/3 sm:ml-20 items-center'>
          <div className='sm:mb-4'>
            <AITextAreaField
              title={opportunityTitle}
              name={'requirements'}
              register={register}
              setValue={setValue}
              getValues={getValues}
              message={
                errors.requirements?.message
                  ? translateValidation(`${errors.requirements?.message}`)
                  : errors.requirements?.message
              }
              placeholder={t('requirements.inputAreaPlaceholder')}
            />
          </div>
        </div>
      </div>
      <HorizontalDivider />

      {/* Responsiblities */}
      <div className='flex flex-col gap-y-3 sm:flex-row sm:space-x-16'>
        <div className='basis-1/3'>
          <p className='text-neutrals100 text-xl font-semibold'>
            {t('responsibilities.title')}
            <span className='text-redAccent'>*</span>
          </p>
          <p className='text-neutrals60 font-normal text-lg'>
            {t('responsibilities.description')}
          </p>
        </div>
        <div className='basis-2/3 sm:ml-20 items-center'>
          <div className='sm:mb-4'>
            <AITextAreaField
              title={opportunityTitle}
              name={'responsibilities'}
              register={register}
              setValue={setValue}
              getValues={getValues}
              message={
                errors.responsibilities?.message
                  ? translateValidation(`${errors.responsibilities?.message}`)
                  : errors.responsibilities?.message
              }
              placeholder={t('responsibilities.inputAreaPlaceholder')}
            />
          </div>
        </div>
      </div>
      <HorizontalDivider />

      {/* Ideal Candidate */}
      <div className='flex flex-col gap-y-3 sm:flex-row sm:space-x-16'>
        <div className='basis-1/3'>
          <p className='text-neutrals100 text-xl font-semibold'>
            {t('idealCandidate.title')}
          </p>
          <p className='text-neutrals60 font-normal text-lg'>
            {t('idealCandidate.description')}
          </p>
        </div>
        <div className='basis-2/3 sm:ml-20 items-center'>
          <div className='sm:mb-4'>
            <AITextAreaField
              title={opportunityTitle}
              name={'idealCandidate'}
              register={register}
              setValue={setValue}
              getValues={getValues}
              message={
                errors.idealCandidate?.message
                  ? translateValidation(`${errors.idealCandidate?.message}`)
                  : errors.idealCandidate?.message
              }
              placeholder={t('idealCandidate.inputAreaPlaceholder')}
            />
          </div>
        </div>
      </div>
      <HorizontalDivider />

      {/* Opportunity Visibility */}
      <div className='flex flex-col gap-y-3 md:flex-row md:space-x-16'>
        <div className='basis-1/3'>
          <p className='text-neutrals100 text-xl font-semibold'>
            {t('opportunityVisibility.title')}
            <span className='text-redAccent'>*</span>
          </p>
          <p className='text-neutrals60 font-normal text-lg'>
            {t('opportunityVisibility.description')}
          </p>
        </div>

        <div className='basis-2/3 sm:ml-20 max-w-md'>
          <Controller
            name='visibility'
            control={control}
            rules={{ required: 'This field is required' }}
            render={({ field }) => (
              <div className='flex flex-col gap-4'>
                {[
                  { label: 'Public', value: 'public' },
                  { label: 'Private', value: 'private' },
                ].map((option) => (
                  <label
                    key={option.value}
                    className='flex items-center gap-3 cursor-pointer'
                  >
                    <Radio
                      name='visibility'
                      value={option.value}
                      checked={field.value === option.value}
                      onChange={() => field.onChange(option.value)}
                      crossOrigin={undefined}
                      className='text-primary'
                    />
                    <Typography className='text-blue-gray-800 font-medium'>
                      {option.label}
                    </Typography>
                  </label>
                ))}
              </div>
            )}
          />
          {errors?.visibility && (
            <span className='text-red-500 text-sm mt-1'>
              {errors.visibility.message}
            </span>
          )}
        </div>
      </div>

      {/* Conditionally render allowedEmails if private is selected */}
      {watch('visibility') === 'private' && (
        <div className='flex flex-col gap-y-3 sm:flex-row sm:space-x-16 mt-6'>
          <div className='basis-1/3'>
            <p className='text-neutrals100 text-xl font-semibold'>
              {t('privateOpportunity.title')}
              <span className='text-redAccent'>*</span>
            </p>
            <p className='text-neutrals60 font-normal text-lg'>
              {t('privateOpportunity.description')}
            </p>
          </div>
          <div className='basis-2/3 sm:ml-20 items-center'>
            <div className='sm:mb-4'>
              <TextAreaField
                name='allowedEmails'
                register={register}
                message={
                  errors.allowedEmails?.message
                    ? translateValidation(errors.allowedEmails.message)
                    : undefined
                }
                placeholder={t('privateOpportunity.inputAreaPlaceholder')}
              />
            </div>
          </div>
        </div>
      )}

      <HorizontalDivider />

      {/* Categories */}
      <div className='flex flex-col gap-y-3 sm:flex-row sm:space-x-16'>
        <div className='basis-1/3'>
          <p className='text-neutrals100 text-xl font-semibold'>
            {t('categories.title')}
            <span className='text-redAccent'>*</span>
          </p>
          <p className='text-neutrals60 font-normal text-lg'>
            {t('categories.description')}
          </p>
        </div>
        <div className='basis-2/3 sm:ml-20 items-center'>
          <div className='sm:mb-4'>
            <EnglishOnlyMultiSelectField
              options={ORG_AREA_OPTIONS}
              name={'categories'}
              control={control}
              message={
                categoriesError?.message
                  ? translateValidation(`${categoriesError?.message}`)
                  : categoriesError?.message
              }
            />
          </div>
        </div>
      </div>

      {/* Next button */}
      <FormStepperActions
        className='mt-4'
        nextDisabled={Object.keys(errors).length > 0}
      />
    </form>
  );
};

export default OpportunityDescriptionForm;
