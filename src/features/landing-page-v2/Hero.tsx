import LandingButton from './components/Button';
import Paragraph from './components/ui/Paragraph';
import Title from './components/ui/Title';
import Image from 'next/image';

const Hero = () => {
  return (
    <div className='flex flex-col sm:flex-row w-screen items-center justify-between gap-8 md:gap-16 bg-neutral20 p-5 md:p-10 lg:p-14 xl:p-28'>
      <Image
        src='/assets/aid.png'
        alt='Hero Image'
        width={300}
        height={400}
        layout='responsive'
        className='rounded-3xl'
      />
      <div className='flex flex-col gap-3 w-fit self-center'>
        <Title text1='Hero of the week' />
        <span className='max-h-56 overflow-y-scroll'>
          <Paragraph
            text1="I have been volunterring for a while now and I love every bit of it as
          it gives me this self satisfaction that I wouldn't find anywhere else.I have been volunterring for a while now and I love every bit of it as
          it gives me this self satisfaction that I wouldn't find anywhere else.I have been volunterring for a while now and I love every bit of it as
          it gives me this self satisfaction that I wouldn't find anywhere else."
          />
        </span>

        <LandingButton text='View Profile' fill={true} />
      </div>
    </div>
  );
};
export default Hero;
