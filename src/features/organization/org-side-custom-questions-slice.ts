// src/reducers/orgSideCustomQuestions.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Question {
  question: string;
  questionType:
    | 'short-answer'
    | 'paragraph'
    | 'multiple-choice'
    | 'checkboxes'
    | 'file-upload'
    | 'dropdown'
    | 'date-select'
    | 'link-upload';
  choices?: string[] | undefined; // Choices are only applicable for 'Multiple Choice' and 'Checkboxes'

  allowedFileTypes?: string[]; // For file upload
  maxFiles?: number; // For file upload
  maxFileSize?: number; // For file upload, in MB

  activeChoiceIndex?: number | null;
  isRequired: boolean;
  questionNumber: number;
}

interface FormState {
  title: string;
  desc: string;
  questions: Question[];
  activeQuestionIndex: number | null;
}

const initialState: FormState = {
  title: 'Additional Questions Form',
  desc: 'Form Description',
  questions: [],
  activeQuestionIndex: null,
};

const orgSideCustomQuestions = createSlice({
  name: 'orgSideCustomQuestions',
  initialState,
  reducers: {
    setTitle(state, action: PayloadAction<string>) {
      state.title = action.payload;
    },
    setDesc(state, action: PayloadAction<string>) {
      state.desc = action.payload;
    },
    addQuestion(state) {
      const newQuestion: Question = {
        question: '',
        questionType: 'short-answer', // Default questionType
        isRequired: false, // Default isRequired field
        questionNumber: state.questions.length + 1,
      };

      return {
        ...state,
        questions: [...state.questions, newQuestion],
        activeQuestionIndex: state.questions.length, // Update activeQuestionIndex
      };
    },
    updateQuestionTitle(
      state,
      action: PayloadAction<{ index: number; title: string }>
    ) {
      const { index, title } = action.payload;
      state.questions[index].question = title;
    },
    updateQuestionType(
      state,
      action: PayloadAction<{
        index: number;
        questionType: Question['questionType'];
      }>
    ) {
      const { index, questionType } = action.payload;
      // state.questions[index].questionType = questionType;
      if (state.questions[index]) {
        state.questions[index].questionType = questionType;

        if (questionType === 'file-upload') {
          state.questions[index].maxFiles = 5;
          state.questions[index].maxFileSize = 50;
        }
        if (
          questionType === 'multiple-choice' ||
          questionType === 'checkboxes' || questionType === 'dropdown'
        ) {
          state.questions[index].choices = [];
        } else {
          delete state.questions[index].choices;
        }
      }
    },

    updateFileUploadSettings(
      state,
      action: PayloadAction<{
        index: number;
        allowedFileTypes?: string[];
        maxFiles?: number;
        maxFileSize?: number;
      }>
    ) {
      const { allowedFileTypes, maxFiles, maxFileSize } = action.payload;
      const questionIndex = state.activeQuestionIndex ?? 0;
      const question = state.questions[questionIndex];
      if (question && question.questionType === 'file-upload') {
        question.allowedFileTypes = allowedFileTypes;
        question.maxFiles = maxFiles;
        question.maxFileSize = maxFileSize;
      }
    },

    // Update allowed file types
    updateAllowedFileTypes(
      state,
      action: PayloadAction<{
        index: number;
        allowedFileTypes: string[];
      }>
    ) {
      const { allowedFileTypes } = action.payload;
      const questionIndex = state.activeQuestionIndex ?? 0;
      const question = state.questions[questionIndex];
      if (question && question.questionType === 'file-upload') {
        question.allowedFileTypes = allowedFileTypes;
      }
    },

    // Update maximum number of files
    updateMaxFiles(
      state,
      action: PayloadAction<{
        index: number;
        maxFiles: number;
      }>
    ) {
      const { maxFiles } = action.payload;
      const questionIndex = state.activeQuestionIndex ?? 0;
      const question = state.questions[questionIndex];
      if (question && question.questionType === 'file-upload') {
        question.maxFiles = maxFiles;
      }
    },

    // Update maximum file size
    updateMaxFileSize(
      state,
      action: PayloadAction<{
        index: number;
        maxFileSize: number;
      }>
    ) {
      const { maxFileSize } = action.payload;
      const questionIndex = state.activeQuestionIndex ?? 0;
      const question = state.questions[questionIndex];
      if (question && question.questionType === 'file-upload') {
        question.maxFileSize = maxFileSize;
      }
    },

    updateQuestionValue(
      state,
      action: PayloadAction<{ index: number | null; value: string[] }>
    ) {
      const { index, value } = action.payload;
      if (index !== null) {
        state.questions[index].choices = value;
      }
    },
    deleteQuestion(state, action: PayloadAction<number>) {
      const index = action.payload;
      state.questions.splice(index, 1);
      if (state.activeQuestionIndex !== null) {
        state.activeQuestionIndex =
          index === state.questions.length ? index - 1 : null;
      }
    },
    setActiveQuestionIndex(state, action: PayloadAction<number | null>) {
      state.activeQuestionIndex = action.payload;
    },

    addChoice(state) {
      const questionIndex = state.activeQuestionIndex ?? 0;
      const question = state.questions[questionIndex];
      if (
        question &&
        (question.questionType === 'multiple-choice' ||
          question.questionType === 'checkboxes'|| question.questionType === 'dropdown')
      ) {
        question.choices?.push(`option ${question.choices.length + 1}`);
        setActiveChoiceIndex({
          questionIndex: questionIndex,
          choiceIndex:
            question.choices?.length ?? question.choices?.length ? -1 : 0,
        });
      }
    },
    removeChoice(state, action: PayloadAction<{ choiceIndex: number }>) {
      const { choiceIndex } = action.payload;
      const questionIndex = state.activeQuestionIndex ?? 0;
      const question = state.questions[questionIndex];
      if (
        question &&
        (question.questionType === 'multiple-choice' ||
          question.questionType === 'checkboxes' || question.questionType === 'dropdown') &&
        question.choices
      ) {
        question.choices.splice(choiceIndex, 1);
      }
    },

    updateChoice(
      state,
      action: PayloadAction<{
        choiceIndex: number;
        value: string;
      }>
    ) {
      const { choiceIndex, value } = action.payload;
      const questionIndex = state.activeQuestionIndex ?? 0;
      const question = state.questions[questionIndex];
      if (
        question &&
        (question.questionType === 'multiple-choice' ||
          question.questionType === 'checkboxes' || question.questionType === 'dropdown') &&
        question.choices
      ) {
        question.choices[choiceIndex] = value;
      }
    },

    setActiveChoiceIndex(
      state,
      action: PayloadAction<{
        questionIndex: number;
        choiceIndex: number;
      }>
    ) {
      const { questionIndex, choiceIndex } = action.payload;
      const question = state.questions[questionIndex];
      if (
        question &&
        (question.questionType === 'multiple-choice' ||
          question.questionType === 'checkboxes' || question.questionType === 'dropdown') &&
        question.choices
      ) {
        question.activeChoiceIndex = choiceIndex;
      }
    },

    updateQuestionRequired(
      state,
      action: PayloadAction<{ index: number; isRequired: boolean }>
    ) {
      const { index, isRequired } = action.payload;
      if (state.questions[index]) {
        state.questions[index].isRequired = isRequired;
      }
    },

    setQuestions(state, action: PayloadAction<Question[]>) {
      state.questions = action.payload;
    },
  },
});

export const {
  setTitle,
  setDesc,
  addQuestion,
  updateQuestionTitle,
  updateQuestionType,
  updateQuestionValue,
  deleteQuestion,
  setActiveQuestionIndex,
  addChoice,
  removeChoice,
  updateChoice,
  setActiveChoiceIndex,
  updateQuestionRequired,
  updateFileUploadSettings,
  updateAllowedFileTypes,
  updateMaxFiles,
  updateMaxFileSize,
  setQuestions,
} = orgSideCustomQuestions.actions;

export default orgSideCustomQuestions.reducer;
