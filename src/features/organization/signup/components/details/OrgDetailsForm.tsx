import { useFormState } from '../OrgSignupFormContext';
import { OrganizationContactInfoFormSection } from './OrgContactInfoFormSection';
import { OrgDetailsFormSection } from './OrgDetailsFormSection';
import { OrgFormData, OrgDetailFormSchema } from '@/app/api/types';
import HorizontalDivider from '@/components/HorizontalDivider';
import Dropzone from '@/components/ImageFileUpload';
import FormStepperActions from '@/components/steppers/FormStepperActions';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import React, { useState, useCallback, useEffect } from 'react';
import { FileRejection } from 'react-dropzone';
import { useForm } from 'react-hook-form';

const OrgDetailsForm: React.FC = () => {
  const [acceptedFiles, setAcceptedFiles] = useState<File[]>([]);
  const [preview, setPreview] = useState<string | ArrayBuffer | null>(null);
  const { onHandleNext, setFormData, formData } = useFormState();
  const t = useTranslations('OrganizationSignupPage');

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
    watch,
    clearErrors,
    setValue,
  } = useForm<OrgFormData>({
    mode: 'all',
    resolver: zodResolver(OrgDetailFormSchema),
    defaultValues: formData,
  });

  // Watch the organization type field to determine the selected type
  const selectedOrgType = watch('orgType');

  useEffect(() => {
    const reader = new FileReader();

    if (formData.file) {
      reader.onload = function () {
        setPreview(reader.result);
      };
      reader.readAsDataURL(formData.file);
    }
  }, [formData]);

  const onDrop = useCallback((accepted: File[], _: FileRejection[]) => {
    if (accepted.length > 0) {
      const file = accepted[0];
      const reader = new FileReader();

      reader.onload = function () {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
      setAcceptedFiles(accepted);
    }
  }, []);

  function onHandleSubmit(data: OrgFormData) {
    setFormData((prevFormData) => ({
      ...prevFormData,
      ...data,
      file: acceptedFiles[0] || prevFormData.file || null,
      geoLocation: formData.geoLocation || prevFormData.geoLocation,
    }));

    window.scrollTo({
      top: 0,
      behavior: 'auto',
    });

    onHandleNext();
  }

  return (
    <div className='font-poppins pb-16'>
      <div>
        <p className='text-primary text-xl font-semibold'>
          {t('organizationDetailsSection.basicInformation.title')}
        </p>
        <p className='text-tertiary font-normal text-base'>
          {t('organizationDetailsSection.basicInformation.description')}
        </p>
      </div>
      <HorizontalDivider />

      <form onSubmit={handleSubmit(onHandleSubmit)}>
        {/* Logo input */}
        <div className='flex flex-col gap-y-2 sm:flex-row '>
          <div className='sm:basis-1/3'>
            <div className='flex gap-1 items-center'>
              <p className='text-primary text-xl font-semibold'>
                {t('organizationDetailsSection.organizationLogo.title')}
              </p>
              <span className='text-redAccent text-lg font-semibold'>*</span>
            </div>

            <p className='text-tertiary font-normal text-base'>
              {t('organizationDetailsSection.organizationLogo.description')}
            </p>
          </div>
          <div className='basis-2/3 sm:ml-20'>
            <Dropzone
              onDrop={onDrop}
              preview={preview}
              setPreview={setPreview}
              errors={errors}
            />
          </div>
        </div>

        <HorizontalDivider />
        {/* Details input */}
        <OrgDetailsFormSection
          register={register}
          errors={errors}
          clearErrors={clearErrors}
          control={control}
          selectedOrgType={selectedOrgType} // Passing the selected organization type as a prop
          setValue={setValue}
        />

        <HorizontalDivider />

        {/* Contact input */}
        <OrganizationContactInfoFormSection
          register={register}
          errors={errors}
          setFormData={setFormData}
          geoLocation={formData.geoLocation}
        />

        <HorizontalDivider />

        {/* Next button */}
        <FormStepperActions nextDisabled={Object.keys(errors).length > 0} />
      </form>
    </div>
  );
};

export default OrgDetailsForm;
