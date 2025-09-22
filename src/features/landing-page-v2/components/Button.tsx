import { Button } from '@material-tailwind/react';

interface LandingButtonProps {
  text: string;
  fill: boolean;
}
const LandingButton = ({ text, fill }: LandingButtonProps) => {
  return (
    <Button
      className={`w-fit font-poppins capitalize rounded-full lg:px-6 lg:py-3 py-1.5 px-4 font-light lg:text-base ${
        fill
          ? 'bg-[#C4897B] text-white'
          : 'border border-[#C4897B] text-[#C4897B] bg-transparent'
      } `}
    >
      {text}
    </Button>
  );
};

export default LandingButton;
