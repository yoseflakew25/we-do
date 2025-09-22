import LocaleSwitcher from '@/components/LocaleSwitcher';
import { SidebarListItem } from '@/features/organization/components/Sidebar';
import { Button, IconButton } from '@material-tailwind/react';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { FiAlignJustify, FiX } from 'react-icons/fi';
import { IoLogInSharp } from 'react-icons/io5';
import { SiGnuprivacyguard } from 'react-icons/si';

interface NavBarProps {
  rightComponent?: React.ReactNode;
  leftComponent?: React.ReactNode;
  userSettings?: React.ReactNode;
}

const NavBar: React.FC<NavBarProps> = ({ userSettings }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState<boolean>(false);

  const t = useTranslations('volunteerSide.navBar');
  const pathname = usePathname().split('/').pop() || null;

  const toggleHamburger = () => {
    setIsOpen((prev) => !prev);
  };

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 5);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = useMemo(
    () => [
      {
        name: `${t('findOpportunities')}`,
        href: '/talent/opportunities',
        right: false,
      },
      {
        name: `${t('browseOrganizations')}`,
        href: '/talent/organizations',
        right: false,
      },
      {
        name: `${t('aboutUs')}`,
        href: '/about-us',
        right: false,
      },
      {
        name: `${t('logIn')}`,
        href: '/login',
        icon: <IoLogInSharp size={20} />,
        right: true,
      },
      {
        name: `${t('signUp')}`,
        href: '/signup',
        icon: <SiGnuprivacyguard size={20} />,
        right: true,
      },
    ],
    [t] // This is the dependency array
  );
  const loginInfo = navItems[3];
  const signinInfo = navItems[4];

  const renderNavItems = (items: typeof navItems) =>
    items.map((option) => (
      <SidebarListItem
        key={option.href}
        segment={pathname}
        expanded={true}
        {...option}
        className='text-bgPrimary hover:text-bgPrimary py-2'
        onClick={toggleHamburger}
        icon={option.icon} // Add this line
      />
    ));

  return (
    <div className='mb-16'>
      {/* Small screen */}
      <nav
        className={`md:hidden fixed top-0 py-3 left-0 w-screen z-50 transition-all duration-300 ${
          scrolled
            ? 'bg-white/20 dark:bg-gray-900/20 backdrop-blur-md border-b border-white/20 dark:border-white/10 shadow-sm'
            : 'bg-transparent'
        }`}
      >
        <div className='flex justify-between space-x-4 items-center'>
          <div className='flex gap-x-4 px-5 items-center'>
            <IconButton
              color='amber'
              size='md'
              variant='text'
              onClick={toggleHamburger}
              className='text-bgPrimary xl:hidden'
              aria-label='Toggle menu'
            >
              {isOpen ? <FiX size={30} /> : <FiAlignJustify size={30} />}
            </IconButton>

            <Link href={userSettings ? '/talent/opportunities' : '/'}>
              <Image
                width={200}
                height={200}
                src='/assets/Hoopoe navbar logo.png'
                alt='Logo'
                className='h-8 object-contain'
              />
            </Link>
          </div>
          <div className='px-4'>{userSettings}</div>
        </div>

        {/* Small screen menu */}
        {isOpen && (
          <div className='w-screen flex-col gap-y-3 px-4 pb-3 bg-white/10 dark:bg-gray-900/10 backdrop-blur-md border-t border-white/20 dark:border-white/10 shadow-sm'>
            {renderNavItems(
              userSettings ? navItems.filter(({ right }) => !right) : navItems
            )}
            <div className='px-5 py-2 w-1/2'>
              <LocaleSwitcher />
            </div>
          </div>
        )}
      </nav>

      {/* Large screen */}
      <nav
        className={`hidden md:block fixed top-0 left-0 h-fit w-full z-50 transition-all duration-300 ${
          scrolled
            ? 'bg-white/20 dark:bg-gray-900/20 backdrop-blur-md border-b border-white/20 dark:border-white/10 shadow-sm'
            : 'bg-transparent'
        }`}
      >
        <div className='container mx-auto flex px-8 py-4 justify-between items-center'>
          <div className='flex gap-3 justify-center items-center'>
            <IconButton
              color='amber'
              size='sm'
              variant='text'
              onClick={toggleHamburger}
              className='text-bgPrimary xl:hidden'
              aria-label='Toggle menu'
            >
              {isOpen ? <FiX size={30} /> : <FiAlignJustify size={30} />}
            </IconButton>
            <Link href={userSettings ? '/talent/opportunities' : '/'}>
              <Image
                width={200}
                height={200}
                src='/assets/Hoopoe navbar logo.png'
                alt='Logo'
                className='h-8 object-contain'
              />
            </Link>
          </div>

          <div className='hidden xl:flex items-center gap-x-2'>
            {renderNavItems(
              userSettings
                ? navItems.filter(({ right }) => !right)
                : navItems.filter(({ right }) => !right)
            )}
          </div>

          <div className='flex gap-x-2 items-center'>
            {!userSettings && (
              <div className='flex gap-x-2 items-center'>
                <Link href={loginInfo.href}>
                  <Button
                    variant='outlined'
                    color='amber'
                    className='rounded-full font-inherit capitalize text-bgPrimary hover:bg-primary hover:text-white w-fit whitespace-nowrap'
                  >
                    {loginInfo.name}
                  </Button>
                </Link>
                <Link href={signinInfo.href}>
                  <Button
                    variant='filled'
                    color='amber'
                    className='rounded-full font-inherit capitalize hover:text-bgPrimary bg-primary hover:bg-transparent border hover:border-primary text-white w-fit whitespace-nowrap'
                  >
                    {signinInfo.name}
                  </Button>
                </Link>
                <div className='hidden xl:block'>
                  <LocaleSwitcher />
                </div>
              </div>
            )}
            {userSettings && (
              <div className='flex gap-x-4 self-center'>
                {userSettings}
                <LocaleSwitcher />
              </div>
            )}
          </div>
        </div>
      </nav>
    </div>
  );
};

export default NavBar;
