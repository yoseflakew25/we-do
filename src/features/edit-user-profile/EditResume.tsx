import ProfileCard from './components/ProfileCard';
import { updateProfile } from './profile-slice';
import {
  useDeleteResumeForUserMutation,
  useEditResumeForUserMutation,
} from '@/app/api/slices/volunteer-api-slice';
import { useAppDispatch, useAppSelector } from '@/hook';
import { Spinner, Typography } from '@material-tailwind/react';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { useRef, useState } from 'react';
import { FaExternalLinkAlt, FaRegFileAlt } from 'react-icons/fa';
import { IoAdd } from 'react-icons/io5';
import { MdDeleteOutline } from 'react-icons/md';
import { toast } from 'react-toastify';

export function EditResume() {
  const profileData = useAppSelector((state) => state.profile.profile);
  const dispatch = useAppDispatch();

  const [editResumeForUser] = useEditResumeForUserMutation();
  const [deleteResumeForUser] = useDeleteResumeForUserMutation();

  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const t = useTranslations('EditProfile');

  const inputRef = useRef<HTMLInputElement>(null);

  const openFileSelector = () => {
    inputRef.current?.click();
  };

  const handleResumeChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null;
    if (file) {
      const validTypes = [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      ];
      if (!validTypes.includes(file.type)) {
        toast.error(t('Invalid file type'), {
          autoClose: false,
          theme: 'light',
        });
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        // Check if file size is greater than 5MB
        toast.error(t('File size should not exceed 5MB'), {
          autoClose: false,
          theme: 'light',
        });
        return;
      }

      setLoading(true); // Set loading to true when request starts

      await editResumeForUser({
        file: file as File,
      })
        .unwrap()
        .then(async (res) => {
          if (!res?.data) {
            toast.error('An unknown error occurred', {
              autoClose: false,
              theme: 'light',
            });
            return;
          }
          dispatch(
            updateProfile({
              resumeURL: res.data?.resumeFile?.fileURL,
              resumeFile: res.data?.resumeFile,
            })
          );
          toast.success(t('Resume Updated successfully!'), {
            theme: 'light',
          });
        })
        .catch(
          (errorResponse: { data: { message: string }; status: number }) => {
            if (errorResponse.data) {
              toast.error(errorResponse.data.message, {
                autoClose: false,
                theme: 'light',
              });
            } else {
              toast.error('An unknown error occurred', {
                autoClose: false,
                theme: 'light',
              });
            }
          }
        )
        .finally(() => {
          setLoading(false);
        });
    }
  };
  const deleteResume = async () => {
    setDeleting(true); // Set loading to true when request starts

    await deleteResumeForUser()
      .unwrap()
      .then(async () => {
        dispatch(
          updateProfile({
            resumeURL: '',
            resumeFile: {
              filePath: '',
              fileURL: '',
              fileSize: 0,
            },
          })
        );
        toast.success(t('Resume Deleted successfully!'), {
          theme: 'light',
        });
      })
      .catch((errorResponse: { data: { message: string }; status: number }) => {
        if (errorResponse.data) {
          toast.error(errorResponse.data.message, {
            autoClose: false,
            theme: 'light',
          });
        } else {
          toast.error('An unknown error occurred', {
            autoClose: false,
            theme: 'light',
          });
        }
      })
      .finally(() => {
        setDeleting(false);
      });
  };

  const icon = profileData?.resumeURL ? (
    <MdDeleteOutline size={25} color='#C4897B' />
  ) : (
    <IoAdd size={25} color='#C4897B' />
  );

  const handleIconClick = profileData?.resumeURL
    ? deleteResume
    : openFileSelector;

  return (
    <ProfileCard
      icon={icon}
      handleButtonClick={() => {}}
      handleIconClick={handleIconClick}
    >
      <Typography className='font-inherit font-semibold text-lg text-primary capitalize mb-2'>
        {t('Resume/CV')}
      </Typography>
      <div className=''>
        <input
          type='file'
          ref={inputRef}
          className='hidden'
          accept='.pdf, .doc, .docx'
          onChange={handleResumeChange}
        />
        {loading || deleting ? (
          <div className=' w-full flex flex-col items-center justify-center'>
            <Spinner className='h-10 w-10' color='amber' />
            <span className='mt-2 text-gray-700 text-sm font-poppins'>
              {deleting ? t('Deleting') : t('Uploading')}
            </span>
          </div>
        ) : (
          <>
            {profileData?.resumeFile?.filePath ? (
              <div className='flex space-x-2 items-center justify-center'>
                <FaRegFileAlt size={35} />
                <div className='flex w-full flex-col'>
                  <Link
                    href={profileData.resumeFile.fileURL}
                    target='_blank'
                    rel='noopener noreferrer'
                    className='flex flex-row items-center overflow-hidden space-x-2 cursor-pointer'
                  >
                    <Typography className='font-poppins text-sm text-secondary truncate font-normal'>
                      {profileData.resumeFile.filePath}
                    </Typography>

                    <FaExternalLinkAlt size={10} color='#C4897B' />
                  </Link>

                  <Typography className='font-poppins text-xs text-tertiary font-normal'>
                    {(profileData.resumeFile.fileSize / 1024).toFixed(2)} KB
                  </Typography>
                </div>
              </div>
            ) : (
              <Typography className='font-Epilogue flex justify-center items-center text-sm text-[#7A7A84] font-normal'>
                {t('No resume uploaded')}
              </Typography>
            )}
          </>
        )}
      </div>
    </ProfileCard>
  );
}
