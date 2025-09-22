'use client';

import { useCreateApplicationMutation } from '@/app/api/slices/volunteer-api-slice';
import {
  ApplicationFormData,
  QuestionInterface,
  VolunteerProfileData,
} from '@/app/api/types';
import {
  POPULAR_SKILLS,
  PROFESSION_OPTIONS,
  LANGUAGE_OPTIONS,
} from '@/select-options';
import { Avatar, Button, Spinner } from '@material-tailwind/react';
import MarkdownIt from 'markdown-it';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { MdArrowBack } from 'react-icons/md';
import { toast } from 'react-toastify';
import { Tooltip } from 'react-tooltip';
import { Model } from 'survey-core';
import 'survey-core/defaultV2.min.css';
import { SharpLight } from 'survey-core/themes';
import { Survey } from 'survey-react-ui';

type QuestionChoice = {
  value: string;
  text: string;
};

type QuestionElement = {
  name: string;
  title: string | React.ReactNode;
  placeholder?: string;
  type: string;
  isRequired: string;
  choices?: QuestionChoice[];
  colCount?: number;
  autoGrow?: boolean;
  allowResize?: boolean;
  columns?: { value: string; text: string }[];
  rows?: { value: string; text: string }[];
  alternateRows?: boolean;
  isAllRowRequired?: boolean;
  inputType?: string;
  validators?: { type: string; text: string; regex: string }[];
};

const markdown = new MarkdownIt({
  html: true,
  linkify: true,
  typographer: true,
});

function convertQuestion(question: any): QuestionElement {
  switch (question.questionType) {
    case 'short-answer':
      return {
        name: question.questionNumber.toString(),
        title: question.question,
        placeholder: question.hint,
        type: 'text',
        isRequired: question.isRequired ? 'True' : 'False',
      };
    case 'paragraph':
      return {
        name: question.questionNumber.toString(),
        title: question.question,
        placeholder: question.hint,
        type: 'comment',
        isRequired: question.isRequired ? 'True' : 'False',
        autoGrow: true,
        allowResize: false,
      };
    case 'checkboxes':
      return {
        type: 'checkbox',
        name: question.questionNumber.toString(),
        title: question.question,
        choices: question.choices.map((choice: string) => ({
          value: choice,
          text: choice,
        })),
        isRequired: question.isRequired ? 'True' : 'False',
        colCount: 2,
      };
    case 'multiple-choice':
      return {
        type: 'radiogroup',
        name: question.questionNumber.toString(),
        title: question.question,
        choices: question.choices.map((choice: string) => ({
          value: choice,
          text: choice,
        })),
        isRequired: question.isRequired ? 'True' : 'False',
      };
    case 'multiple-choice-grid':
      return {
        name: question.questionNumber.toString(),
        type: 'matrix',
        title: question.question,
        isRequired: question.isRequired ? 'True' : 'False',
        columns: question.column.map((column: string) => ({
          value: column.toLowerCase(),
          text: column,
        })),
        rows: question.row.map((row: string) => ({
          value: row.toLowerCase(),
          text: row,
        })),
        alternateRows: true,
        isAllRowRequired: true,
      };
    case 'checkbox-grid':
      return {
        type: 'checkbox',
        name: question.questionNumber.toString(),
        title: question.question,
        choices: question.row.map((choice: string) => ({
          value: choice,
          text: choice,
        })),
        isRequired: question.isRequired ? 'true' : 'false',
        colCount: 2,
      };
    case 'file-upload':
      return {
        type: 'file',
        name: question.questionNumber.toString(),
        title: question.question,
        isRequired: question.isRequired ? 'true' : 'false',
      };
    case 'date-select':
      return {
        type: 'text',
        inputType: 'date',
        name: question.questionNumber.toString(),
        title: question.question,
        isRequired: question.isRequired ? 'True' : 'False',
      };
    case 'dropdown':
      return {
        type: 'dropdown',
        name: question.questionNumber.toString(),
        title: question.question,
        choices: question.choices.map((choice: string) => ({
          value: choice,
          text: choice,
        })),
        isRequired: question.isRequired ? 'True' : 'False',
      };
    case 'link-upload':
      return {
        type: 'text',
        inputType: 'url',
        name: question.questionNumber.toString(),
        title: question.question,
        placeholder: 'https://example.com',
        isRequired: question.isRequired ? 'True' : 'False',
        validators: [
          { type: 'regex', text: 'Your answer must match the URL pattern.', regex: 'https://.*' },
        ],
      };
    default:
      throw new Error(`Unsupported question type: ${question.questionType}`);
  }
}

