import { usePostOpportunityMutation } from '@/app/api/slices/opportunity-api-slice';
import {
  CombinedOpportunityFormSchema,
  OpportunityFormData,
} from '@/app/api/types';
import AllFormErrorsAlert from '@/components/forms/AllFormErrorsAlert';
import SuccessPopup from '@/components/popups/SuccessPopup';
import FormStepperActions from '@/components/steppers/FormStepperActions';
import { useAppDispatch, useAppSelector } from '@/hook';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { handleBack, setOpportunityToInitialState } from '../opportunity-slice';
import OpportunityInfo from '../view/opportunity-info/OpportunityInfo';

function OpportunityReview() {
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const [postOpportunity] = usePostOpportunityMutation();
  const t = useTranslations('PostOpportunityPage.reviewSection');

  const opportunityData = useAppSelector(
    (state) => state.opportunity.opportunity
  );
  const formState = useAppSelector((state) => state.orgSideCustomQuestions);
  const dispatch = useAppDispatch();

  const {
    handleSubmit,
    formState: { errors },
  } = useForm<OpportunityFormData>({
    defaultValues: opportunityData,
    mode: 'all',
    resolver: zodResolver(CombinedOpportunityFormSchema),
  });

  const onHandleFormSubmit = async (data: OpportunityFormData) => {
    toast.dismiss();
    setLoading(true);

    const finalFormData = {
      ...data,
      // Inject parsed or original array
      paymentOption: {
        ...data.paymentOption,
        amount: Number(data.paymentOption?.amount),
        min: Number(data.paymentOption?.min),
        max: Number(data.paymentOption?.max),
      },
      allowedEmails: opportunityData.allowedEmails,
      questions: formState.questions,
    };

    try {
      await postOpportunity(finalFormData).unwrap();
      setShowSuccessPopup(true);
      dispatch(setOpportunityToInitialState());
    } catch (errorResponse: any) {
      toast.error(errorResponse?.data?.message || 'Submission failed', {
        autoClose: false,
        theme: 'light',
      });
    }

    setLoading(false);
  };

  return (
    <div className='mb-4'>
      <OpportunityInfo formData={opportunityData} mode={'review'} />

      <div className='mb-4 p-6'></div>

      <form
        className='flex gap-4 justify-end'
        onSubmit={handleSubmit(onHandleFormSubmit)}
      >
        <FormStepperActions
          onHandleBack={() => dispatch(handleBack())}
          nextLoading={loading}
          isLast
        />
      </form>

      <AllFormErrorsAlert<OpportunityFormData>
        errors={errors}
        className='mb-5'
      />

      {/* Success popup */}
      {showSuccessPopup && (
        <SuccessPopup
          title={t('successPopupModal.title')}
          subTitle={t('successPopupModal.subTitle')}
          buttonText={t('successPopupModal.buttonText')}
          onButtonClick={() => {
            router.push('/organization/opportunities');
          }}
        />
      )}
    </div>
  );
}

export default OpportunityReview;
