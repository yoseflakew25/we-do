'use client';

import HorizontalDivider from '../HorizontalDivider';
import {
  DateSelectorField,
  InputField,
  TextAreaField,
} from '../forms/ValidatedInputs';
import { CertificateData, CertificateDataSchema } from '@/app/api/types';
import Certificate from '@/components/certificate/Certificate';
import { zodResolver } from '@hookform/resolvers/zod';
import { Spinner } from '@material-tailwind/react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

interface EditCertificateProps {
  opportunityTitle: string;
  description: string;
  orgRepresentativeTitle: string;
  title: string;
  subtitle: string;
  orgLogo?: string;
  orgRepresentativeName?: string;
  setFlag?: React.Dispatch<React.SetStateAction<boolean>>;
  volunteerName?: string;
  onSave?: any;
  date?: Date;
  refetch?: () => void;
  setCertificateDetail?: React.Dispatch<React.SetStateAction<CertificateData>>;
}

const EditCertificate = ({
  opportunityTitle,
  description,
  orgRepresentativeTitle,
  title,
  subtitle,
  orgLogo,
  orgRepresentativeName,
  setFlag,
  volunteerName,
  onSave,
  refetch,
  setCertificateDetail,
}: EditCertificateProps) => {
  const [loading, setLoading] = useState(false);
  const [_errorMessage, setErrorMessage] = useState<string | null>(null);
  const [logo, setLogo] = useState<string | File | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    watch,
  } = useForm<CertificateData>({
    defaultValues: {
      volunteerName: volunteerName,
      opportunityTitle: opportunityTitle,
      title: title,
      subtitle: subtitle,
      description: description,
      orgLogoURl: orgLogo,
      orgRepresentativeName: orgRepresentativeName,
      orgRepresentativeTitle: orgRepresentativeTitle,
      date: new Date(),
    },
    mode: 'onTouched',
    resolver: zodResolver(CertificateDataSchema),
  });

  function handleImagechange(
    e: React.ChangeEvent<HTMLInputElement>,
    type: string
  ) {
    const file = e.target.files?.[0];
    if (file) {
      const fileType = file.type.split('/')[0];
      const fileSize = file.size / 1024 / 1024; // Convert size to MB

      if (fileType !== 'image') {
        setErrorMessage('Only image files are allowed');
        return;
      }

      if (fileSize > 5) {
        setErrorMessage('File size should not exceed 5MB');

        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setCertificateDetail &&
          setCertificateDetail({
            ...watch(),
            orgLogoURl: reader.result as string,
          });
      };
      reader.readAsDataURL(file);
      type === 'logo' ? setLogo(file) : null;
    }
  }

  async function onHandleSubmit(data: CertificateData) {
    setLoading(true);
    const formData = new FormData();

    for (const [key, value] of Object.entries(data)) {
      // Handle date separately to format it
      if (key === 'orgLogo') {
        continue;
      }

      formData.append(key, value as string);
    }

    if (logo) {
      formData.append('file', logo);
    }
    setCertificateDetail &&
      setCertificateDetail({ ...currentValues, orgLogoURl: orgLogo || '' });
    onSave && (await onSave(formData));
    setLoading(false);
    refetch && refetch();
    setFlag && setFlag(false);
  }

  const currentValues = watch();

  return (
    <div className='flex flex-col gap-5 justify-between'>
      <form
        onSubmit={handleSubmit(onHandleSubmit)}
        className='flex flex-col space-y-4 md:w-2/3 mx-auto'
      >
        <h1 className='text-2xl font-bold'>Certificate Details</h1>
        <div className='flex flex-col xl:flex-row gap-4'>
          <div className='w-full'>
            <InputField
              register={register}
              name='title'
              className='p-2 border rounded'
              message={errors.title?.message}
              required
              crossOrigin={undefined}
              label='Certificate Title'
            />
          </div>
          <div className='w-full'>
            <InputField
              register={register}
              name='subtitle'
              className='p-2 border rounded'
              message={errors.subtitle?.message}
              crossOrigin={undefined}
              label='Certificate Subtitle'
            />
          </div>
        </div>
        <HorizontalDivider />
        <div className='flex flex-col xl:flex-row gap-4'>
          <div className='w-full'>
            <InputField
              register={register}
              name='volunteerName'
              className='p-2 border rounded'
              message={errors.volunteerName?.message}
              crossOrigin={undefined}
              label='Volunteer Name'
            />
          </div>
          <div className='w-full'>
            <InputField
              register={register}
              name='opportunityTitle'
              className='p-2 border rounded'
              message={errors.opportunityTitle?.message}
              required
              crossOrigin={undefined}
              label='Opportunity Title'
            />
          </div>
        </div>
        <TextAreaField
          register={register}
          name='description'
          className='p-2 border rounded'
          message={errors.description?.message}
          required
          label='Description'
        />
        <HorizontalDivider />
        <div className='flex flex-col xl:flex-row gap-4'>
          <div className='w-full'>
            <InputField
              register={register}
              name='orgRepresentativeName'
              className='p-2 border rounded'
              message={errors.orgRepresentativeName?.message}
              required
              crossOrigin={undefined}
              label='Organization Representative'
            />
          </div>
          <div className='w-full'>
            <InputField
              register={register}
              name='orgRepresentativeTitle'
              className='p-2 border rounded'
              message={errors.orgRepresentativeTitle?.message}
              required
              crossOrigin={undefined}
              label='Organization Rep Title'
            />
          </div>
        </div>
        <div className='w-full'>
          {/* <label
            className='text-sm mr-2 text-neutrals80'
            htmlFor='repSignature'
          >
            Signature:
          </label>
          <input
            type='file'
            id='repSignature'
            accept='image/*'
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              handleImagechange(e, 'signature')
            }
          /> */}
        </div>
        <div className='flex flex-col xl:flex-row gap-4'>
          <div className='w-full'>
            <label className='text-sm  mr-2 text-neutrals80' htmlFor='orgLogo'>
              Org Logo:
            </label>
            <input
              type='file'
              id='orgLogo'
              accept='image/*'
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                handleImagechange(e, 'logo')
              }
            />
          </div>
          <div className='w-full cursor-pointer'>
            <DateSelectorField
              name='date'
              className='p-2 border rounded'
              message={errors.date?.message}
              required
              control={control}
              crossOrigin={undefined}
              label='Date'
            />
          </div>
        </div>
        <button
          type='submit'
          className='bg-primary text-white p-2 rounded flex justify-center'
        >
          {!loading ? 'Save' : <Spinner />}
        </button>
      </form>
      <Certificate
        title={currentValues.title}
        subtitle={currentValues.subtitle}
        description={currentValues.description}
        volunteerName={currentValues.volunteerName}
        opportunityTitle={currentValues.opportunityTitle}
        orgLogo={orgLogo}
        orgRepresentativeName={currentValues.orgRepresentativeName}
        orgRepresentativeTitle={currentValues.orgRepresentativeTitle}
        // orgRepSignature={signatureImage || ''}
        date={currentValues.date}
      />
    </div>
  );
};

export default EditCertificate;
