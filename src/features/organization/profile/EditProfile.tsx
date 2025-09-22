import Header from '../components/Header';
import { useUpdateOrgProfileMutation } from '@/app/api/slices/org-api-slice';
import { useDeleteOrgCredentialByIDMutation } from '@/app/api/slices/org-api-slice';
import { CombinedOrgFormSchema, OrgFormData } from '@/app/api/types';
import FileUpload from '@/components/FileUpload';
import HorizontalDivider from '@/components/HorizontalDivider';
import Dropzone from '@/components/ImageFileUpload';
import LoadingButton from '@/components/buttons/LoadingButton';
import AllFormErrorsAlert from '@/components/forms/AllFormErrorsAlert';
import SuccessPopup from '@/components/popups/SuccessPopup';
import { useFormState } from '@/features/organization/signup/components/OrgSignupFormContext';
import { AboutOrgSection } from '@/features/organization/signup/components/about/AboutOrgSection';
import { OrgSocialsSection } from '@/features/organization/signup/components/about/OrgSocialsSection';
import { OrganizationContactInfoFormSection } from '@/features/organization/signup/components/details/OrgContactInfoFormSection';
import { OrgDetailsFormSection } from '@/features/organization/signup/components/details/OrgDetailsFormSection';
import { useOrgLogo } from '@/hook';
import { faArrowLeft, faSave } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { zodResolver } from '@hookform/resolvers/zod';
import { IconButton } from '@material-tailwind/react';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import React, { useState, useCallback } from 'react';
import { FileRejection } from 'react-dropzone';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';

interface EditProfileProps {
  orgProfile: OrgFormData;
  onUpdateComplete: () => void;
}

