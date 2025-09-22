import React from 'react';

interface InputWithLabelProps {
  label: string;
  required?: boolean;
}

const FormLabel: React.FC<InputWithLabelProps> = ({
  label,
  required = false,
}) => {
  return (
    <div>
      <label
        className='block text-secondary text-lg not-italic font-medium'
        htmlFor='fullName'
      >
        {label}
        {required && <span className='text-redAccent'>*</span>}
      </label>
    </div>
  );
};

export default FormLabel;
