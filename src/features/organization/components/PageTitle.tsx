import { faArrowLeft, faClose } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconButton } from '@material-tailwind/react';
import React, { ReactElement, ReactNode } from 'react';

interface PageTitleProps {
  title: ReactNode;
  rightComponent?: ReactElement | null;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  hideBack?: boolean;
  isSideBar?: boolean;
  blockRightComponent?: boolean;
}

const PageTitle: React.FC<PageTitleProps> = ({
  title,
  rightComponent,
  onClick,
  hideBack,
  isSideBar,
  blockRightComponent,
}) => {
  return (
    <div
      className={`flex ${
        blockRightComponent ? 'flex-col md:flex-row ' : 'flex-row'
      } justify-between space-3 mb-1 md:pb-5`}
    >
      <h1 className='font-poppins font-black text-xl md:text-3xl text-neutrals100 flex items-center'>
        {/*back arrow */}
        {!hideBack && (
          <IconButton
            className='rounded-full md:mr-2'
            variant='text'
            size='lg'
            onClick={onClick}
            data-testid='back-button'
          >
            <FontAwesomeIcon size='xl' icon={faArrowLeft} />
          </IconButton>
        )}

        {isSideBar && (
          <IconButton
            className='rounded-full md:mr-2'
            variant='text'
            size='lg'
            onClick={onClick}
            data-testid='back-button'
          >
            <FontAwesomeIcon size='2xl' icon={faClose} />
          </IconButton>
        )}
        {title}
      </h1>
      {rightComponent}
    </div>
  );
};

export default PageTitle;
