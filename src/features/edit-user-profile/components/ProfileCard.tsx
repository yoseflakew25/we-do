import { Card, IconButton } from '@material-tailwind/react';
import { ReactNode } from 'react';
import { TbPencil } from 'react-icons/tb';

interface ProfileCardProps {
  children: ReactNode;
  handleButtonClick?: () => void;
  style?: string;
  icon?: ReactNode;
  handleIconClick?: () => void;
}

const ProfileCard = ({
  children,
  handleButtonClick,
  style,
  icon,
  handleIconClick,
}: ProfileCardProps) => {
  return (
    <Card shadow={false} className={`flex p-5 flex-col ${style}`}>
      {/* Edit button */}
      <div className='!absolute flex top-3 right-3'>
        {icon && (
          <IconButton
            className='bg-white p-0 shadow-none hover:bg-transparent hover:shadow-none rounded-full'
            onClick={handleIconClick}
          >
            {icon}
          </IconButton>
        )}
        <IconButton
          className='p-0 bg-white shadow-none hover:!bg-transparent hover:!shadow-none rounded-full'
          onClick={handleButtonClick}
        >
          <TbPencil size={25} color='#C4897B' />
        </IconButton>
      </div>
      {children}
    </Card>
  );
};

export default ProfileCard;
