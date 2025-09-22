import { Avatar, Typography } from '@material-tailwind/react';
import { ReactElement } from 'react';

interface OrgHeaderProps {
  name: string;
  details: ReactElement;
  logoUrl: string;
}

const OrgHeader: React.FC<OrgHeaderProps> = ({ name, details, logoUrl }) => {
  return (
    <div className='flex bg-white'>
      {/* logo */}
      <div className=' basis-1/4 flex justify-center items-center '>
        {/* <img src={logoUrl} alt='' className='w-10 h-10' /> */}
        <div className=' bg-blue-gray-100 rounded-lg h-11 w-11  flex justify-center items-center '>
          <Avatar src={logoUrl} size='sm' />
        </div>
      </div>

      {/* right side */}
      <div className=' basis-3/4 p-3'>
        <Typography variant='h5' className=' font-poppins'>
          {name}
        </Typography>

        <Typography className=' text-neutrals60 font-poppins'>
          {details}
        </Typography>
      </div>
    </div>
  );
};

export default OrgHeader;