const EditProfile: React.FC<EditProfileProps> = ({
  orgProfile,
  onUpdateComplete,
}) => {
  const [acceptedFiles, setAcceptedFiles] = useState<File[]>([]);
  const [deleteOrgCredentialById] = useDeleteOrgCredentialByIDMutation();
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [preview, setPreview] = useState<string | ArrayBuffer | null>(null);
  const { setFormData, formData } = useFormState();
  const router = useRouter();
  const getOrgLogo = useOrgLogo();
  const t = useTranslations('editOrganizationProfilePage');
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [loading, setLoading] = useState(false);
  const [updateOrgProfile] = useUpdateOrgProfileMutation();
  const [credentialIdToBeDeleted, setCredentialIdToBeDeleted] = useState<
    string[]
  >([]);
  const [googleGeoLocation, setGoogleGeoLocation] = useState(
    orgProfile.geoLocation
  );

  const {
    register,
    setValue,
    getValues,
    handleSubmit,
    clearErrors,
    control,
    formState: { errors },
    watch,
  } = useForm<OrgFormData>({
    defaultValues: orgProfile,
    mode: 'all',
    resolver: zodResolver(CombinedOrgFormSchema),
  });

  const selectedOrgType = watch('orgType');

  const handleLocationChange = (newLocation: { lat: number; lng: number }) => {
    setGoogleGeoLocation({
      latitude: newLocation.lat,
      longitude: newLocation.lng,
    });
  };

  const handleDeleteFile = (id: string) => {
    setCredentialIdToBeDeleted((prev) => [...prev, id]);
  };
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

  const onHandleFormSubmit = async (data: OrgFormData) => {
    setLoading(true);
    toast.dismiss();
    if (data.id) {
      // Delete the credential here
      for (const id of credentialIdToBeDeleted) {
        await deleteOrgCredentialById(id);
      }
    }
    data.file = acceptedFiles[0];
    data.files = uploadedFiles;
    data.geoLocation = googleGeoLocation;

    setFormData((prev: any) => ({ ...prev, ...data }));

    let bankInfoTransformed: { [key: string]: string } = {};
    for (const bank of data.bankInfo) {
      bankInfoTransformed[bank.bankName] = bank.bankAccount;
    }

    const formData = new FormData();
    if (data.files) {
      data.files.forEach((file, index) => {
        formData.append(`file${index + 1}`, file);
      });
    }
    //convert the object to formData
    for (const [key, value] of Object.entries(data)) {
      if (key === 'geoLocation') {
        if (typeof value === 'object' && value !== null) {
        } else {
          console.error('geoLocation is not an object', value);
        }
        formData.append(key, JSON.stringify(value));
      } else if (key === 'bankInfo') {
        formData.append('bankInfo', JSON.stringify(bankInfoTransformed));
      } else if (Array.isArray(value)) {
        value.forEach((item) => {
          formData.append(key, item);
        });
      } else {
        formData.append(key, value);
      }
    }
    if (data.id) {
      await updateOrgProfile({
        id: data.id,
        data: formData,
      })
        .unwrap()
        .then(() => {
          setShowSuccessPopup(true);
          toast.success('Profile updated successfully!', {
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

  return (
    <>
      <Header
        logoUrl={getOrgLogo(orgProfile.LogoUrl)}
        title={orgProfile.orgName}
      />

      <section className='container px-8 py-8'>
        <form
          className='flex flex-col pb-16'
          onSubmit={handleSubmit(onHandleFormSubmit)}
        >
          <div className='flex justify-between space-x-3'>
            <p className='font-poppins font-black text-3xl text-neutrals100'>
              {/*back arrow */}
              <IconButton
                className='rounded-full mr-2'
                variant='text'
                size='lg'
                onClick={() => router.back()}
              >
                <FontAwesomeIcon size='xl' icon={faArrowLeft} />
              </IconButton>
              {t('title')}
            </p>
          </div>

          <div className='pt-10'>
            <div className=''>
              <p className='text-neutrals100 text-xl font-semibold'>
                {t('basicInformation.title')}
              </p>
              <p className='text-neutrals60 font-normal text-lg'>
                {t('basicInformation.description')}
              </p>
            </div>
            <HorizontalDivider />

            {/* Logo input */}
            <div className='form-section flex flex-row'>
              <div className='basis-1/3'>
                <p className='text-neutrals100 text-xl font-semibold'>
                  {t('organizationLogo.title')}
                </p>
                <p className='text-neutrals60 font-normal text-lg'>
                  {t('organizationLogo.description')}
                </p>
              </div>
              <div className='basis-2/3 ml-20'>
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
              control={control}
              selectedOrgType={selectedOrgType}
              setValue={setValue}
              clearErrors={clearErrors}
            />
            <HorizontalDivider />

            {/* Contact input */}
            <OrganizationContactInfoFormSection
              register={register}
              errors={errors}
              setFormData={setFormData}
              geoLocation={orgProfile.geoLocation}
              onLocationChange={handleLocationChange}
            />
            <HorizontalDivider />

            <AboutOrgSection
              register={register}
              setValue={setValue}
              getValues={getValues}
              setFormData={setFormData}
              errors={errors}
              formData={formData}
              showFileUpload={false}
            />
            <HorizontalDivider />
            {/* file input */}
            <div className='flex flex-col gap-y-2 sm:flex-row '>
              <div className='sm:basis-1/3'>
                <p className='text-neutrals100 text-xl font-semibold'>
                  {t('certificate.title')}
                </p>
                <p className='text-neutrals60 font-normal text-lg'>
                  {t('certificate.description')}
                </p>
              </div>
              <div className='flex items-center justify-center basis-2/3 sm:ml-20'>
                <FileUpload
                  onFilesChange={(files) => {
                    setUploadedFiles(files);
                  }}
                  initialFiles={uploadedFiles}
                  onDeleteFile={handleDeleteFile}
                  initialUrls={(orgProfile.credentials
                    ? Object.entries(orgProfile.credentials)
                    : []
                  ).map(([id, credential]) => ({
                    id,
                    name: credential.fileName,
                    url: credential.fileURL,
                  }))}
                />
              </div>
            </div>
            <OrgSocialsSection register={register} errors={errors} />
            <HorizontalDivider />

            <AllFormErrorsAlert<OrgFormData> errors={errors} className='mb-5' />

            <div className='flex justify-end mt-3'>
              <LoadingButton
                size='lg'
                type='submit'
                color='amber'
                className='bg-primary flex rounded-full'
                loading={loading}
                disabled={Object.keys(errors).length > 0}
              >
                <FontAwesomeIcon
                  size='lg'
                  className='mr-2 my-auto'
                  icon={faSave}
                />
                {t('buttonText')}
              </LoadingButton>
            </div>
          </div>
        </form>

        {/* Success popup */}
        {showSuccessPopup && (
          <SuccessPopup
            title={t('successPopup.title')}
            subTitle={t('successPopup.subTitle')}
            buttonText={t('successPopup.buttonText')}
            onButtonClick={() => {
              onUpdateComplete();
            }}
            icon={
              <svg
                xmlns='http://www.w3.org/2000/svg'
                width='50'
                height='50'
                viewBox='0 0 50 50'
                fill='none'
              >
                <path
                  d='M48.2422 5.99229L40.1777 13.603L47.892 26.5874L48.2422 26.1521V5.99229ZM1.75781 6.10332V28.1632C2.19531 28.22 2.721 28.2514 3.25146 28.2569C4.41064 28.2691 5.36611 28.1935 5.90283 28.1452L11.0449 15.134L1.75781 6.10332ZM39.7611 16.3436L39.0736 16.7885C39.059 16.7979 38.55 17.1143 38.4005 17.2074L37.3648 17.8344L37.3795 17.8432C36.8996 18.1417 36.7662 18.2257 36.2216 18.5639C35.9452 18.7354 35.9384 18.7395 35.6763 18.9022C33.6948 17.8371 31.5448 17.0185 29.0358 16.3747C25.8804 17.328 22.5376 18.7075 19.1997 20.0019C20.5854 21.6705 22.1255 22.2139 23.6768 22.2333C25.4756 22.2558 27.3145 21.4735 28.5809 20.5972L29.3035 20.0972L30.0287 21.145L41.3034 29.2827L45.7089 26.3543L39.7611 16.3436ZM12.3513 16.6111L7.9209 27.8208L9.54688 29.0711L12.5542 25.6624L12.7951 25.3895L13.1584 25.3668C13.3049 25.3576 13.4494 25.3533 13.592 25.3541C14.5893 25.3605 15.4809 25.6193 16.1496 26.2096C16.6449 26.6463 16.9742 27.2277 17.1652 27.901L17.3879 27.8871C18.5593 27.8139 19.6146 28.0556 20.3791 28.7299C21.1435 29.4044 21.5148 30.4216 21.5881 31.5932L21.5949 31.6986C22.2238 31.8174 22.7868 32.065 23.2446 32.4689C24.0091 33.1434 24.3804 34.1604 24.4536 35.3319L24.4729 35.6366C24.5353 35.6564 24.5971 35.6778 24.6584 35.7009L24.8569 35.4223L25.3911 34.6725L25.6658 34.2867L26.3816 34.7968L32.1852 38.9312C32.8164 38.7755 33.1927 38.5332 33.402 38.2392C33.6116 37.945 33.7177 37.5097 33.6582 36.8615L26.6994 31.8781L25.9848 31.3664L26.4916 30.6588L27.143 29.7442L27.8588 30.2543L35.704 35.8428C36.3353 35.6872 36.7118 35.4449 36.9211 35.1509C37.1305 34.8569 37.2365 34.4227 37.1774 33.7757L28.1542 27.3743L27.4374 26.8655L28.4544 25.4319L29.1715 25.9405L38.1963 32.3434C38.8281 32.1877 39.2048 31.9454 39.4144 31.6512C39.6241 31.3567 39.7301 30.9211 39.6702 30.2718L28.8851 22.4876C27.4539 23.336 25.6231 24.0157 23.6549 23.9911C21.3515 23.9623 18.8876 22.8616 17.0751 20.08C17.0034 19.97 16.9573 19.8453 16.9401 19.7151C16.9229 19.585 16.9351 19.4526 16.9758 19.3278C17.0165 19.2029 17.0846 19.0888 17.1752 18.9938C17.2658 18.8987 17.3765 18.8252 17.4992 18.7785C18.7701 18.2956 20.0542 17.7854 21.3413 17.2791L12.3515 16.6117L12.3513 16.6111ZM13.6112 27.1209L8.96631 32.3855C9.05684 33.0443 9.26318 33.4541 9.54121 33.6994C9.81924 33.9447 10.2517 34.0983 10.9166 34.1061L15.5614 28.8416C15.4709 28.1827 15.2646 27.7728 14.9865 27.5274C14.7085 27.2821 14.2762 27.1286 13.6111 27.121L13.6112 27.1209ZM17.8405 29.6414L12.5951 35.5867C12.6855 36.2456 12.892 36.6556 13.1699 36.9009C13.4482 37.146 13.8804 37.2996 14.5454 37.3071L19.7908 31.362C19.7004 30.703 19.4939 30.2933 19.2159 30.0479C18.938 29.8025 18.5057 29.6489 17.8406 29.6412L17.8405 29.6414ZM20.7058 33.3803L16.0612 38.6449C16.1518 39.3037 16.3581 39.7136 16.6361 39.959C16.9143 40.2043 17.3466 40.3577 18.0115 40.3654L22.6562 35.1014C22.5657 34.4422 22.3594 34.0323 22.0813 33.7869C21.8033 33.5416 21.371 33.3882 20.706 33.3805L20.7058 33.3803ZM23.1181 37.2022L19.3296 41.5265C19.4199 42.1866 19.6263 42.597 19.9046 42.8425C20.1824 43.0876 20.6143 43.2411 21.2783 43.249L25.067 38.9248C24.9766 38.2648 24.7701 37.8545 24.4918 37.6088C24.2141 37.3637 23.7822 37.2104 23.1182 37.2023L23.1181 37.2022ZM26.5694 37.67C26.7349 38.1212 26.8305 38.6212 26.8638 39.1536L26.8864 39.5153L26.0781 40.438L28.6879 42.2971C29.3191 42.1414 29.6953 41.8991 29.9047 41.6051C30.1142 41.3111 30.2204 40.8762 30.1613 40.2288L26.5695 37.6702L26.5694 37.67Z'
                  fill='white'
                />
              </svg>
            }
          />
        )}
      </section>
    </>
  );
};

export default EditProfile;
