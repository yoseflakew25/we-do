'use client';

import React, { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { FaFileUpload } from 'react-icons/fa';
import { FaFilePdf } from 'react-icons/fa6';
import { GoLinkExternal } from 'react-icons/go';
import { IoIosClose } from 'react-icons/io';
import { toast } from 'react-toastify';

interface FileUploadProps {
  // eslint-disable-next-line unused-imports/no-unused-vars
  onFilesChange: (files: File[]) => void;
  // eslint-disable-next-line unused-imports/no-unused-vars
  onDeleteFile?: (id: string) => void;
  initialFiles?: File[];
  initialUrls?: { id: string; name: string; url: string }[];
}
const FileUpload: React.FC<FileUploadProps> = ({
  onFilesChange,
  initialFiles,
  initialUrls,
  onDeleteFile,
}) => {
  const [files, setFiles] = useState<File[]>(initialFiles || []);
  const [deletedFileIds, setDeletedFileIds] = useState<string[]>([]); // new state
  const handleDeleteFile = (id: string) => {
    setDeletedFileIds((prev) => [...prev, id]);
    if (onDeleteFile) {
      onDeleteFile(id);
    }
  };
  const onDrop = (acceptedFiles: File[]) => {
    const filteredFiles = acceptedFiles.filter((file) => {
      const isValidType = [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      ].includes(file.type);
      const isLessThan5MB = file.size <= 5 * 1024 * 1024;

      if (!isValidType) {
        toast.error('Only PDF and Word documents are allowed.', {
          autoClose: false,
          theme: 'light',
        });
      }

      if (!isLessThan5MB) {
        toast.error('File size exceeds the 5MB limit.', {
          autoClose: false,
          theme: 'light',
        });
      }

      return isValidType && isLessThan5MB;
    });

    const allFiles = [...files, ...filteredFiles];
    setFiles(allFiles);
    onFilesChange(allFiles);
  };

  const removeFile = (index: number) => {
    const newFiles = [...files];
    newFiles.splice(index, 1);
    setFiles(newFiles);
    onFilesChange(newFiles);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
  });

  return (
    <div className='p-4  w-[70%] lg:w-[50%] h-full flex flex-col items-center justify-center'>
      <div
        {...getRootProps()}
        className=' w-full h-full border-dashed border-2 border-primary rounded-2xl p-3 sm:px-5 sm:py-7 text-center'
      >
        <input type='file' multiple {...getInputProps()} />
        {isDragActive ? (
          <p className='font-poppins text-sm sm:text-base text-bgPrimary'>
            Drop the files here ...
          </p>
        ) : (
          <div className='flex flex-col space-x-4 justify-center items-center'>
            <FaFilePdf className='h-5 w-5 text-bgPrimary' />
            <p className='  text-sm sm:text-base text-bgPrimary'>
              Click to select files
            </p>
            <p className=' text-sm sm:text-base text-tertiary'>
              PDF or DOC/DOCX (max. 5MB)
            </p>
          </div>
        )}
      </div>
      <div>
        <div className='grid gap-2'>
          {initialUrls
            ?.filter((file) => !deletedFileIds.includes(file.id))
            .map((file, index) => (
              <div key={index} className='bg-white shadow-md rounded-lg p-4 '>
                <div className='flex items-center justify-between'>
                  <div className='flex items-center gap-1'>
                    <GoLinkExternal size={30} className='mr-2 text-bgPrimary' />
                    <a
                      href={file.url}
                      target='_blank'
                      rel='noopener noreferrer'
                    >
                      <p className='font-medium font-poppins text-sm sm:text-base  text-bgPrimary'>
                        {file.name}
                      </p>
                    </a>
                  </div>
                  <button
                    className='bg-white p-1 hover:bg-gray-200 shadow-none rounded-full'
                    onClick={(event) => {
                      event.preventDefault();
                      handleDeleteFile(file.id);
                    }}
                  >
                    <IoIosClose className='h-6 w-6 text-bgPrimary' />
                  </button>
                </div>
              </div>
            ))}
          {files.map((file, index) => (
            <div key={index} className='bg-white shadow-md rounded-lg p-4 '>
              <div className='flex items-center justify-between'>
                <div className='flex items-center'>
                  <FaFileUpload size={30} className='mr-2 text-bgPrimary' />
                  <a
                    href={URL.createObjectURL(file)}
                    target='_blank'
                    rel='noopener noreferrer'
                  >
                    <p className='font-medium font-poppins text-sm sm:text-base text-bgPrimary'>
                      {file.name}
                    </p>
                  </a>
                </div>
                <button
                  className='bg-white p-1 hover:bg-gray-200 shadow-none rounded-full'
                  onClick={(event) => {
                    event.preventDefault();
                    removeFile(index);
                  }}
                >
                  <IoIosClose className='h-6 w-6 text-bgPrimary' />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FileUpload;
