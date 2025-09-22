'use client';

import OrgCard from '../components/OrgCard';
import { useGetAllOrganizationsAsVolunteerQuery } from '@/app/api/slices/org-api-slice';
import { OrganizationFilters, OrganizationProfile } from '@/app/api/types';
import LoadingPage from '@/components/LoadingPage';
import { ORG_AREA_OPTIONS } from '@/select-options';
import MagnifyingGlassIcon from '@heroicons/react/24/outline/MagnifyingGlassIcon';
import { Input, Typography } from '@material-tailwind/react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useDebouncedCallback } from 'use-debounce';

const BrowseOrganization: React.FC = () => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [queryParams, setQueryParams] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  const [organizationFilters, setOrganizationFilters] =
    useState<OrganizationFilters>({
      page: Number(searchParams.get('page')) || 1,
      pageSize: Number(searchParams.get('pageSize')) || 10,
      sortKey: searchParams.get('sortKey') || undefined,
      sortDesc: searchParams.get('sortDesc') == 'true',
      keyword: searchParams.get('keyword') || undefined,
      ngoType: searchParams.get('ngoType') || undefined,
    });

  useEffect(() => {
    updatePath(organizationFilters);
  }, [organizationFilters]);

  const updatePath = (filterData: OrganizationFilters) => {
    const queryParams = [];

    for (const [key, value] of Object.entries(filterData)) {
      if (Array.isArray(value)) {
        value.forEach((val) => {
          queryParams.push(`${key}=${val}`);
        });
      } else if (value != null) {
        queryParams.push(`${key}=${value}`);
      }
    }

    // Join all the query parameters with '&'
    const paramString = queryParams.join('&');
    setQueryParams(paramString);

    router.replace(`${pathname}?${paramString}`, { scroll: false });
  };

  const handleOpportunityListUpdate = async (filters: OrganizationFilters) => {
    setOrganizationFilters(filters);
    updatePath(organizationFilters);
  };

  const debouncedSearch = useDebouncedCallback(
    (keyword: string) => {
      handleOpportunityListUpdate({
        ...organizationFilters,
        page: 1,
        keyword: keyword,
      });
    },
    // delay in ms before calling refresh (instead of calling it each type keyboard is typed)
    500
  );

  const { data: organizationsList, isFetching } =
    useGetAllOrganizationsAsVolunteerQuery(queryParams, {
      refetchOnMountOrArgChange: 60,
    });

  return (
    <div className='w-screen ' style={{ backgroundColor: 'white' }}>
      {/* Search bar and filter for mobile */}
      <div className='text-center p-3'>
        <Input
          label='Search Opportunities'
          value={searchTerm}
          color='amber'
          onChange={(event) => {
            setSearchTerm(event.target.value);
            debouncedSearch(event.target.value);
          }}
          className=' w-3/5  '
          icon={<MagnifyingGlassIcon className='h-5 w-5' />}
          crossOrigin={undefined}
        />
      </div>

      {/* scrollable filters */}
      <div className='flex overflow-x-auto space-x-2 py-2 w-screen '>
        <div
          className={`rounded-full border px-3 py-[0.5] ${
            selectedCategories.length === 0
              ? 'bg-secondary text-bgPrimary'
              : 'bg-gray-200 text-gray-700'
          }`}
          onClick={() => {
            setSelectedCategories([]);
            handleOpportunityListUpdate({
              ...organizationFilters,
              orgArea: [],
            });
          }}
        >
          All
        </div>
        {ORG_AREA_OPTIONS.map(({ label, value }, index) => (
          <div
            key={index}
            className={`rounded-full border px-3 py-[0.5] ${
              selectedCategories.includes(value)
                ? 'bg-secondary text-bgPrimary'
                : 'bg-gray-200 text-gray-700'
            }`}
            onClick={() => {
              if (selectedCategories.includes(value)) {
                // If the value is already selected, remove it from the selectedCategories array
                setSelectedCategories((prevSelectedCategories) =>
                  prevSelectedCategories.filter((cat) => cat !== value)
                );
              } else {
                // If the value is not selected, add it to the selectedCategories array
                setSelectedCategories((prevSelectedCategories) => [
                  ...prevSelectedCategories,
                  value,
                ]);
              }
              handleOpportunityListUpdate({
                ...organizationFilters,
                orgArea: selectedCategories.includes(value)
                  ? selectedCategories.filter((cat) => cat !== value)
                  : [...selectedCategories, value],
              });
            }}
          >
            {label.split(' ')[0]}
          </div>
        ))}
      </div>
      <div className=' flex justify-between gap-2 pl-3 flex-wrap'>
        <ListContent
          organizationsListData={organizationsList?.data || []}
          loading={isFetching}
        />
      </div>
    </div>
  );
};

interface ListContentProps {
  loading?: boolean;
  organizationsListData: OrganizationProfile[];
}

const ListContent: React.FC<ListContentProps> = ({
  loading,
  organizationsListData,
}) => {
  if (loading) {
    return <LoadingPage />;
  }

  if (!organizationsListData.length) {
    return (
      <div className='mx-auto my-auto'>
        <Typography
          variant='small'
          color='blue-gray'
          className='font-normal text-center text-gray-500'
        >
          No results found
        </Typography>
      </div>
    );
  }

  return organizationsListData.map((org, index) => (
    <div key={index} className='my-2 cursor-pointer '>
      <OrgCard
        name={org.orgName}
        opportunities={org.oppCount}
        logoUrl={org.LogoUrl}
        startDate={org.year}
        description={org.description}
        tags={org.orgArea}
        key={index}
        id={org.id}
        viewCounts={org.viewsCount}
      />
    </div>
  ));
};

export default BrowseOrganization;