function transformResponse(
  response: { [key: string]: any },
  questions: QuestionInterface[]
) {
  const responses: { [key: string]: any } = {};
  const fileUploads: { [key: string]: File } = {};

  const transformedResponse: {
    [key: string]: any;
    responses: { [key: string]: any };
    fileUploads: { [key: string]: File };
  } = {
    responses: {},
    fileUploads: {},
  };

  Object.keys(response).forEach((key) => {
    if (/^\d+$/.test(key)) {
      const questionNumber = parseInt(key);
      const question = questions.find(
        (q) => q.questionNumber === questionNumber
      );
      if (question) {
        switch (question.questionType) {
          case 'short-answer':
          case 'paragraph':
            responses[key] = { Response: response[key] };
            break;
          case 'checkboxes':
            const checkboxResponses: number[] = [];
            question.choices?.forEach((choice, index) => {
              if (response[key]?.includes(choice)) {
                checkboxResponses.push(index);
              }
            });
            responses[key] = { CheckboxResponse: checkboxResponses };
            break;
          case 'multiple-choice':
            const selectedIndex = question.choices?.indexOf(response[key]);
            if (selectedIndex !== undefined && selectedIndex !== -1) {
              responses[key] = { MultiSelectResponse: selectedIndex };
            }
            break;
          case 'file-upload':
            fileUploads[key] = response[key];
            break;
          case 'date-select':
            const selectedDate = new Date(response[key]);
            responses[key] = { DateResponse: selectedDate };
            break;
          case 'dropdown':
            const selectedOption = question.choices?.indexOf(response[key]);
            if (selectedOption !== undefined && selectedOption !== -1) {
              responses[key] = { DropdownResponse: selectedOption };
            }
            break;
          case 'link-upload':
            responses[key] = { Response: response[key] };
            break;
          default:
            responses[key] = { Response: response[key] };
            break;
        }
      }
    } else {
      transformedResponse[key] = response[key];
    }
  });

  transformedResponse.responses = responses;
  transformedResponse.fileUploads = fileUploads;
  transformedResponse.responses.languages = response.languages;
  transformedResponse.file = response.file;
  transformedResponse.responses.privacyConsent = response.privacyConsent;
  transformedResponse.responses.skills = response.skills;
  return transformedResponse;
}

export function base64ToBinary(base64String: string): Uint8Array {
  const byteCharacters: string = atob(base64String);
  const byteNumbers: number[] = new Array(byteCharacters.length);
  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i);
  }
  return new Uint8Array(byteNumbers);
}

type CustomQuestionFormProps = {
  questions: any;
  opportunityId: string;
  orgLogo: string;
  opportunityTitle: string;
  orgName: string;
  orgId: string;
  opType: string;
  datePosted: string;
  userProfileData?: VolunteerProfileData;
};

