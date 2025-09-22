import React, { ReactElement } from 'react';

interface OrgInfoWithIconProps {
  title?: string | ReactElement;
  value?: string | ReactElement;
  icon?: ReactElement;
  valueStyle?: string;
  titleStyle?: string;
  truncate?: boolean;
}

const OrgDetailWithIcon: React.FC<OrgInfoWithIconProps> = ({
  title,
  value,
  icon,
  valueStyle,
  titleStyle,
  truncate,
}) => {
  return (
    <div className='flex flex-wrap md:flex-nowrap items-center space-x-3 font-poppins text-secondary'>
      <span>{icon}</span>
      <h3
        className={`${
          titleStyle ? titleStyle : 'font-normal text-xs sm:text-base'
        }`}
      >
        {title}
      </h3>
      {value && (
        <p
          className={`${
            valueStyle ? valueStyle : 'font-semibold text-xs sm:text-base'
          } ${truncate ? 'truncate' : '[overflow-wrap:anywhere]'}`}
          data-testid={`${title
            ?.toString()
            .toLowerCase()
            .split(' ')
            .join('-')}`}
        >
          {value}
        </p>
      )}
    </div>
  );
};

export default OrgDetailWithIcon;
