import {
  Tabs,
  TabsHeader,
  TabsBody,
  Tab,
  TabPanel,
} from '@material-tailwind/react';
import { useTranslations } from 'next-intl';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import React, { ComponentProps, ReactElement, useState } from 'react';

interface TabData {
  label: string;
  value: string;
  desc: ReactElement;
}

interface UnderlineTabsProps extends ComponentProps<typeof Tabs> {
  data: TabData[];
  compact?: boolean;
  isReview?: boolean;
}

export function UnderlineTabs({
  data,
  compact,
  ...tabsProps
}: UnderlineTabsProps) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const t = useTranslations('underlineTabs');
  const [activeTab, setActiveTab] = useState(
    searchParams.get('tab') || data[0].value
  );

  const handleTabClick = (value: string) => {
    setActiveTab(value);
    router.replace(`${pathname}?tab=${value}`, { scroll: false });
  };

  return (
    <Tabs {...tabsProps} value={activeTab}>
      <TabsHeader
        className={`rounded-none border-b border-blue-gray-50 bg-transparent p-0 h-14 z-0 ${
          compact && 'w-fit'
        }`}
        indicatorProps={{
          className:
            'bg-transparent border-b-2 border-primary shadow-none rounded-none',
        }}
      >
        {data.map(({ label, value }) => (
          <Tab
            key={value}
            value={value}
            onClick={() => handleTabClick(value)}
            className={`text-sm font-poppins font-semibold sm:text-lg no-wrap text-${
              activeTab === value ? 'bgPrimary' : 'tertiary'
            }`}
          >
            {t(label)}
          </Tab>
        ))}
      </TabsHeader>
      <TabsBody>
        {data.map(({ value, desc }) => (
          <TabPanel key={value} value={value}>
            {activeTab === value && desc}
          </TabPanel>
        ))}
      </TabsBody>
    </Tabs>
  );
}
