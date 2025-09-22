import { OrgFormData } from '@/app/api/types';
import FileUpload from '@/components/FileUpload';
import FormLabel from '@/components/forms/FormLabel';
import { AITextAreaField } from '@/components/forms/ValidatedInputs';
import { useTranslations } from 'next-intl';
import { FieldErrors, UseFormRegister } from 'react-hook-form';

interface AboutOrgSectionProps {
  register: UseFormRegister<OrgFormData>;
  errors: FieldErrors<OrgFormData>;
  // eslint-disable-next-line unused-imports/no-unused-vars
  setFormData: (data: any) => void;
  formData: OrgFormData;
  showFileUpload: boolean;
  getValues: any;
  setValue: any;
}

export function AboutOrgSection({
  register,
  getValues,
  setValue,
  errors,
  setFormData,
  formData,
  showFileUpload,
}: AboutOrgSectionProps) {
  const t = useTranslations('OrganizationSignupPage.aboutOrganizationSection');
  const translateValidation = useTranslations('validationErrors');
  return (
    <>
      <div className='font-poppins form-section flex-col sm:flex sm:flex-row sm:space-x-16'>
        <div className='basis-1/3'>
          <p className='text-primary text-xl font-semibold'>
            {t('aboutOrganization.title')}
          </p>
          <p className='text-tertiary font-normal hidden sm:block'>
            {t('aboutOrganization.description')}
          </p>
        </div>
        <div className='basis-2/3 sm:ml-20'>
          <div className='mb-4'>
            <FormLabel label={t('inputAreaLabels.description')} required />
            <p className='text-tertiary font-normal sm:hidden'>
              {t('aboutOrganization.description')}
            </p>
            <AITextAreaField
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
            />
          </div>
        </div>
        {/* Todo: Add background input field  */}
      </div>

      {/* Mission */}

      <div className='font-poppins form-section flex-col sm:flex sm:flex-row sm:space-x-16'>
        <div className='basis-1/3 hidden sm:block'>
          <p className='text-primary text-xl font-semibold'>
            {t('mission.title')}
          </p>
          <p className='text-tertiary font-normal'>
            {t('mission.description')}
          </p>
        </div>
        <div className='basis-2/3 sm:ml-20'>
          <div className='mb-4'>
            <FormLabel label={t('inputAreaLabels.mission')} required />
            <p className='text-tertiary font-normal sm:hidden'>
              {t('mission.description')}
            </p>
            <AITextAreaField
              maxLength={650}
              name={'mission'}
              register={register}
              setValue={setValue}
              getValues={getValues}
              message={
                errors.mission?.message
                  ? translateValidation(`${errors.mission?.message}`)
                  : errors.mission?.message
              }
            />
          </div>
        </div>
      </div>

      {/* Vision */}

      <div className='font-poppins form-section flex-col sm:flex sm:flex-row sm:space-x-16'>
        <div className='basis-1/3 hidden sm:block'>
          <p className='text-primary text-xl font-semibold'>
            {t('vision.title')}
          </p>
          <p className='text-tertiary font-normal'>{t('vision.description')}</p>
        </div>
        <div className='basis-2/3 sm:ml-20'>
          <div className='mb-4'>
            <FormLabel label={t('inputAreaLabels.vision')} required />
            <p className='text-tertiary font-normal sm:hidden'>
              {t('vision.description')}
            </p>
            <AITextAreaField
              maxLength={650}
              name={'vission'}
              register={register}
              setValue={setValue}
              getValues={getValues}
              message={
                errors.vission?.message
                  ? translateValidation(`${errors.vission?.message}`)
                  : errors.vission?.message
              }
            />
          </div>
        </div>
      </div>

      {/* Future Plan */}

      <div className='font-poppins form-section flex-col sm:flex sm:flex-row sm:space-x-16'>
        <div className='basis-1/3 hidden sm:block'>
          <p className='text-primary text-xl font-semibold'>
            {t('futurePlan.title')}
          </p>
          <p className='text-tertiary font-normal'>
            {t('futurePlan.description')}
          </p>
        </div>
        <div className='basis-2/3 sm:ml-20'>
          <div className='mb-4'>
            <FormLabel label={t('inputAreaLabels.futurePlan')} required />
            <p className='text-tertiary font-normal sm:hidden'>
              {t('futurePlan.description')}
            </p>
            <AITextAreaField
              maxLength={650}
              name={'futurePlan'}
              register={register}
              setValue={setValue}
              getValues={getValues}
              message={
                errors.futurePlan?.message
                  ? translateValidation(`${errors.futurePlan?.message}`)
                  : errors.futurePlan?.message
              }
            />
          </div>
        </div>
      </div>

      {/* file input */}
      {showFileUpload && (
        <div className='font-poppins flex flex-col gap-y-2 sm:flex-row '>
          <div className='sm:basis-1/3'>
            <p className='text-primary text-xl font-semibold'>
              {t('certificate.title')}
            </p>
            <p className='text-tertiary font-normal'>
              {t('certificate.description')}
            </p>
          </div>
          <div className='flex items-center justify-center basis-2/3 sm:ml-20'>
            <FileUpload
              onFilesChange={(files) =>
                setFormData((prev: OrgFormData) => ({ ...prev, files }))
              }
              initialFiles={formData.files}
            />
          </div>
        </div>
      )}
    </>
  );
}
