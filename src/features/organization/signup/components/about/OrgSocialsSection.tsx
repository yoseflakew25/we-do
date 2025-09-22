import { OrgFormData } from '@/app/api/types';
import FormLabel from '@/components/forms/FormLabel';
import { InputField } from '@/components/forms/ValidatedInputs';
import { useTranslations } from 'next-intl';
import { FieldErrors, UseFormRegister } from 'react-hook-form';
import {
  BiLogoFacebook,
  BiLogoInstagram,
  BiLogoInternetExplorer,
  BiLogoLinkedin,
  BiLogoTelegram,
  BiLogoWhatsapp,
} from 'react-icons/bi';

interface OrganizationSocialsSectionProps {
  register: UseFormRegister<OrgFormData>;
  errors: FieldErrors<OrgFormData>;
}

export function OrgSocialsSection({
  register,
  errors,
}: OrganizationSocialsSectionProps) {
  const t = useTranslations('OrganizationSignupPage.aboutOrganizationSection');

  return (
    <div className='flex font-poppins flex-col sm:flex-row sm:space-x-16'>
      <div className='basis-1/3'>
        <p className='text-primary text-xl font-semibold'>
          {t('organizationSocials.title')}
        </p>
        <p className='text-tertiary font-normal text-base'>
          {t('organizationSocials.description')}
        </p>
      </div>
      <div className='basis-2/3 sm:ml-20'>
        <div className='mb-4'>
          <FormLabel label={t('inputAreaLabels.website')} />
          <InputField
            name={'website'}
            className='rounded-full'
            register={register}
            crossOrigin={undefined}
            message={
              errors.website?.message
                ? t(`${errors.website?.message}`)
                : errors.primaryPhone?.message
            }
            icon={<BiLogoInternetExplorer />}
          />
        </div>
        <div className='mb-4'>
          <FormLabel label={t('inputAreaLabels.linkedIn')} />
          <InputField
            name={'linkedIn'}
            className='rounded-full'
            register={register}
            crossOrigin={undefined}
            message={errors.linkedIn?.message}
            icon={<BiLogoLinkedin />}
          />
        </div>
        <div className='mb-4'>
          <FormLabel label={t('inputAreaLabels.instagram')} />
          <InputField
            name={'instagram'}
            className='rounded-full'
            register={register}
            crossOrigin={undefined}
            message={errors.instagram?.message}
            icon={<BiLogoInstagram />}
          />
        </div>
        <div className='mb-4'>
          <FormLabel label={t('inputAreaLabels.facebook')} />
          <InputField
            name={'facebook'}
            className='rounded-full'
            register={register}
            crossOrigin={undefined}
            message={errors.facebook?.message}
            icon={<BiLogoFacebook />}
          />
        </div>
        <div className='mb-4'>
          <FormLabel label={t('inputAreaLabels.telegram')} />
          <InputField
            name={'telegram'}
            className='rounded-full'
            register={register}
            crossOrigin={undefined}
            message={errors.telegram?.message}
            icon={<BiLogoTelegram />}
          />
        </div>
        <div className='mb-4'>
          <FormLabel label={t('inputAreaLabels.whatsapp')} />
          <InputField
            name={'whatsapp'}
            className='rounded-full'
            register={register}
            crossOrigin={undefined}
            message={errors.whatsapp?.message}
            icon={<BiLogoWhatsapp />}
          />
        </div>
      </div>
    </div>
  );
}
