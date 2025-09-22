import { Card, Typography } from '@material-tailwind/react';
import Link from 'next/link';
import React, { useState } from 'react';
import { FaExternalLinkAlt } from 'react-icons/fa';
import { HiDocument } from 'react-icons/hi2';
import { IoAdd } from 'react-icons/io5';
import { TbPencil } from 'react-icons/tb';

interface FileUploadProps {
  onFileChange: (_file: File | null) => void;

  resumeFromProfile?: {
    filePath: string;
    fileSize: number;
    fileURL: string;
  };
}

const FileUploadComponent: React.FC<FileUploadProps> = ({
  onFileChange,
  resumeFromProfile,
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [localResumeFromProfile, setLocalResumeFromProfile] = useState<{
    filePath: string;
    fileSize: number;
    fileURL: string;
  } | null>(resumeFromProfile ?? null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalResumeFromProfile(null);
    const selectedFile = e.target.files ? e.target.files[0] : null;
    // const selectedFile = e.target.files?.[0] || null;
    if (selectedFile) {
      setFile(selectedFile);
      onFileChange(selectedFile);
    }
  };

  return (
    <Card shadow={false} className='border border-gray-300 pr-2 pl-4 py-4 '>
      <div className='flex flex-col space-y-2'>
        <div className=' relative flex flex-row justify-end items-center'>
          {(localResumeFromProfile && localResumeFromProfile?.fileURL) ||
          file ? (
            <div className='absolute right-1 top-0'>
              <label htmlFor='file' className='cursor-pointer'>
                <TbPencil size={25} color='#C4897B' />
              </label>
              <input
                type='file'
                id='file'
                className='hidden'
                accept='.pdf, .doc, .docx'
                onChange={handleFileChange}
                //   onChange={handleResumeChange}
              />
            </div>
          ) : (
            <div className='absolute right-1 top-0'>
              <label htmlFor='file' className='cursor-pointer'>
                <IoAdd size={25} color='#C4897B' />
              </label>
              <input
                type='file'
                id='file'
                className='hidden'
                accept='.pdf, .doc, .docx'
                onChange={handleFileChange}
              />
            </div>
          )}
        </div>
        <div className='flex space-x-4 w-full'>
          <div className='flex flex-col '>
            {localResumeFromProfile && localResumeFromProfile?.fileURL ? (
              <div className='flex flex-wrap space-x-4 items-center justify-center'>
                <HiDocument size={45} className=' hidden md:block' />
                <div className='flex flex-wrap flex-col space-y-1'>
                  <Link
                    href={localResumeFromProfile.fileURL}
                    target='_blank'
                    rel='noopener noreferrer'
                    className='flex flex-row items-center space-x-2 cursor-pointer'
                  >
                    <Typography className='font-Epiloguetext-sm text-[#7A7A84] font-normal'>
                      {localResumeFromProfile.filePath}
                    </Typography>

                    <FaExternalLinkAlt size={15} color='#C4897B' />
                  </Link>

                  <Typography className='font-Epiloguetext-sm text-[#7A7A84] font-meduim'>
                    {(localResumeFromProfile.fileSize / 1024).toFixed(2)} KB
                  </Typography>
                </div>
              </div>
            ) : file ? (
              // Handle display for newly uploaded file (without external link)
              <div className='flex flex-wrap space-x-4 items-center justify-center'>
                <HiDocument size={45} className='hidden md:block' />

                <div>
                  <Typography variant='paragraph' className='font-semibold'>
                    {file.name}
                  </Typography>
                  <Typography
                    variant='paragraph'
                    className='text-sm text-gray-500'
                  >
                    {(file.size / 1024).toFixed(2)} KB
                  </Typography>
                </div>
              </div>
            ) : (
              <Typography className='font-Epilogue flex justify-center items-center font-body text-base text-[#3D3D4B]'>
                No resume uploaded
              </Typography>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
};

export default FileUploadComponent;
