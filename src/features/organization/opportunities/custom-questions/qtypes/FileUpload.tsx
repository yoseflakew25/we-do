import {
  updateFileUploadSettings,
  updateAllowedFileTypes,
  updateMaxFiles,
  updateMaxFileSize,
} from '@/features/organization/org-side-custom-questions-slice';
import { Checkbox, Switch } from '@material-tailwind/react';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

interface FileUploadProps {
  questionIndex: number;
  viewOnly?: boolean;
}

const FileUpload = ({ questionIndex, viewOnly = false }: FileUploadProps) => {
  const dispatch = useDispatch();
  const question = useSelector(
    (state: any) => state.orgSideCustomQuestions.questions[questionIndex]
  );
  const [showFileTypes, setShowFileTypes] = useState(
    question.allowedFileTypes?.length > 0
  );

  const handleFileTypeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = event.target;
    const newFileTypes = checked
      ? [...(question.allowedFileTypes || []), value]
      : (question.allowedFileTypes || []).filter(
          (type: string) => type !== value
        );
    dispatch(
      updateFileUploadSettings({
        allowedFileTypes: newFileTypes,
        index: 0,
      })
    );
  };

  const handleMaxFilesChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const maxFiles = Number(event.target.value);
    dispatch(
      updateMaxFiles({
        maxFiles: maxFiles,
        index: 0,
      })
    );
  };

  const handleMaxFileSizeChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const maxFileSize = Number(event.target.value);
    dispatch(
      updateMaxFileSize({
        maxFileSize: maxFileSize,
        index: 0,
      })
    );
  };

  const handleShowFileTypesChange = (checked: boolean) => {
    setShowFileTypes(checked);
    if (!checked) {
      dispatch(
        updateAllowedFileTypes({
          allowedFileTypes: [],
          index: 0,
        })
      );
    }
  };

  const fileTypes1 = ['Document', 'Spreadsheet', 'PDF', 'Presentation'];
  const fileTypes2 = ['Video', 'Drawing', 'Image', 'Audio'];

  return (
    <div className='file-upload p-4  rounded-lg  bg-white'>
      <div className='flex items-center justify-between'>
        <div className='flex items-center space-x-6'>
          <label className='block text-sm font-medium text-gray-700 mb-2'>
            Allow only specific file types
          </label>
          {!viewOnly && (
            <Switch
              crossOrigin={undefined}
              color='amber'
              checked={showFileTypes}
              onChange={(e) => handleShowFileTypesChange(e.target.checked)}
            />
          )}

          {viewOnly && (
            <span className='ml-2'>{showFileTypes ? 'Yes' : 'No'}</span>
          )}
        </div>
      </div>

      {showFileTypes && (
        <div className='flex space-x-4'>
          <div>
            {fileTypes1.map((type) => (
              <div key={type} className='flex items-center mb-2'>
                {!viewOnly ? (
                  <Checkbox
                    crossOrigin={undefined}
                    id={type}
                    value={type}
                    onChange={handleFileTypeChange}
                    label={type}
                    color='amber'
                    checked={question.allowedFileTypes?.includes(type)}
                  />
                ) : (
                  <div className='flex items-center'>
                    <span>
                      {question.allowedFileTypes?.includes(type) ? '✓' : '✗'}
                    </span>
                    <label className='ml-2'>{type}</label>
                  </div>
                )}
              </div>
            ))}
          </div>
          <div>
            {fileTypes2.map((type) => (
              <div key={type} className='flex items-center mb-2'>
                {!viewOnly ? (
                  <Checkbox
                    crossOrigin={undefined}
                    id={type}
                    value={type}
                    onChange={handleFileTypeChange}
                    label={type}
                    color='amber'
                    checked={question.allowedFileTypes?.includes(type)}
                  />
                ) : (
                  <div className='flex items-center'>
                    <span>
                      {question.allowedFileTypes?.includes(type) ? '✓' : '✗'}
                    </span>
                    <label className='ml-2'>{type}</label>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      <div className='flex items-center justify-between mt-4'>
        <div className='flex items-center space-x-6'>
          <label className='block text-sm font-medium text-gray-700 mr-4'>
            Maximum Number of Files
          </label>
          <select
            onChange={handleMaxFilesChange}
            value={question.maxFiles}
            disabled={viewOnly}
            className='form-select block w-20 px-2 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-lightBlue-500 focus:border-lightBlue-500'
          >
            {[1, 5, 10, 20].map((num) => (
              <option key={num} value={num}>
                {num}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className='flex items-center justify-between mt-4'>
        <div className='flex items-center space-x-6'>
          <label className='block text-sm font-medium text-gray-700 mr-4'>
            Maximum File Size (MB)
          </label>
          <select
            onChange={handleMaxFileSizeChange}
            value={question.maxFileSize}
            disabled={viewOnly}
            className='form-select block w-20 px-2 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-lightBlue-500 focus:border-lightBlue-500'
          >
            {[1, 5, 10, 20, 50].map((size) => (
              <option key={size} value={size}>
                {size} MB
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};

export default FileUpload;
