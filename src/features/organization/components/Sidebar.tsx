'use client';

import HorizontalDivider from '@/components/HorizontalDivider';
import LocaleSwitcher from '@/components/LocaleSwitcher';
import { useAvatarImage } from '@/hook';
import {
  Avatar,
  Card,
  IconButton,
  List,
  ListItem,
  ListItemPrefix,
  Tooltip,
  Typography,
} from '@material-tailwind/react';
import { useSession, signOut } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';
import { useSelectedLayoutSegment } from 'next/navigation';
import React, { ReactNode } from 'react';
import { AiFillCaretLeft, AiFillCaretRight } from 'react-icons/ai';
import { FiAlignJustify, FiPower, FiX } from 'react-icons/fi';

interface SidebarProps {
  isMobile: boolean;
  expanded: boolean;
  toggleExpanded: () => void;
  sidebarOptions: Array<{
    name: string;
    href: string;
    icon: JSX.Element;
    bottom?: boolean;
  }>;
  className?: string;
}
const Sidebar: React.FC<SidebarProps> = ({
  isMobile,
  expanded,
  toggleExpanded,
  sidebarOptions,
  className,
}) => {
  const segment = useSelectedLayoutSegment();
  const { data: session } = useSession();
  const getAvatar = useAvatarImage();

  return isMobile ? (
    <Card className='overflow-y-scroll'>
      <div className='fixed top-0 z-40 h-fit px-3 py-2 bg-tertiary w-screen flex gap-4 justify-between items-center'>
      <Image
          src={'/assets/akil-icon.png'}
          width={37.5}
          height={30}
          alt='Masar Logo'
          className='h-[30px] w-[37.5px]'
        />
        <IconButton
          color='amber'
          size='sm'
          variant='outlined'
          onClick={() => toggleExpanded()}
          className='rounded-full text-bgPrimary'
        >
          {!expanded && <FiAlignJustify size={15} />}
          {expanded && <FiX size={15} />}
        </IconButton>
      </div>
      {expanded && (
        <div className='fixed mt-10 inset-0 z-40  bg-inherit bg-opacity-50'>
          <List className='h-full min-w-0 z-10'>
            {/* Filter out the  upper options*/}
            {sidebarOptions
              .filter(({ bottom }) => !bottom)
              .map((option) => (
                <SidebarListItem
                  key={option.href}
                  segment={segment}
                  expanded={expanded}
                  {...option}
                  onClick={() => toggleExpanded()}
                />
              ))}

            <div className='mt-auto'>
              <HorizontalDivider />

              <div className='mx-3 flex  items-center'>
                <LocaleSwitcher />
              </div>

              {/* Bottom options */}
              {sidebarOptions
                .filter(({ bottom }) => bottom)
                .map((option) => (
                  <SidebarListItem
                    key={option.href}
                    segment={segment}
                    expanded={expanded}
                    {...option}
                    className='my-1'
                    onClick={() => toggleExpanded()}
                  />
                ))}
            </div>

            <ListItem
              className={`opacity-100
          bg-primary/10
          }`}
              disabled
            >
              {/* User avatar */}
              <Avatar
                src={getAvatar(
                  session?.user.name || '',
                  session?.user.profilePicUrl
                )}
                alt='avatar'
                variant='circular'
                withBorder
                className='p-0.5 border-primary shadow-sm opacity-90'
                size='md'
              />

              {/* user profile */}
              <div className='mx-3'>
                <Typography variant='h6' color='blue-gray'>
                  {session?.user.name}
                </Typography>
                <Typography
                  variant='small'
                  color='gray'
                  className='font-normal'
                >
                  {session?.user.email}
                </Typography>
              </div>
            </ListItem>
          </List>
        </div>
      )}
    </Card>
  ) : (
    <Card
      className={`h-full overflow-y-scroll  w-full p-4 px-2 shadow-xl bg-tertiary bg-[url(/assets/sidebar-pattern.png)] rounded-none bg-no-repeat bg-left-bottom bg-cover ${className}`}
    >
        {/* Display logo */}
        <div className='mb-2 px-4 h-20 flex'>
        {expanded ? (
          // Display the full logo when the sidebar is expanded
          <Image
            src={'/assets/Hoopoe navbar logo.png'}
            width={110}
            height={30}
            alt='Masar Logo'
            className='h-[30px] w-[110px]'
          />
        ) : (
          // Display the icon when the sidebar is collapsed
          <Image
            src={'/assets/akil-icon.png'}
            width={37.5}
            height={30}
            alt='Masar Logo'
            className='h-[30px] w-[37.5px]'
          />
        )}
      </div>

      <List className='h-fit min-w-0'>
        {/* Filter out the  upper options*/}
        {sidebarOptions
          .filter(({ bottom }) => !bottom)
          .map((option) => (
            <SidebarListItem
              key={option.href}
              segment={segment}
              expanded={expanded}
              {...option}
            />
          ))}

        {/* Collapse button */}
        <IconButton
          color='amber'
          variant='outlined'
          onClick={() => toggleExpanded()}
          className='my-2 mx-auto rounded-full  text-bgPrimary'
        >
          {expanded ? <AiFillCaretLeft /> : <AiFillCaretRight />}
        </IconButton>

        <div className='mt-auto'>
          <HorizontalDivider />

          {expanded && (
            <div className='mx-3 flex  items-center'>
              <LocaleSwitcher />
            </div>
          )}

          {/* Bottom options */}
          {sidebarOptions
            .filter(({ bottom }) => bottom)
            .map((option) => (
              <SidebarListItem
                key={option.href}
                segment={segment}
                expanded={expanded}
                {...option}
                className='my-1'
              />
            ))}
        </div>

        {/* Logout*/}
        <ListItem
          onClick={() => signOut()}
          className={`cursor-pointer hover:bg-secondary transition ${
            expanded ? 'justify-start px-4' : 'justify-center px-0'
          }`}
        >
          <FiPower size={20} />

          {expanded && (
            <Typography
              variant='small'
              className='ml-3 font-medium text-lg truncate'
            >
              Logout
            </Typography>
          )}
        </ListItem>

        {/* User avatar */}
        <ListItem
          className={`opacity-100 ${
            expanded ? 'bg-primary/10' : 'justify-center px-0'
          }`}
          disabled
        >
          {/* User avatar */}
          <Avatar
            src={getAvatar(
              session?.user.name || '',
              session?.user.profilePicUrl
            )}
            alt='avatar'
            variant='circular'
            withBorder
            className='p-0.5 border-primary shadow-sm opacity-90'
            size='md'
          />

          {/* Logout button */}
          {expanded && (
            <div className='mx-3 truncate'>
              <Typography variant='h6' color='blue-gray'>
                {session?.user.name}
              </Typography>
              <Typography variant='small' color='gray' className='font-normal'>
                {session?.user.email}
              </Typography>
            </div>
          )}
        </ListItem>
      </List>
    </Card>
  );
};

interface SidebarListItemProps {
  onClick?: () => void;
  href: string;
  segment: string | null;
  icon: ReactNode;
  expanded: boolean;
  name: string;
  className?: string;
}

export const SidebarListItem: React.FC<SidebarListItemProps> = ({
  onClick,
  segment,
  expanded,
  href,
  icon,
  name,
  className,
}) => {
  return (
    <Link href={href}>
      <Tooltip
        content={expanded ? undefined : name}
        placement='right'
        className={
          expanded
            ? 'hidden'
            : 'border border-blue-gray-50 bg-white px-4 py-3 shadow-xl shadow-black/10 text-black'
        }
      >
        <ListItem
          className={`focus:bg-secondary focus:text-lighterPrimary hover:bg-tertiary p-4 truncate
        ${className}
        ${
          segment === href.split('/').pop()
            ? 'bg-secondary text-lighterPrimary'
            : ''
        }
        `}
          selected={segment === href.split('/').pop()}
          onClick={onClick}
        >
          {icon && <ListItemPrefix>{icon}</ListItemPrefix>}
          {expanded && name}
        </ListItem>
      </Tooltip>
    </Link>
  );
};

export default Sidebar;
useSelectedLayoutSegment;
