'use client';

import Edit from './Edit';
import QuestionInput from './input/RichtextInputField';
import Checkboxes from './qtypes/Checkboxes';
import DateSelect from './qtypes/DateSelect';
import FileUpload from './qtypes/FileUpload';
import UploadLink from './qtypes/Linkupload';
import Paragraph from './qtypes/Paragraph';
import ShortAnswer from './qtypes/ShortAnswer';
import Dropdown from './qtypes/multiple-choice/Dropdown';
import MultipleChoice from './qtypes/multiple-choice/MultipleChoice';
import {
  updateQuestionTitle,
  updateQuestionType,
  updateQuestionRequired,
} from '@/features/organization/org-side-custom-questions-slice';
import { RootState } from '@/store';
import { Select, Option, Switch } from '@material-tailwind/react';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';

const Question = ({
  index,
  value,
  addQuestion,
  handleDelete,
  isActiveQuestion,
  onclick,
  viewOnly,
}: {
  index: number;
  value: {
    question: string;
    questionType: string;
    choices?: string[] | undefined;
    isRequired: boolean;
  };
  addQuestion: () => void;
  handleDelete: () => void;
  isActiveQuestion: boolean;
  onclick: any;
  viewOnly?: boolean;
}) => {
  const dispatch = useDispatch();
  const { question, questionType, choices, isRequired } = value; // Assuming value contains title and questionType

  const handleChange = (newValue: string) => {
    dispatch(updateQuestionTitle({ index, title: newValue }));
  };

  const handleTypeChange = (
    value:
      | 'short-answer'
      | 'paragraph'
      | 'multiple-choice'
      | 'checkboxes'
      | 'file-upload'
      | 'dropdown'
      | 'date-select'
      | 'link-upload'
      | undefined
  ) => {
    if (value) {
      dispatch(updateQuestionType({ index, questionType: value }));
    }
  };
  const activeQuestionIndex = useSelector(
    (state: RootState) =>
      (state.orgSideCustomQuestions as { activeQuestionIndex: number })
        .activeQuestionIndex
  );
  // const qType = data.find((elem) => elem.title === questionType);

  const handleRequiredChange = () => {
    dispatch(updateQuestionRequired({ index, isRequired: !isRequired }));
  };

  return (
    <div
      onClick={onclick}
      className='flex md:flex-row flex-col justify-center items-center w-full mx-auto '
    >
      <div
        className={` rounded-md my-6 ${
          activeQuestionIndex === index
            ? viewOnly
              ? 'border-l-4 border-primary'
              : 'border-l-4 border-[#29A0B1]'
            : 'border border-gray-300'
        }  bg-white shadow w-full grid place-items-center lg:place-items-start lg:ml-10 mx-auto`}
      >
        <div className='w-full md:px-6 px-2 flex md:flex-row flex-col md:justify-between justify-center items-center gap-8 py-6'>
          <QuestionInput
            question={question}
            handleChange={handleChange}
            viewOnly={viewOnly}
          />
          <div className='biase-1/3'>
            <Select
              placeholder='Select Question Type'
              style={{ width: 300 }}
              value={questionType}
              onChange={(value) =>
                handleTypeChange(
                  value as
                    | 'short-answer'
                    | 'paragraph'
                    | 'multiple-choice'
                    | 'checkboxes'
                    | 'file-upload'
                    | 'dropdown'
                    | 'date-select'
                    | 'link-upload'
                    | undefined
                )
              }
              disabled={!viewOnly}
            >
              <Option value='short-answer'>Short Answer</Option>
              <Option value='paragraph'>Paragraph</Option>
              <Option value='multiple-choice'>Multiple Choice</Option>
              <Option value='checkboxes'>Checkboxes</Option>
              <Option value='dropdown'>Dropdown</Option>
              <Option value='file-upload'>File Upload</Option>
              <Option value='date-select'>Date</Option>
              <Option value='link-upload'>Link</Option>
            </Select>
          </div>
        </div>
        {questionType === 'short-answer' && (
          <div className='w-full'>
            <ShortAnswer />
          </div>
        )}
        {questionType === 'paragraph' && (
          <div className='w-full'>
            <Paragraph />
          </div>
        )}
        {questionType === 'multiple-choice' && (
          <div className='w-full'>
            <MultipleChoice choices={choices || []} viewOnly={!viewOnly} />
          </div>
        )}

        {questionType === 'checkboxes' && (
          <div className='w-full'>
            <Checkboxes
              choices={choices || []}
              isActiveQuestion={true}
              viewOnly={!viewOnly}
            />
          </div>
        )}

        {questionType === 'dropdown' && (
          <div className='w-full'>
            <Dropdown
              choices={choices || []}
              isActiveQuestion={true}
              viewOnly={!viewOnly}
            />
          </div>
        )}

        {questionType === 'file-upload' && (
          <div className='w-full'>
            <FileUpload questionIndex={index} viewOnly={!viewOnly} />
          </div>
        )}

        {questionType === 'date-select' && (
          <div className='w-full'>
            <DateSelect />
          </div>
        )}

        {questionType === 'link-upload' && (
          <div className='w-full'>
            <UploadLink />
          </div>
        )}

        <div className='ml-5 mb-5 flex'>
          <Switch
            color={`${viewOnly ? 'amber' : 'teal'}`}
            crossOrigin={undefined}
            checked={isRequired}
            label='Required'
            onChange={handleRequiredChange}
            disabled={!viewOnly}
          />
        </div>
      </div>
      {isActiveQuestion && viewOnly && (
        <Edit handleAdd={addQuestion} handleDelete={handleDelete} />
      )}
    </div>
  );
};

export default Question;
