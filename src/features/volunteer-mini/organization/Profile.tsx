import { tagColors } from '../opportunities/OpportunityDetails';
import { OrganizationProfile } from '@/app/api/types';
import { Typography, Chip } from '@material-tailwind/react';
import { HiOutlineEnvelope, HiOutlinePhone } from 'react-icons/hi2';

interface ProfileProps {
  orgDetail: OrganizationProfile;
}
const Profile: React.FC<ProfileProps> = ({ orgDetail }) => {
  return (
    <div className='bg-white flex flex-col gap-4'>
      {/* About */}
      <div className='flex flex-col gap-2'>
        <Typography variant='h5' className=' font-poppins text-black'>
          About
        </Typography>
        <Typography variant='paragraph' className=' font-poppins'>
          {orgDetail.description}
        </Typography>
      </div>
      {/* Mission */}
      <div className='flex flex-col gap-2'>
        <Typography variant='h5' className=' font-poppins  text-black'>
          Mission
        </Typography>
        <Typography variant='paragraph' className=' font-poppins'>
          {orgDetail.mission}
        </Typography>
      </div>

      {/* Area of cause */}
      <div className=' flex gap-2 overflow-x-auto  p-2 '>
        {orgDetail.orgArea?.map((item, index) => {
          const currentColor = tagColors[index % tagColors.length];

          return (
            <Chip
              key={index}
              variant='outlined'
              color={currentColor}
              className='rounded-full'
              value={item}
            />
          );
        })}
      </div>
      {/* contacts */}
      <div className='flex flex-col gap-2'>
        <Typography variant='h5' className=' font-poppins  text-black'>
          Contact
        </Typography>
        <div className='flex gap-4  items-center '>
          <HiOutlineEnvelope className=' text-black' size={20} />

          <p className=' text-lg'>{orgDetail.email}</p>
        </div>
        <div className='flex gap-4 items-center'>
          <HiOutlinePhone className=' text-black ' size={20} />
          <p className=' text-lg'>{orgDetail.primaryPhone}</p>
        </div>
      </div>
    </div>
  );
};

export default Profile;
