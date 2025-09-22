import { Alert, Typography } from '@material-tailwind/react';
import { ComponentProps, ReactNode } from 'react';
import { FieldErrors, FieldValues } from 'react-hook-form';
import { AiFillInfoCircle } from 'react-icons/ai';

interface FormErrorsAlertProps<T extends FieldValues>
  extends Omit<ComponentProps<typeof Alert>, 'children'> {
  errors: FieldErrors<T>;
}

const AllFormErrorsAlert = <T extends Record<string, any>>({
  errors,
  ...alertProps
}: FormErrorsAlertProps<T>) => {
  const parseError = (field: string): ReactNode => {
    const error = errors[field];
    return error?.message ? error.message.toString() : undefined;
  };

  if (Object.keys(errors).length == 0) {
    return undefined;
  }

  return (
    <Alert color='red' icon={<AiFillInfoCircle />} {...alertProps}>
      <Typography className='font-medium'>
        Looks like there are some things to fix
      </Typography>
      <ul className='mt-2 ml-2 list-inside list-disc'>
        {Object.keys(errors).map((field) => {
          return (
            <li key={field}>
              {field}: {parseError(field)}
            </li>
          );
        })}
      </ul>
    </Alert>
  );
};

export default AllFormErrorsAlert;
