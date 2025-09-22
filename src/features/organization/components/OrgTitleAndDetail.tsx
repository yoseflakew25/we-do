import React, { ReactElement } from 'react';

interface OrgTitleWIthIconAndDetailProps {
  title: string;
  detail?: string;
  detailElement?: ReactElement;
  className?: string;
}

const OrgTitleAndDetail: React.FC<OrgTitleWIthIconAndDetailProps> = ({
  title,
  detail,
  detailElement,
  className,
}) => {
  return (
    <div className={` py-1 px-4 sm:py-3  ${className}`}>
      <h3 className='font-bold font-poppins text-base sm:text-xl text-primary text-left pb-2 sm:pb-4'>
        {title}
      </h3>
      <p className='font-normal capitalize font-poppins text-xs sm:text-base text-tertiary'>
        {detail}
      </p>
      {detailElement}
    </div>
  );
};

export default OrgTitleAndDetail;
