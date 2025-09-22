import { QuestionInterface, Response } from '@/app/api/types';
import { useTranslations } from 'next-intl';
import React from 'react';

type Props = {
  questions: QuestionInterface[];
  responses: { [key: string]: Response };
};

const AdditionalQuestionsResponses: React.FC<Props> = ({
  questions,
  responses,
}) => {
  const t = useTranslations('ApplicantDetailPage');

  return (
    <div className='p-4'>
      {questions.map((question) => (
        <div key={question.questionNumber} className='mb-4'>
          <h3 className='text-lg font-bold text-neutrals100 capitalize'>
            {question.questionNumber}. {question.question}
          </h3>
          <div className='flex space-x-3 items-center mb-2  '>
            <p className='text-neutrals80 font-bold'>{t('response')}: </p>
            <div className=' w-full'>
              {question.questionType === 'short-answer' && (
                <p className=' capitalize'>
                  {responses[question.questionNumber]?.Response}
                </p>
              )}
              {question.questionType === 'paragraph' && (
                <p className=' capitalize'>
                  {responses[question.questionNumber]?.Response}
                </p>
              )}
              {question.questionType === 'checkboxes' && (
                <div className=' flex gap-2  '>
                  {responses[question.questionNumber]?.CheckboxResponse?.map(
                    (choiceIndex) => (
                      <p key={choiceIndex} className=' capitalize'>
                        {question.choices?.[choiceIndex]} |{' '}
                      </p>
                    )
                  )}
                </div>
              )}
              {question.questionType === 'multiple-choice' && (
                <p className=' capitalize'>
                  {
                    question.choices?.[
                      responses[question.questionNumber]?.MultiSelectResponse ||
                        0
                    ]
                  }
                </p>
              )}
              {question.questionType === 'file-upload' && (
                <div>
                  {responses[question.questionNumber]?.fileResponse?.map(
                    (file, index) => (
                      <a
                        key={index}
                        href={file?.fileURL}
                        target='_blank'
                        rel='noopener noreferrer'
                        className=' text-blueAccent underline'
                      >
                        {file?.filePath}
                      </a>
                    )
                  )}
                </div>
              )}
            </div>
          </div>

          <hr />
        </div>
      ))}
    </div>
  );
};

export default AdditionalQuestionsResponses;
