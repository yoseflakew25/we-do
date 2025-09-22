'use client';

import { handleBack, handleNext } from '../opportunity-slice';
import Edit from './Edit';
import Question from './Question';
import HorizontalDivider from '@/components/HorizontalDivider';
import FormStepperActions from '@/components/steppers/FormStepperActions';
import {
  addQuestion,
  deleteQuestion,
  setActiveQuestionIndex,
} from '@/features/organization/org-side-custom-questions-slice';
import { useAppDispatch, useAppSelector } from '@/hook';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';

const CustomQuestionForm = ({
  closeCollapse,
  viewOnly,
  isEditPage,
}: {
  closeCollapse?: () => void;
  viewOnly?: boolean;
  isEditPage?: boolean;
}) => {
  const dispatch = useAppDispatch();
  // Retrieve the form state from the Redux store
  const formState = useAppSelector((state) => state.orgSideCustomQuestions);

  // Local state to manage loading
  const [loading, setLoading] = useState(false);

  // Set up the form using react-hook-form
  const { handleSubmit } = useForm({
    defaultValues: formState,

    mode: 'onChange',
  });

  // Handle adding new question
  const handleAddQuestion = () => {
    dispatch(addQuestion());
  };

  // Handle deleting a question
  const handleDeleteQuestion = (index: number) => {
    dispatch(deleteQuestion(index));
    handleQuestionClick(index - 1);
  };

  // Set the active question index
  const handleQuestionClick = (index: number) => {
    dispatch(setActiveQuestionIndex(index));
  };

  const activeQuestionIndex = useAppSelector(
    (state) =>
      (state.orgSideCustomQuestions as { activeQuestionIndex: number })
        .activeQuestionIndex
  );

  // Handle form submit
  const onHandleSubmit = () => {
    setLoading(true);
    dispatch(handleNext());
    setLoading(false);
    closeCollapse && closeCollapse();
  };

  return (
    <div className='max-w-5xl mx-auto py-10'>
      <form
        onSubmit={handleSubmit(onHandleSubmit)}
        className='w-full block mx-auto h-full px-6 md:px-0 overflow-x-hidden'
      >
        <div className='flex md:flex-row flex-col items-center mx-auto'>
          <div
            className={`border-t-8 rounded-md my-6 ${
              !viewOnly ? 'border-primary' : 'border-[#29A0B1]'
            } bg-white shadow w-full grid place-items-center mx-auto`}
          >
            <div className='w-full border border-gray-300'>
              <div className='w-full px-6 py-2'>  
                <div className='text-3xl flex items-center mx-auto mr-12 outline-none font-bold capitalize border-b 
               border-gray-200 pt-3 pb-2 w-full'>
                  Create Custom Questions
                  </div>  
              </div> 
                    
              <div className='w-full px-6 py-1 mb-6'>
                <p className='text-base outline-none font-medium capitalize border-b focus:border-b-2 border-gray-200'>
                  Create your own custom questions to ask candidates. <span className='text-sm font-light'>Kindly avoid requesting the following questions—Full name, skills, spoken languages, address, email, phone number, current position, or LinkedIn URL—as we already have them from the user's profile.</span> 
                </p>
              </div>
            </div>
          </div>
          <div>
            {formState.questions?.length === 0 && (
              <Edit
                handleAdd={handleAddQuestion}
                show
                handleDelete={() =>
                  handleDeleteQuestion(formState.questions?.length - 1)
                }
              />
            )}
          </div>
        </div>
        <div className='relative'>
          {formState.questions?.map((question, index) => (
            <Question
              onclick={() => handleQuestionClick(index)}
              key={index}
              index={index}
              value={question}
              addQuestion={handleAddQuestion}
              handleDelete={() => handleDeleteQuestion(index)}
              isActiveQuestion={index === activeQuestionIndex}
              viewOnly={!viewOnly}
            />
          ))}
        </div>

        <HorizontalDivider />

        {!(viewOnly || isEditPage) && (
          <FormStepperActions
            onHandleBack={() => dispatch(handleBack())}
            className='mt-4'
            nextLoading={loading}
          />
        )}
      </form>
    </div>
  );
};

export default CustomQuestionForm;
