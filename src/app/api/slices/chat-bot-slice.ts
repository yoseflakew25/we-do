import { chatMessage } from '../types';
import { apiSlice } from './api-slice';

interface Response {
  data: chatMessage;
  count: number;
}

interface chatHistoryResponse {
  data: chatMessage[];
  count: number;
}

const chatbotApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getChatHistory: builder.query<
      chatHistoryResponse,
      { page?: number; pageSize?: number }
    >({
      query: ({ page, pageSize }) => ({
        url: `/chat/history`,
        method: 'GET',
        params: { page, pageSize },
      }),
    }),

    postUserPrompt: builder.mutation<
      Response,
      { content: string; tempId?: string }
    >({
      query: ({ content, tempId }) => ({
        url: `/chat/response`,
        method: 'POST',
        body: { content, tempId },
      }),
    }),
  }),
});

export const { useGetChatHistoryQuery, usePostUserPromptMutation } =
  chatbotApiSlice;
