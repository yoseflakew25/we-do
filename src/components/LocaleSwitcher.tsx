'use client';

import { locales } from '../config';
import { useRouter, usePathname } from '../navigations';
import {
  Menu,
  MenuHandler,
  MenuList,
  MenuItem,
  Button,
} from '@material-tailwind/react';
import { ChevronDownIcon } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';
import { useState } from 'react';
import { useTransition } from 'react';

export default function LocaleSwitcher() {
  const t = useTranslations('LocaleSwitcher');
  const router = useRouter();

  const locale = useLocale();
  const [openMenu, _setOpenMenu] = useState(false);
  const [_isPending, startTransition] = useTransition();
  const pathname = usePathname();

  const locale_map: { [key: string]: string } = {
    en: 'En',
    ara: 'ara',
  };

  function onSelectChange(event: string) {
    const nextLocale = event;
    startTransition(() => {
      router.replace(pathname, { locale: nextLocale });
    });
  }

  return (
    <Menu>
      <MenuHandler>
        <Button
          size='sm'
          variant='outlined'
          ripple={false}
          className='flex font-inherit items-center active:ring-0 focus:ring-0 !rounded-md gap-2 px-2 border border-primary'
        >
          <span className='h-min font-medium text-bgPrimary capitalize text-base leading-none'>
            {locale_map[locale]}
          </span>
          <ChevronDownIcon
            strokeWidth={2.5}
            className={`h-3.5 w-3.5 text-bgPrimary transition-transform ${
              openMenu ? 'rotate-180' : ''
            }`}
          />
        </Button>
      </MenuHandler>
      <MenuList className='max-h-72 min-w-0 max-w-fit p-0 m-0'>
        {locales.map((cur) => (
          <MenuItem
            key={cur}
            className='font-poppins hover:rounded-sm flex items-center gap-2 w-16 text-bgPrimary'
            onClick={(e) =>
              onSelectChange((e.target as HTMLButtonElement).value)
            }
            value={cur}
          >
            {t('switchLocale', { locale: cur })}
          </MenuItem>
        ))}
      </MenuList>
    </Menu>
  );
}
