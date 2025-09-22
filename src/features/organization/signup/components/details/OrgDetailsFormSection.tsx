import { OrgFormData } from '@/app/api/types';
import FormLabel from '@/components/forms/FormLabel';
import {
  InputField,
  MultiSelectField,
  SelectField,
} from '@/components/forms/ValidatedInputs';
import {
  NGO_TYPE_OPTIONS,
  ORG_AREA_OPTIONS,
  ORGANIZATION_TYPE_OPTIONS,
  YEAR_OPTIONS,
} from '@/select-options';
import { Button } from '@material-tailwind/react';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';
import {
  Control,
  FieldErrors,
  useFieldArray,
  UseFormClearErrors,
  UseFormRegister,
} from 'react-hook-form';
import { BiPlus, BiTrash } from 'react-icons/bi';

interface OrganizationDetailsFormSectionProps {
  register: UseFormRegister<OrgFormData>;
  errors: FieldErrors<OrgFormData>;
  control: Control<OrgFormData, any>;
  selectedOrgType: string;
  clearErrors: UseFormClearErrors<OrgFormData>;
  setValue: any;
}

export function OrgDetailsFormSection({
  register,
  errors,
  control,
  selectedOrgType,
  clearErrors,
  setValue,
}: OrganizationDetailsFormSectionProps) {
  const t = useTranslations(
    'OrganizationSignupPage.organizationDetailsSection'
  );
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'bankInfo',
  });

  const translateValidation = useTranslations('validationErrors');
  const [isNonProfit, setIsNonProfit] = useState(false);
  useEffect(() => {
    setIsNonProfit(selectedOrgType === 'Non-Profit');
  }, [selectedOrgType]);

  const orgAreaError = errors.orgArea
    ? errors.orgArea[0]
    : { message: undefined };

  const handleOrgTypeChange = (selectedOption: any) => {
    setIsNonProfit(selectedOption === 'Non-Profit');
  };

  useEffect(() => {
    if (!isNonProfit) {
      clearErrors('donateWebsite'); // Clear the error for donateWebsite
      setValue('bankInfo.bankName', []); // Clear the value for donateWebsite
      setValue('bankInfo.bankAccount', []); // Clear the value for donateWebsite
      setValue('donateWebsite', ''); // Clear the value for donateWebsite
    }
  }, [isNonProfit, clearErrors, setValue]);

  return (
    <div className='flex flex-col gap-y-3 sm:flex-row'>
      {/* left side */}
      <div className='sm:basis-1/3'>
        <p className='text-primary text-xl font-semibold'>
          {t('organizationDetails.title')}
        </p>
        <p className='text-tertiary font-normal text-base'>
          {t('organizationDetails.description')}
        </p>
      </div>
      {/* Right side */}
      <div className='sm:basis-2/3 flex flex-col sm:ml-20 space-y-2'>
        {/* Current Name input */}
        <div className='flex flex-col gap-y-2 sm:flex-row sm:space-x-6'>
          <div className='basis-2/3'>
            <FormLabel
              label={t('organizationDetails.inputAreaLabels.organizationName')}
              required
            />
            <InputField
              name={'orgName'}
              className='rounded-full'
              register={register}
              crossOrigin={undefined}
              message={
                errors.orgName?.message
                  ? translateValidation(`${errors.orgName?.message}`)
                  : errors.orgName?.message
              }
              required
            />
          </div>
          {/* Shorthand Name input */}
          <div className='basis-1/3'>
            <FormLabel
              label={t('organizationDetails.inputAreaLabels.shorthandName')}
            />
            <InputField
              name={'shortHandName'}
              className='rounded-full'
              register={register}
              crossOrigin={undefined}
              message={
                errors.shortHandName?.message
                  ? translateValidation(`${errors.shortHandName?.message}`)
                  : errors.shortHandName?.message
              }
            />
          </div>
        </div>
        <div className='flex flex-col gap-y-2 sm:flex-row sm:space-x-6'>
          {/* Organization Type */}
          <div className='basis-2/3'>
            <FormLabel
              label={t('organizationDetails.inputAreaLabels.organizationType')}
              required
            />
            <SelectField
              options={ORGANIZATION_TYPE_OPTIONS}
              name={'orgType'}
              control={control}
              className='rounded-full'
              message={
                errors.orgType?.message
                  ? translateValidation(`${errors.orgType?.message}`)
                  : errors.orgType?.message
              }
              required
              onChange={(e: any) => {
                handleOrgTypeChange(e.target.value); // Update isNonProfit state based on the selected value
              }}
            />
          </div>

          {/* Old Name input */}
          <div className='basis-1/3'>
            <FormLabel
              label={t('organizationDetails.inputAreaLabels.oldName')}
            />
            <InputField
              name={'oldName'}
              className='rounded-full'
              register={register}
              crossOrigin={undefined}
              message={
                errors.oldName?.message
                  ? translateValidation(`${errors.oldName?.message}`)
                  : errors.oldName?.message
              }
            />
          </div>
        </div>
        {/* Location input */}
        <div className=''>
          <FormLabel
            label={t('organizationDetails.inputAreaLabels.location')}
            required
          />
          <InputField
            name={'location'}
            className='rounded-full'
            register={register}
            crossOrigin={undefined}
            message={
              errors.location?.message
                ? translateValidation(`${errors.location?.message}`)
                : errors.location?.message
            }
            required
          />
        </div>

        <div className='flex flex-col gap-y-3 sm:flex-row sm:space-x-6'>
          {/* Operational Reach input */}
          <div className='sm:basis-2/3'>
            <FormLabel
              label={t('organizationDetails.inputAreaLabels.operationalReach')}
              required
            />
            <SelectField
              options={NGO_TYPE_OPTIONS}
              name={'ngoType'}
              control={control}
              className='rounded-full'
              message={
                errors.orgArea?.message
                  ? translateValidation(`${errors.orgArea?.message}`)
                  : errors.orgArea?.message
              }
              required
            />
          </div>

          {/* Year founded */}
          <div className='basis-1/3'>
            <FormLabel
              label={t('organizationDetails.inputAreaLabels.yearFounded')}
              required
            />
            <SelectField
              options={YEAR_OPTIONS}
              name={'year'}
              control={control}
              className='rounded-full'
              message={
                errors.year?.message
                  ? translateValidation(`${errors.year?.message}`)
                  : errors.year?.message
              }
              required
            />
          </div>
        </div>

        {/* Area of Cause input */}
        <div className=''>
          <FormLabel
            label={t('organizationDetails.inputAreaLabels.areaOfCause')}
            required
          />
          <MultiSelectField
            options={ORG_AREA_OPTIONS}
            name={'orgArea'}
            control={control}
            message={orgAreaError?.message}
            required
          />
        </div>
        {/* Conditional Donation Form*/}
        {isNonProfit && (
          <div className='flex flex-col gap-y-3'>
            <div className='flex flex-col gap-y-2'>
              <div className='mt-4 py-2'>
                <FormLabel
                  label={t('organizationDetails.inputAreaLabels.donation')}
                />
              </div>

              {/* UseFieldArray for dynamic fields */}
              <div className='flex flex-col gap-y-4'>
                {fields.map((field, index) => (
                  <div
                    key={field.id}
                    className='flex flex-row gap-x-4 items-center'
                  >
                    {/* Choose Bank */}
                    <div className='basis-1/3'>
                      <FormLabel
                        label={t(
                          'organizationDetails.inputAreaLabels.chooseBank'
                        )}
                      />
                      <SelectField
                        options={[
                          {
                            value: 'Commercial Bank',
                            label: 'Commercial Bank of Ethiopia',
                          },
                          { value: 'Awash Bank', label: 'Awash Bank' },
                          { value: 'Dashen Bank', label: 'Dashen Bank' },
                          { value: 'Abyssinia Bank', label: 'Abyssinia Bank' },
                          { value: 'TeleBirr', label: 'TeleBirr' },
                        ]}
                        name={`bankInfo.${index}.bankName`}
                        control={control}
                        className='rounded-full text-xs md:text-sm lg:text-base'
                      />
                    </div>

                    {/* Bank Account */}
                    <div className='basis-2/3'>
                      <FormLabel
                        label={t(
                          'organizationDetails.inputAreaLabels.bankInfo'
                        )}
                      />
                      <InputField
                        name={`bankInfo.${index}.bankAccount`}
                        className='rounded-full'
                        register={register}
                        crossOrigin={undefined}
                      />
                    </div>

                    {/* Remove Button */}
                    <div>
                      <Button
                        variant='text'
                        className='text-red-500 flex items-center capitalize text-lg rounded-xl px-4 py-2'
                        onClick={() => remove(index)}
                      >
                        <BiTrash className='mr-2' />
                        {t('organizationDetails.inputAreaLabels.remove')}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Add More Banks Button */}
              <div className='mt-4'>
                <Button
                  variant='text'
                  className='text-lighterPrimary flex items-center capitalize text-lg rounded-xl px-4 py-2'
                  onClick={
                    () => append({ bankName: '', bankAccount: '' }) // Add empty fields
                  }
                >
                  <BiPlus className='text-lighterPrimary mr-2' />
                  {t('organizationDetails.inputAreaLabels.addMoreBank')}
                </Button>
              </div>

              {/* Donation Website */}
              <div className='basis-1/3'>
                <FormLabel
                  label={t('organizationDetails.inputAreaLabels.donateWebsite')}
                />
                <InputField
                  name={'donateWebsite'}
                  className='rounded-full'
                  register={register}
                  crossOrigin={undefined}
                  message={isNonProfit && errors.donateWebsite?.message}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
