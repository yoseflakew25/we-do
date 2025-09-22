import { Button, Spinner } from '@material-tailwind/react';
import React, { ComponentProps } from 'react';

interface LoadingButtonProps extends ComponentProps<typeof Button> {
  loading?: boolean;
}

const LoadingButton: React.FC<LoadingButtonProps> = ({
  loading,
  ...buttonProps
}) => {
  if (loading) {
    return (
      <Button
        {...buttonProps}
        className={`${buttonProps.className} flex justify-center content-center`}
        disabled
      >
        <Spinner
          color={buttonProps.color !== 'white' ? buttonProps.color : undefined}
        />
      </Button>
    );
  }
  return <Button {...buttonProps} />;
};

export default LoadingButton;
