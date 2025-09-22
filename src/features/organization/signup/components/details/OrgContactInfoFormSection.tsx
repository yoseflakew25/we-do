import Location from '../Location';
import { OrgFormData } from '@/app/api/types';
import HorizontalDivider from '@/components/HorizontalDivider';
import FormLabel from '@/components/forms/FormLabel';
import { InputField } from '@/components/forms/ValidatedInputs';
import { useTranslations } from 'next-intl';
import { FieldErrors, UseFormRegister } from 'react-hook-form';

interface OrgContactInfoFormSectionProps {
  register: UseFormRegister<OrgFormData>;
  errors: FieldErrors<OrgFormData>;
  // eslint-disable-next-line unused-imports/no-unused-vars
  onLocationChange?: (newLocation: { lat: number; lng: number }) => void;
  // eslint-disable-next-line unused-imports/no-unused-vars
  setFormData: (value: React.SetStateAction<OrgFormData>) => void;
  geoLocation?: { latitude: number; longitude: number } | null;
}

export function OrganizationContactInfoFormSection({
  register,
  errors,
  geoLocation,
  onLocationChange,
  setFormData,
}: OrgContactInfoFormSectionProps) {
  const t = useTranslations(
    'OrganizationSignupPage.organizationDetailsSection'
  );
  const translateValidation = useTranslations('validationErrors');

  const handleLocationChange = (newLocation: { lat: number; lng: number }) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      geoLocation: {
        longitude: newLocation.lng,
        latitude: newLocation.lat,
      },
    }));
  };
  return (
    <>
      <div className='flex flex-col gap-y-3 sm:flex-row'>
        {/* left side */}
        <div className='sm:basis-1/3'>
          <p className='text-primary text-xl font-semibold'>
            {t('contactInformations.title')}
          </p>
          <p className='text-tertiary font-normal text-base'>
            {t('contactInformations.description')}
          </p>
        </div>
        {/* Right side */}
        <div className='sm:basis-2/3 flex flex-col gap-y-3 sm:ml-20 sm:space-y-2'>
          {/* Phone Number input */}
          <div className='flex flex-col gap-y-3 sm:flex-row sm:space-x-6'>
            <div className='sm:basis-1/2'>
              <FormLabel
                label={t(
                  'contactInformations.inputAreaLabels.primaryPhoneNumber'
                )}
                required
              />
              <InputField
                type='tel'
                name={'primaryPhone'}
                className='rounded-full'
                register={register}
                crossOrigin={undefined}
                placeholder='+251 91 XXX XXXX'
                message={
                  errors.primaryPhone?.message
                    ? translateValidation(`${errors.primaryPhone?.message}`)
                    : errors.primaryPhone?.message
                }
                required
              />
            </div>
            <div className='sm:basis-1/2'>
              <FormLabel
                label={t(
                  'contactInformations.inputAreaLabels.secondaryPhoneNumber'
                )}
              />
              <InputField
                type='tel'
                name={'secondaryPhone'}
                className='rounded-full'
                register={register}
                crossOrigin={undefined}
                placeholder='+251 91 XXX XXXX'
                message={
                  errors.secondaryPhone?.message
                    ? translateValidation(`${errors.secondaryPhone?.message}`)
                    : errors.secondaryPhone?.message
                }
              />
            </div>
          </div>

          {/* Email input */}
          <div className='basis-1/2'>
            <FormLabel
              label={t('contactInformations.inputAreaLabels.emailAddress')}
              required
            />
            <InputField
              name={'email'}
              type='email'
              className='rounded-full'
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
        </div>
      </div>
      <HorizontalDivider />
      <div className='flex flex-col gap-y-3 sm:flex-row'>
        {/* left side */}
        <div className='sm:basis-1/3'>
          <p className='text-primary text-xl font-semibold'>
            {t('organizationDetails.inputAreaLabels.locationDetails')}
          </p>
          <p className='text-tertiary font-normal text-base'>
            {t(
              'organizationDetails.inputAreaLabels.locationDetailsDescription'
            )}
          </p>
        </div>
        {/* Right side */}
        <div className='sm:basis-2/3 flex flex-col gap-y-3 sm:ml-20 sm:space-y-2'>
          {/* Location input */}
          <div className=''>
            <FormLabel
              label={t('organizationDetails.inputAreaLabels.googleMaps')}
            />

            <Location
              onLocationChange={onLocationChange || handleLocationChange}
              initalPlace={
                geoLocation || {
                  latitude: 9.030177384554046,
                  longitude: 38.76288469514627,
                }
              }
            />
          </div>
        </div>
      </div>
    </>
  );
}
