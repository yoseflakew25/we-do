import { Button, IconButton } from '@material-tailwind/react';
import React, { ReactElement } from 'react';

interface SuccessPopupProps {
  title: string;
  subTitle: string;
  buttonText: string;
  onButtonClick: () => void;
  icon?: ReactElement;
}

const SuccessPopup: React.FC<SuccessPopupProps> = ({
  title,
  subTitle,
  buttonText,
  onButtonClick,
  icon,
}) => {
  const [showModal, setShowModal] = React.useState(true);

  const closeModal = () => {
    onButtonClick();
    setShowModal(false);
  };

  const handleButtonClick = () => {
    closeModal();
  };

  return (
    <>
      {showModal ? (
        <>
          <div className='justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none'>
            <div className='relative my-6 mx-auto max-w-3xl'>
              <div className='rounded-2xl shadow-lg relative flex flex-col w-full bg-white p-3'>
                <IconButton
                  variant='text'
                  className='ml-auto'
                  onClick={closeModal}
                >
                  <span className='text-[28px] text-neutrals60'>×</span>
                </IconButton>
                <div className='flex flex-col items-center gap-5 border-solid px-5'>
                  <div className='flex items-center justify-center bg-lightGreen rounded-full w-[150px] h-[150px]'>
                    <div className='flex justify-center items-center bg-green rounded-full w-[110px] h-[110px]'>
                      {icon ? (
                        icon
                      ) : (
                        <svg
                          xmlns='http://www.w3.org/2000/svg'
                          width='46'
                          height='47'
                          viewBox='0 0 46 47'
                          fill='none'
                        >
                          <path
                            d='M22.9997 4.29395C12.4388 4.29395 3.83301 12.8998 3.83301 23.4606C3.83301 34.0214 12.4388 42.6273 22.9997 42.6273C33.5605 42.6273 42.1663 34.0214 42.1663 23.4606C42.1663 12.8998 33.5605 4.29395 22.9997 4.29395ZM32.1613 19.0523L21.2938 29.9198C21.0255 30.1881 20.6613 30.3414 20.278 30.3414C19.8947 30.3414 19.5305 30.1881 19.2622 29.9198L13.838 24.4956C13.2822 23.9398 13.2822 23.0198 13.838 22.4639C14.3938 21.9081 15.3138 21.9081 15.8697 22.4639L20.278 26.8723L30.1297 17.0206C30.6855 16.4648 31.6055 16.4648 32.1613 17.0206C32.7172 17.5764 32.7172 18.4773 32.1613 19.0523Z'
                            fill='white'
                          />
                        </svg>
                      )}
                    </div>
                  </div>
                  <div>
                    <p className='text-neutrals100 text-3xl font-black mb-6 text-center'>
                      {title}
                    </p>
                    <p className='text-neutrals80 text-base font-epilogue font-normal text-center'>
                      {subTitle}
                    </p>
                  </div>
                  <div className='align-bottom pb-10 pt-5'>
                    <Button
                      color='amber'
                      className='bg-primary rounded-full px-10'
                      size='lg'
                      onClick={handleButtonClick}
                    >
                      {buttonText}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className='opacity-50 fixed inset-0 z-40 bg-black'></div>
        </>
      ) : null}
    </>
  );
};

export default SuccessPopup;
