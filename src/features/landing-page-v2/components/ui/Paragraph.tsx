import { Typography } from '@material-tailwind/react';

interface ParagraphProps {
  text1: string;
  text2?: string;
}
const Paragraph = ({ text1, text2 }: ParagraphProps) => {
  return (
    <Typography className='font-poppins text-grey font-normal text-sm md:text-base'>
      {text1} <br /> {text2}
    </Typography>
  );
};

export default Paragraph;