const CustomQuestionForm: React.FC<CustomQuestionFormProps> = ({
  questions,
  opportunityId,
  opportunityTitle,
  orgLogo,
  userProfileData,
}) => {
  const [createApplication] = useCreateApplicationMutation();
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Transform POPULAR_SKILLS and PROFESSION_OPTIONS
  const [isEasyApply, setIsEasyApply] = useState(false);

  const skillsChoices = POPULAR_SKILLS.map((skill) => ({
    value: skill.value,
    text: skill.label,
  }));

  const professionChoices = PROFESSION_OPTIONS.map((option) => ({
    value: option.value,
    text: option.label,
  }));

  const languageChoices = LANGUAGE_OPTIONS.map((language) => ({
    value: language.value,
    text: language.label,
  }));

  const generalQuestions = [
    {
      type: 'text',
      name: 'name',
      title: 'Full Name',
      isRequired: true,
    },
    {
      type: 'text',
      name: 'email',
      inputType: 'email',
      title: 'Email Address',
      isRequired: true,
    },
    {
      type: 'text',
      name: 'phone',
      title: 'Phone number',
      isRequired: true,
    },
    {
      type: 'dropdown',
      name: 'currentPosition',
      title: 'Current Position',
      isRequired: true,
      choices: professionChoices,
    },
    {
      name: 'linkedInUrl',
      type: 'text',
      title: 'Linkedin URL',
      inputType: 'url',
      validators: [
        {
          type: 'regex',
          regex: 'https://.*',
          text: 'Your answer must match the URL pattern.',
        },
      ],
    },
    {
      type: 'tagbox',
      name: 'skills',
      title: 'Skills',
      isRequired: true,
      choices: skillsChoices,
      showOptionsCaption: false,
      searchEnabled: true,
      hideSelectedItems: true,
    },
    {
      type: 'tagbox',
      name: 'languages',
      title: 'Languages',
      isRequired: true,
      choices: languageChoices,
      showOptionsCaption: false,
      hideSelectedItems: true,
    },
    {
      type: 'text',
      name: 'address',
      title: 'Address',
      isRequired: true,
    },
    {
      type: 'file',
      name: 'resume',
      title: 'Attach Resume',
      filePlaceholder:
        'Click the button below to select your resume to upload.',
      allowMultiple: false,
    },
  ];

  const surveyJson = {
    completedHtmlOnCondition: [
      {
        expression: '{nps-score} >= 8',
        html: {
          default: 'You have succeessfully applied to the opportunity',
        },
      },
    ],

    elements: [
      // General Questions
      ...generalQuestions,

      // Custom Questions
      ...questions.map(convertQuestion),

      // Privacy concent form
      {
        type: 'html',
        name: 'privacyConsentHtml',
        html: `
        <div class="custom-privacy-consent mt-4">
          <p>I consent to the processing of my personal data for the purposes of this job application as stated on the <span> <a href= '/privacy'>Privacy policy</a></span>.</p>
          <label>
            <input type="checkbox" id="privacyConsentCheckbox" required />
            I agree
          </label>
        </div>
      `,
      },
    ],
  };
  const survey = new Model(surveyJson);

  survey.onTextMarkdown.add((sender, options) => {
    options.html = markdown.render(options.text);
  });

  //Easy Apply, map userProfileData to survey data
  const initialSurveyData = isEasyApply
    ? {
        name: userProfileData?.name || '',
        email: userProfileData?.email || '',
        phone: userProfileData?.phone || '',
        currentPosition: userProfileData?.currentPosition || '',
        linkedInUrl: userProfileData?.linkedIn || '',
        skills: userProfileData?.skills || [],
        languages: userProfileData?.languages || [],
        resume: userProfileData?.resumeFile || '',
      }
    : {};

  const [isTooltipVisible, setTooltipVisible] = useState(false);

  // Function to calculate if profile data is missing for easy apply
  const isMissingData = () => {
    return (
      !userProfileData?.name ||
      !userProfileData?.email ||
      !userProfileData?.phone ||
      !userProfileData?.currentPosition ||
      !userProfileData?.linkedIn ||
      !userProfileData?.skills ||
      !userProfileData?.languages
    );
  };

  useEffect(() => {
    if (isMissingData()) {
      setTooltipVisible(true);
    } else {
      setTooltipVisible(false);
    }
  }, [userProfileData]);

  // Add style to the survey component
  survey.applyTheme(SharpLight);

  const onHandleSubmit = async (data: ApplicationFormData) => {
    toast.dismiss();
    setLoading(true);

    await createApplication({ id: opportunityId, data })
      .unwrap()
      .then((responseData) => {
        toast.success(responseData.message, {
          theme: 'light',
        });
      })
      .catch((errorResponse: { data: { message: string }; status: number }) => {
        toast.error(errorResponse.data?.message, {
          autoClose: false,
          theme: 'light',
        });
      })
      .finally(() => {
        router.back();
      });
  };

  survey.onComplete.add((sender) => {
    const transformedResponse = transformResponse(sender.data, questions);

    const data: ApplicationFormData = {
      name: transformedResponse.name,
      email: transformedResponse.email,
      phone: transformedResponse.phone,
      currentPosition: transformedResponse.currentPosition,
      linkedIn: transformedResponse.linkedInUrl,
      file: sender.data.resume,
      skills: transformedResponse.skills,
      responses: transformedResponse.responses,
      fileUploads: transformedResponse.fileUploads,
      languages: transformedResponse.languages,
      privacyConsent: transformedResponse.privacyConsent,
    };
    onHandleSubmit(data);
  });

  survey.data = {
    'nps-score': 9,
    'promoter-features': ['performance', 'ui'],
    ...initialSurveyData,
  };

  return (
    <>
      <div className='flex flex-col items-center px-8 w-full'>
        <div className='flex text-center mb-4 space-x-2'>
          <button onClick={() => router.back()}>
            <MdArrowBack className='h-6 w-6 mr-2' />
          </button>
          <Avatar size='md' variant='circular' src={orgLogo} alt='org logo' />
          <h1 className='font-extrabold text-xl font-poppins py-2'>
            {opportunityTitle}
          </h1>
        </div>

        <div className='flex items-center ml-auto w-full max-w-4xl'>
          <h1 className='text-neutrals100 font-poppins font-semibold text-xl mr-auto'>
            Submit Your Application Form Here
          </h1>

          {/* Easy Apply Button with Tooltip */}
          <div data-tooltip-id='easy-apply-tooltip' className='ml-4 mb-4'>
            <Button
              onClick={() => setIsEasyApply((prev) => !prev)}
              className={
                isEasyApply
                  ? 'bg-volunteer text-white font-semibold rounded-full px-6 py-2 hover:bg-volunteerDark transition-colors'
                  : 'bg-primary text-white font-semibold rounded-full px-6 py-2 hover:bg-lighterPrimary transition-colors'
              }
            >
              {isEasyApply ? 'Undo Easy Apply' : 'Easy Apply'}
            </Button>
          </div>
        </div>

        {/* Conditionally show tooltip */}
        {isTooltipVisible && (
          <Tooltip
            id='easy-apply-tooltip'
            place='top'
            content='Complete your profile for easy apply!'
          />
        )}
      </div>
      {/* Loading Popup */}
      {loading && (
        <div className='fixed inset-0 flex justify-center items-center z-50'>
          <div className='bg-white rounded-lg shadow-lg p-6 flex flex-col items-center'>
            <Spinner className='h-12 w-12 style={{ color: "#2D298" }}' />
            <span className='text-gray-700 font-medium mt-3'>Submitting</span>
          </div>
        </div>
      )}

      {/* Survey */}
      <Survey model={survey} />
    </>
  );
};

export default CustomQuestionForm;
