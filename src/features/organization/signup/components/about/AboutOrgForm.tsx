import { useFormState } from '../OrgSignupFormContext';
import { AboutOrgFormSchema, OrgFormData } from '@/app/api/types';
import HorizontalDivider from '@/components/HorizontalDivider';
import FormStepperActions from '@/components/steppers/FormStepperActions';
import { AboutOrgSection } from '@/features/organization/signup/components/about/AboutOrgSection';
import { OrgSocialsSection } from '@/features/organization/signup/components/about/OrgSocialsSection';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

export function AboutOrgForm() {
  const { onHandleNext, setFormData, onHandleBack, formData } = useFormState();

  const {
    register,
    setValue,
    getValues,
    handleSubmit,
    formState: { errors },
  } = useForm<OrgFormData>({
    mode: 'onTouched',
    resolver: zodResolver(AboutOrgFormSchema),
    defaultValues: formData,
  });

  const onHandleFormSubmit = (data: OrgFormData) => {
    setFormData((prev: any) => ({ ...prev, ...data }));

    window?.scrollTo({
      top: 0,
      behavior: 'auto',
    });
    onHandleNext();
  };

  return (
    <form
      className='flex flex-col pb-16'
      onSubmit={handleSubmit(onHandleFormSubmit)}
    >
      <HorizontalDivider />
      <AboutOrgSection
        setValue={setValue}
        getValues={getValues}
        register={register}
        errors={errors}
        setFormData={setFormData}
        formData={formData}
        showFileUpload={true}
      />

      <HorizontalDivider />
      <OrgSocialsSection register={register} errors={errors} />

      <HorizontalDivider />
      <FormStepperActions
        onHandleBack={onHandleBack}
        nextDisabled={Object.keys(errors).length > 0}
      />
    </form>
  );
}
