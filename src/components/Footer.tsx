import { Typography, IconButton } from '@material-tailwind/react';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import {
  BiLogoLinkedin,
  BiLogoInstagram,
  BiLogoTwitter,
  BiLogoEdge,
  BiLogoYoutube,
  BiLogoFacebook,
} from 'react-icons/bi';

export const Footer: React.FC = () => {
  const t = useTranslations('AboutUsPage');
  const socials = [
    {
      href: 'https://www.linkedin.com/company/a2sv',
      icon: <BiLogoLinkedin size={18} />,
    },
    {
      href: 'https://www.instagram.com/a2sv_org/',
      icon: <BiLogoInstagram size={18} />,
    },
    { href: 'https://twitter.com/A2_SV', icon: <BiLogoTwitter size={18} /> },
    { href: 'https://a2sv.org/', icon: <BiLogoEdge size={18} /> },
    {
      href: 'https://youtube.com/@a2sv-africatosiliconvalley942',
      icon: <BiLogoYoutube size={18} />,
    },
    {
      href: 'https://www.facebook.com/profile.php?id=100085473798621',
      icon: <BiLogoFacebook size={18} />,
    },
  ];
  return (
    <footer className='bg-tertiary shadow-lg rounded-lg py-8 mt-5  dark:bg-gray-800'>
      <div className='w-full mx-auto container md:flex md:items-center md:justify-between'>
        <Typography
          variant='paragraph'
          className='text-gray-800 text-center md:text-left my-2'
        >
          &copy; {new Date().getFullYear()}{' '}
          <Link href='/' className='hover:underline'>
            Masar&trade;
          </Link>
          . {t('copyright')}
        </Typography>
        <div className='flex gap-2 md:px-3 justify-center'>
          {socials.map(({ href, icon }) => (
            <Link key={href} href={href} target='_blank'>
              <IconButton
                variant='outlined'
                color='amber'
                className='rounded-full border-secondary'
              >
                {icon}
              </IconButton>
            </Link>
          ))}
        </div>
      </div>
    </footer>
  );
};
