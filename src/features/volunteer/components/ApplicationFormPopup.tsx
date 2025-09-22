// import { useFormState } from '../opportunties/application/ApplyToOpportunityFormContext';
import FileUploadComponent from './FileUploadComponent';
import { useCreateApplicationMutation } from '@/app/api/slices/volunteer-api-slice';
import {
  ApplicationFormData,
  ApplicationFormSchema,
  VolunteerProfileData,
} from '@/app/api/types';
import LoadingButton from '@/components/buttons/LoadingButton';
import { PhoneInput } from '@/components/forms/PhoneNumberInput';
import {
  InputField,
  MultiSelectField,
  SelectField,
} from '@/components/forms/ValidatedInputs';
import {
  POPULAR_SKILLS,
  PROFESSION_OPTIONS,
  LANGUAGE_OPTIONS,
} from '@/select-options';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Dialog,
  DialogFooter,
  Button,
  Avatar,
  Typography,
  DialogHeader,
} from '@material-tailwind/react';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import React, { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { BiLinkExternal } from 'react-icons/bi';
import { BsDot } from 'react-icons/bs';
import { toast } from 'react-toastify';

interface VolunteerApplicationFormProps {
  onConfirm: () => void;
  onCancel: () => void;
  opportunityID: string;
  orgLogo: string;
  opportunityTitle: string;
  orgName: string;
  orgId: string;
  opType: string;
  userProfileData?: VolunteerProfileData;
  setSuccess: (_arg: boolean) => void;
}

export function VolunteerApplicationForm({
  onCancel,
  onConfirm,
  opportunityID,
  orgLogo,
  opportunityTitle,
  orgName,
  orgId,
  opType,
  userProfileData,
  setSuccess,
}: VolunteerApplicationFormProps) {
  // IDs for testing
  const applicationForm = `application-form`;
  // const { setFormData } = useFormState();
  const translateValidation = useTranslations('validationErrors');
  const [createApplication] = useCreateApplicationMutation();
  // const formattedUserData = useFormattedUserData(userProfileData);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<ApplicationFormData>({
    defaultValues: userProfileData,
    mode: 'onTouched',
    resolver: zodResolver(ApplicationFormSchema),
  });

  
  const [open, setOpen] = React.useState(true);
  const [loading, setLoading] = useState(false);
  const [resumeFile, setResumeFile] = useState<File>();
  const [resumeUploadFieldError, setResumeUploadFieldErrorMessage] =
    useState<string>('');

  const handleFileChange = (file: File | null) => {
    if (!file) return;
    if (file) {
      const fileSizeInMB = file.size / (1024 * 1024);
      // Convert size to MB

      if (fileSizeInMB > 5) {
        setResumeUploadFieldErrorMessage('File size should not exceed 5MB.');
        return;
      }

      if (
        file.type == 'application/pdf' ||
        file.type == 'application/msword' ||
        file.type ==
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
      ) {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        setResumeFile(file);
        setResumeUploadFieldErrorMessage('');
      } else {
        setResumeUploadFieldErrorMessage('Please upload a PDF or Doc file.');
      }
    }
  };

  const onHandleSubmit = async (data: ApplicationFormData) => {
    toast.dismiss();
    setLoading(true);

  if (resumeFile) {
    data.file = resumeFile;
  } else {
    // If no new file, send the user profile resume info
    if (userProfileData?.resumeFile) {
      data.resumeFile = JSON.stringify(userProfileData.resumeFile);
    }
    data.resumeUrl = userProfileData?.resumeURL;
  }
    // setFormData((prevFormData) => ({ ...prevFormData, ...data }));

    await createApplication({ id: opportunityID, data })
      .unwrap()
      .then((responseData) => {
        onConfirm();
        toast.success(responseData.message, {
          theme: 'light',
        });
        setSuccess(true);
      })
      .catch((errorResponse: { data: { message: string }; status: number }) => {
        onConfirm();
        toast.error(errorResponse.data?.message, {
          autoClose: false,
          theme: 'light',
        });
      });

    setLoading(false);
    setOpen(!open);
  };

  const underTitleTexts: JSX.Element[] = [
    <Link key='orgName' href={`/view-organization/${orgId}`} className='flex'>
      {orgName}
      <BiLinkExternal className='text-[#26A4FF] text-xs ml-1 self-center' />
    </Link>,

    // ...orgLocation.map((loc) => <span key={`location-${loc}`}>{loc}</span>),

    <div key={'opType'}>{opType}</div>,
  ];

  return (
    <Dialog
      open={true}
      handler={onCancel}
      animate={{
        mount: { scale: 1, y: 0 },
        unmount: { scale: 0.9, y: -100 },
      }}
    >
      <form
        onSubmit={handleSubmit(onHandleSubmit)}
        data-testid={applicationForm}
      >
        <div className='flex flex-col max-h-[90vh]'>
          <DialogHeader className='flex flex-row gap-4 border-b'>
            <Avatar size='lg' variant='circular' src={orgLogo} alt='org logo' />
            <div>
              <h1 className='text-neutrals100 font-poppins font-extrabold text-2xl capitalize'>
                {opportunityTitle}
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
          </DialogHeader>
          <div className='flex-grow overflow-scroll px-6 pt-2'>
            {/* <div className=' p-8 my-8 max-h-screen mb-10 overflow-y-auto'> */}
            {/* <hr className='my-5' /> */}

            <div className='flex flex-col gap-3'>
              <h1 className='text-neutrals100  font-poppins font-extrabold text-2xl mb-2 capitalize'>
                Submit Your Application Form here
              </h1>
              <div>
                <label className='block mb-1 font-poppins font-semibold text-neutrals800'>
                  Name<span className='text-redAccent ml-1'>*</span>
                </label>
                <InputField
                  name={'name'}
                  className='rounded-lg'
                  register={register}
                  crossOrigin={undefined}
                  message={
                    errors.name?.message
                      ? translateValidation(`${errors.name?.message}`)
                      : errors.name?.message
                  }
                  required
                />
              </div>
              <div>
                <label className='block mb-1 font-poppins font-semibold text-neutrals800'>
                  Email <span className='text-redAccent ml-1'>*</span>
                </label>
                <InputField
                  name={'email'}
                  className='rounded-lg'
                  register={register}
                  crossOrigin={undefined}
                  message={
                    errors.email?.message
                      ? translateValidation(`${errors.email?.message}`)
                      : errors.email?.message
                  }
                  required
                />
              </div>

              <div>
                <label className='block mb-1 font-poppins font-semibold text-neutrals800'>
                  LinkedIn URL
                </label>
                <InputField
                  name={'linkedIn'}
                  className='rounded-lg'
                  register={register}
                  crossOrigin={undefined}
                  message={
                    errors.linkedIn?.message
                      ? translateValidation(`${errors.linkedIn?.message}`)
                      : errors.linkedIn?.message
                  }
                />
              </div>

              <div className='mb-1'>
                <label className='block mb-1 font-poppins font-semibold text-neutrals800'>
                  Phone Number<span className='text-redAccent ml-1'>*</span>
                </label>

                {/* <PhoneInput /> */}
                <Controller
                  name={'phone'}
                  control={control}
                  rules={{ required: true }}
                  render={({ field, fieldState: { error } }) => (
                    <>
                      <PhoneInput
                        {...field}
                        // If your PhoneInput expects `value` and `onChange` props, ensure they are passed
                        value={field.value}
                        onChange={field.onChange}
                        defaultCountry='ET'
                      />
                      {error && (
                        <p className='text-red-500 text-sm mt-1'>
                          {translateValidation(`${error.message}`) ||
                            error.message}
                        </p>
                      )}
                    </>
                  )}
                />
              </div>

              <div>
                <label className='block mb-1 font-poppins font-semibold text-neutrals800'>
                  Current Profession
                  <span className='text-redAccent ml-1'>*</span>
                </label>
                <SelectField
                  options={PROFESSION_OPTIONS}
                  name={'currentPosition'}
                  control={control}
                  // crossOrigin={undefined}
                  className='rounded-full'
                  message={
                    errors.currentPosition?.message
                      ? translateValidation(
                          `${errors.currentPosition?.message}`
                        )
                      : errors.currentPosition?.message
                  }
                  required
                />
              </div>

              <div className='flex flex-col gap-2'>
                <div className='flex items-center justify-between '>
                  <h1 className='block mb-1 font-poppins font-semibold text-neutrals800'>
                    Skills<span className='text-redAccent ml-1'>*</span>
                  </h1>
                </div>

                <MultiSelectField
                  options={POPULAR_SKILLS}
                  name={'skills'}
                  control={control}
                  message={
                    errors.skills?.message
                      ? translateValidation(`${errors.skills?.message}`)
                      : errors.skills?.message
                  }
                  className='rounded-lg'
                  closeMenuOnSelect={false}
                  required
                />
              </div>

              <div className='flex flex-col gap-2'>
                <div className='flex items-center justify-between '>
                  <h1 className='block mb-1 font-poppins font-semibold text-neutrals800'>
                    Language<span className='text-redAccent ml-1'>*</span>
                  </h1>
                </div>

                <MultiSelectField
                  options={LANGUAGE_OPTIONS}
                  name={'languages'}
                  control={control}
                  message={
                    errors.languages?.message
                      ? translateValidation(`${errors.languages?.message}`)
                      : errors.languages?.message
                  }
                  className='rounded-lg'
                  closeMenuOnSelect={false}
                  required
                />
              </div>

              <div className='flex flex-col gap-3'>
                <div className='mb-6'>
                  <label className='block mb-2 font-poppins font-semibold text-neutrals800'>
                    Resume/CV
                  </label>
                  <FileUploadComponent
                    resumeFromProfile={userProfileData?.resumeFile}
                    onFileChange={handleFileChange}
                  />

                  {resumeUploadFieldError && (
                    <p className='text-red-500 text-sm'>
                      {resumeUploadFieldError}
                    </p>
                  )}
                </div>
              </div>
            </div>
            <div className='flex items-start mb-4 px-4'>
              <input
                type='checkbox'
                id='privacyConsent'
                {...register('privacyConsent', { required: true })}
                className='mt-1 mr-2'
              />
              <label htmlFor='privacyConsent' className='text-sm text-gray-700'>
                I consent to the processing of my personal data for the purposes
                of this job application as stated on the{' '}
                <span>
                  {' '}
                  <a href='/privacy' className='text-light-blue-900'>
                    Privacy policy
                  </a>
                </span>
                .<span className='text-red-500 ml-1'>*</span>
              </label>
              {errors.privacyConsent && (
                <p className='text-red-500 text-xs mt-1'>
                  This field is required.
                </p>
              )}
            </div>
          </div>

          <DialogFooter className='border-t-2'>
            <Button
              type='button'
              onClick={() => {
                onCancel();
              }}
              variant='outlined'
              color='red'
              className='rounded-3xl  mr-4'
            >
              Cancel
            </Button>
            <LoadingButton
              loading={loading}
              type='submit'
              variant='filled'
              className='rounded-3xl bg-primary'
            >
              Submit
            </LoadingButton>
          </DialogFooter>
        </div>
      </form>
    </Dialog>
  );
}
