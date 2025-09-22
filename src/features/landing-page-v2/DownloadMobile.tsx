import Paragraph from './components/ui/Paragraph';
import Title from './components/ui/Title';
import { useTranslations } from 'next-intl';
import Image from 'next/image';

const androidLink =
  'https://play.google.com/store/apps/details?id=org.a2sv.akil_mobile';
const iosLink =
  'https://play.google.com/store/apps/details?id=org.a2sv.akil_mobile';

const DownloadMobile = () => {
  const t = useTranslations('LandingPage.DownloadMobile');

  return (
    <section
      id='download-app'
      aria-labelledby='download-app-title'
      className='relative w-full overflow-hidden py-16'
    >
      <div className='relative mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8'>
        <div className='relative overflow-hidden rounded-[3rem] bg-gradient-to-br from-primary/90 to-[#F9F3F2] dark:from-gray-800/90 dark:to-gray-900/90 shadow-2xl'>
         

          <div className='relative grid grid-cols-1 items-end gap-8 p-8 sm:p-10 md:grid-cols-2 md:gap-12 md:p-12 lg:p-16'>
            {/* Text + Buttons */}
            <div className='z-10 text-center md:text-left md:pb-20'>
              <h2 id='download-app-title' className='mb-4'>
                <Title text1={t('title')} />
              </h2>
              <div className='mx-auto mb-8 max-w-xl text-lg text-gray-600 dark:text-gray-300 md:mx-0 md:mb-12'>
                <Paragraph text1={t('description')} />
              </div>

              <div className='flex flex-col items-center justify-center space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0 md:justify-start'>
                <a
                  href={androidLink}
                  target='_blank'
                  rel='noopener noreferrer'
                  aria-label='Download on Google Play'
                  className='inline-block transition-all duration-200 hover:scale-105 active:scale-95'
                >
                  <Image
                    src='/assets/Android.png'
                    width={200}
                    height={60}
                    className='h-auto w-40 sm:w-48 md:w-52'
                    alt='Get it on Google Play'
                    priority={false}
                  />
                </a>

                <a
                  href={iosLink}
                  target='_blank'
                  rel='noopener noreferrer'
                  aria-label='Download on the App Store'
                  className='inline-block transition-all duration-200 hover:scale-105 active:scale-95'
                >
                  <Image
                    src='/assets/IOS.png'
                    width={190}
                    height={60}
                    className='h-auto w-36 sm:w-44 md:w-48'
                    alt='Download on the App Store'
                    priority={false}
                  />
                </a>
              </div>
            </div>

            {/* Phone mockup - positioned at bottom */}
            <div className='relative h-full md:absolute md:bottom-0 md:right-16 md:flex md:items-end md:justify-end'>
              <div className='relative mx-auto w-full max-w-xs md:mx-0 md:max-w-md lg:max-w-lg'>
                <Image
                  src='/assets/akil-mokeup.png'
                  width={620}
                  height={620}
                  alt='Akil mobile application preview'
                  className='h-auto w-full drop-shadow-2xl md:translate-y-8 lg:translate-y-12'
                  priority={false}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DownloadMobile;
