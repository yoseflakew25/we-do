'use client';

import {
  useGetChatHistoryQuery,
  usePostUserPromptMutation,
} from '@/app/api/slices/chat-bot-slice';
import { chatMessage } from '@/app/api/types';
import ThreeDotsLoading from '@/components/ThreeDotsLoading';
import { useAvatarImage, useUser } from '@/hook';
import '@material-tailwind/react';
import { Button } from '@material-tailwind/react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React, { useEffect, useRef, useState } from 'react';
import { BiMessageSquareCheck } from 'react-icons/bi';
import { FaExternalLinkAlt } from 'react-icons/fa';
import {
  IoIosSend,
  IoIosCloseCircleOutline,
  IoIosArrowRoundUp,
} from 'react-icons/io';
import ReactMarkdown from 'react-markdown';

const Chatbot: React.FC = () => {
  const ref = useRef<HTMLDivElement>(null);
  const [showChatbot, setShowChatbot] = useState(false);
  const [prompt, setPrompt] = useState('');
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [opportunityCount, setOpportunityCount] = useState(0);
  const getAvatar = useAvatarImage();
  const { data: { data: history = [], count } = {} } = useGetChatHistoryQuery({
    page,
    pageSize: 10,
  });
  const [messages, setMessages] = useState<chatMessage[]>(history);
  const [postUserPrompt, { isLoading: isFetching }] =
    usePostUserPromptMutation();
  const user = useUser();
  const router = useRouter();

  useEffect(() => {
    if (ref.current) {
      ref.current.scrollTo(0, ref.current.scrollHeight);
    }
  }, [showChatbot]);

  useEffect(() => {
    if (history && history.length > 0) {
      setMessages((prevMessages) => [
        ...(history ? [...history].reverse() : []),
        ...prevMessages,
      ]);
      setLoading(false);
    }
  }, [history]);

  // Utility function to format date
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Utility function to group messages by date
  const groupMessagesByDate = (messages: chatMessage[]) => {
    return messages?.reduce(
      (groups, message) => {
        const date = formatDate(message.timestamp);
        if (!groups[date]) {
          groups[date] = [];
        }
        groups[date].push(message);
        return groups;
      },
      {} as Record<string, chatMessage[]>
    );
  };

  const groupedMessages = groupMessagesByDate(messages);

  const getResponse = async (promptMessage: string) => {
    try {
      let response;

      response = await postUserPrompt({
        content: promptMessage,
      }).unwrap();
      setOpportunityCount(response.count);
      const newMessage = { ...response.data };

      // Update messages with the response from the server
      setMessages((prevMessages) => [...prevMessages, newMessage]);
    } catch (error) {
      console.error('Error sending prompt:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessages((prevMessages) => [
      ...prevMessages,
      {
        id: '',
        senderID: user?.id || '',
        receiverID: '',
        content: prompt,
        timestamp: new Date().toISOString(),
        messageType: '',
        link: '',
      },
    ]);
    setPrompt('');
    await getResponse(prompt);
  };

  const handleMore = async () => {
    const tempPrompt = 'Show me more';
    setMessages((prevMessages) => [
      ...prevMessages,
      {
        id: '',
        senderID: user?.id || '',
        receiverID: '',
        content: tempPrompt,
        timestamp: new Date().toISOString(),
        messageType: '',
        link: '',
      },
    ]);
    await getResponse(tempPrompt);
  };

  const handleLoadHistory = async () => {
    setLoading(true);
    setPage((prevPage) => prevPage + 1);
  };

  const handleUserTypeSelection = async (type: string) => {
    let tempPrompt = '';
    if (type === 'member') {
      tempPrompt = 'I am here looking for opportunities';
    } else if (type === 'organization') {
      tempPrompt = 'I am here as an organization';
    }

    setMessages((prevMessages) => [
      ...prevMessages,
      {
        id: '',
        senderID: user?.id || '',
        receiverID: '',
        content: tempPrompt,
        timestamp: new Date().toISOString(),
        messageType: '',
        link: '',
      },
    ]);
    await getResponse(tempPrompt);
  };

  return (
    <>
      {showChatbot ? (
        <div className='w-[90%] sm:w-96 h-[80%] rounded-2xl z-10 fixed bottom-8 right-8 shadow-xl bg-white'>
          <div className='h-12 flex justify-between bg-lighterPrimary text-white w-full rounded-t-2xl p-3'>
            <div className='flex gap-2'>
              <Image
                width={200}
                height={200}
                className='w-4 h-4 sm:h-6 sm:w-6 md:w-7 md:h-7 rounded-full self-end'
                src={getAvatar('Akil', '/assets/akil-icon.png')}
                alt='Akil Assistant avatar'
              />
              HOOPOE Assistant
            </div>
            <button
              onClick={() => setShowChatbot(false)}
              className='self-center float-right'
            >
              <IoIosCloseCircleOutline size={25} />
            </button>
          </div>
          <div className='h-[80%] w-full bg-white text-sm'>
            <div
              ref={ref}
              className='flex flex-col gap-2 h-[99%] overflow-y-auto p-3'
            >
              {messages.length < count! && (
                <button
                  onClick={handleLoadHistory}
                  className='px-2 py-1 flex gap-1 self-center text-bgPrimary w-fit rounded-full text-xs bg-secondary shadow-xl animate-bounce '
                >
                  {loading ? (
                    <p>Loading...</p>
                  ) : (
                    <>
                      <IoIosArrowRoundUp className='self-center' />
                      Load more
                    </>
                  )}
                </button>
              )}

              {messages.length < 1 && user?.role === 'guest' && (
                <div className='flex flex-col items-center gap-4'>
                  <div className='w-full flex justify-center'>
                    <Image
                      width={200}
                      height={200}
                      className='w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20'
                      src={getAvatar('Akil', '/assets/akil-icon.png')}
                      alt='Akil Assistant avatar'
                    />
                  </div>
                  <div className='px-5 py-3 text-center'>
                    Hello {user && user.name ? `${user.name}` : 'there'} <br />{' '}
                    Welcome to HOOPOE Assistant. How can I help you today?
                  </div>
                  <div className='mt-4 flex flex-col gap-2'>
                    <Button
                      className='font-inherit rounded-full normal-case py-2 px-4 hover:bg-lighterPrimary hover:text-white hover:opacity-100'
                      variant='outlined'
                      onClick={() => handleUserTypeSelection('member')}
                    >
                      I am looking for opportunities
                    </Button>
                    <Button
                      className='font-inherit rounded-full normal-case py-2 px-4 hover:bg-lighterPrimary hover:text-white hover:opacity-100'
                      variant='outlined'
                      onClick={() => handleUserTypeSelection('organization')}
                    >
                      I am here as an organization
                    </Button>
                  </div>
                </div>
              )}
              {Object.keys(groupedMessages).map((date, index) => (
                <div key={index}>
                  <div className='text-center text-xs text-gray-500 mb-2'>
                    {date}
                  </div>
                  {groupedMessages[date].map((message, msgIndex) => (
                    <div key={msgIndex}>
                      {message.senderID === user?.id ? (
                        <div className='flex flex-row-reverse gap-2 my-2'>
                          {/* <Image
                            width={200}
                            height={200}
                            className='w-4 h-4 sm:h-6 sm:w-6 md:w-7 md:h-7 rounded-full self-end'
                            src={getAvatar(
                              user.name || 'U',
                              user.profilePicUrl
                            )}
                            alt='Rounded avatar'
                          /> */}
                          <div className='text-sm text-white bg-lighterPrimary px-5 py-3 rounded-t-2xl rounded-l-2xl shadow-md'>
                            <ReactMarkdown>{message.content}</ReactMarkdown>
                          </div>
                        </div>
                      ) : (
                        <>
                          <div className='flex gap-2 my-2'>
                            {/* <Image
                              width={200}
                              height={200}
                              className='w-4 h-4 sm:h-6 sm:w-6 md:w-7 md:h-7 rounded-full self-end'
                              src={getAvatar('Akil', '/assets/akil-icon.png')}
                              alt='Rounded avatar'
                            /> */}
                            <div>
                              <div className='text-sm bg-tertiary px-5 py-3 rounded-t-2xl rounded-r-2xl prose shadow-md'>
                                <ReactMarkdown>{message.content}</ReactMarkdown>
                                {message.link && (
                                  <p className='text-xs text-lighterPrimary'>
                                    Showing {message.page}/{opportunityCount}
                                  </p>
                                )}
                              </div>
                              {message.link && (
                                <div className='flex gap-2 mt-2 text-sm w-fit'>
                                  <Button
                                    onClick={() => router.push(message.link!)}
                                    className='flex items-center gap-3 bg-lighterPrimary'
                                  >
                                    Go to Opportunity
                                    <FaExternalLinkAlt />
                                  </Button>
                                  {opportunityCount > Number(message.page) && (
                                    <Button
                                      onClick={handleMore}
                                      variant='text'
                                      className='flex items-center gap-2 hover:bg-tertiary text-bgPrimary'
                                    >
                                      See More
                                    </Button>
                                  )}
                                </div>
                              )}
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  ))}
                </div>
              ))}
              {isFetching && (
                <div className='flex gap-2'>
                  {/* <Image
                    width={200}
                    height={200}
                    className='w-4 h-4 sm:h-6 sm:w-6 md:w-7 md:h-7 rounded-full self-end'
                    src={getAvatar('Akil', '/assets/akil-icon.png')}
                    alt='Rounded avatar'
                  /> */}
                  <div className='bg-tertiary px-5 py-4 rounded-t-3xl rounded-r-3xl'>
                    <ThreeDotsLoading />
                  </div>
                </div>
              )}
            </div>
            <form onSubmit={handleSubmit} className='flex gap-1 mt-2 px-3'>
              <input
                type='text'
                placeholder='Ask a question...'
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                className='w-full p-2 rounded-xl border border-gray-300 focus:outline-none'
              />
              <button
                type='submit'
                className='bg-lighterPrimary text-white p-2 rounded-xl outline-double active:outline-lighterPrimary'
              >
                <IoIosSend size={25} />
              </button>
            </form>
          </div>
        </div>
      ) : (
        <div className='z-50 fixed bottom-8 right-8 shadow-xl rounded-full'>
          <button
            className='bg-lighterPrimary text-white p-3 rounded-full animate-pulse-two'
            onClick={() => setShowChatbot(true)}
          >
            <BiMessageSquareCheck size={35} />
          </button>
        </div>
      )}
    </>
  );
};

export default Chatbot;
