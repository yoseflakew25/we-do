import Paragraph from './ui/Paragraph';
import { Typography } from '@material-tailwind/react';
import { motion } from 'framer-motion';

interface IdealVolunteersCardProps {
  src: string;
  title: string;
  description: string;
}
const IdealVolunteersCard: React.FC<IdealVolunteersCardProps> = ({
  src,
  title,
  description,
}) => {
  return (
    <motion.div
      whileHover={{ scale: 1.1 }}
      transition={{
        type: 'spring',
        stiffness: 300,
        damping: 20,
      }}
      className='flex bg-[#FAFAFA] p-8 rounded-[32px] flex-col text-center items-center justify-center gap-3 h-full'
    >
      <div className='bg-[#F4F4F5] p-4 gap-2.5 rounded-full w-20 h-20 flex items-center justify-center flex-shrink-0'>
        <img src={src} alt='Icon' className='w-14 h-14' />
      </div>
      <Typography className='font-poppins font-normal text-lg lg:text-2xl px-14'>
        {title}
      </Typography>
      <Paragraph text1={description} />
    </motion.div>
  );
};
export default IdealVolunteersCard;
