import { OrgFormData } from '@/app/api/types';
import { faImage } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Avatar, IconButton, Typography } from '@material-tailwind/react';
import { useTranslations } from 'next-intl';
import React from 'react';
import { useDropzone, FileRejection } from 'react-dropzone';
import { FieldErrors } from 'react-hook-form';
import { IoIosClose } from 'react-icons/io';

interface DropzoneProps {
  onDrop: (_accepted: File[], _rejected: FileRejection[]) => void;
  preview: string | ArrayBuffer | null;
  setPreview: React.Dispatch<React.SetStateAction<string | ArrayBuffer | null>>;
  errors: FieldErrors<OrgFormData>;
}

function Dropzone({ onDrop, preview, setPreview, errors }: DropzoneProps) {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: (acceptedFiles, fileRejections) => {
      onDrop(acceptedFiles, fileRejections);
    },
  });

  const t = useTranslations(
    'OrganizationSignupPage.organizationDetailsSection'
  );

  const removeLogo = () => {
    setPreview(null);
  };
  return (
    <div className='flex sm:flex-row space-x-5 items-center justify-center flex-row-reverse cursor-pointer'>
      {preview && (
        <div className='px-3 relative'>
          <Avatar
            withBorder
            className='border-secondary p-1 w-25 h-25 sm:w-40 sm:h-40'
            variant='rounded'
            size='xl'
            alt='logo'
            src={preview as string}
          />
          <IconButton
            className='!absolute -top-1 right-2 p-0 text-secondary hover:bg-transparent active:bg-transparent'
            variant='text'
            ripple={false}
            onClick={removeLogo}
          >
            <IoIosClose size={35} />
          </IconButton>
        </div>
      )}
      <div>
        <div
          {...getRootProps()}
          className='border-dashed border-2 border-primary rounded-2xl p-3 sm:px-5 sm:py-7 text-center'
          // onBlur={handleValidation} // Validate when the dropzone loses focus
        >
          <input {...getInputProps()} />
          {isDragActive ? (
            <p className='font-medium text-sm sm:text-base text-neutrals80'>
              Drop the files <span className='text-bgPrimary'>here...</span>
            </p>
          ) : (
            <div>
              <FontAwesomeIcon
                icon={faImage}
                aria-hidden='true'
                className='h-5 w-5 text-bgPrimary'
              />
              <p className='font-medium text-sm sm:text-base text-tertiary'>
                {t.rich('organizationLogo.uploadImageAreaText', {
                  upload: (chunks) => (
                    <span className='text-bgPrimary'>{chunks}</span>
                  ),
                  imageForm: (chunks) => (
                    <span className='block text-neutrals60'>{chunks}</span>
                  ),
                })}
              </p>
            </div>
          )}
        </div>
        {errors.logo?.message && (
          <Typography
            variant='small'
            color='red'
            className='font-normal font-poppins text-center mt-1'
          >
            {errors.logo?.message}
          </Typography>
        )}
      </div>
    </div>
  );
}

export default Dropzone;
