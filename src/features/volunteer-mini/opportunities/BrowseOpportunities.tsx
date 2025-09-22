'use client';

import OpportunityCard from '../components/OpportunityCard';
import { useGetAllVolunteerOpportunitiesQuery } from '@/app/api/slices/volunteer-api-slice';
import {
  OpportunityDetail,
  VolunteerOpportuntiesFilters,
} from '@/app/api/types';
import LoadingPage from '@/components/LoadingPage';
import '@/select-options';
import { ORG_AREA_OPTIONS } from '@/select-options';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { Input, Typography } from '@material-tailwind/react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useDebouncedCallback } from 'use-debounce';

const BrowseOpportunities: React.FC = () => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();
  const [queryParams, setQueryParams] = useState('');

  const [volunteerOpportunitiesFilters, setVolunteerOpportunitiesFilters] =
    useState<VolunteerOpportuntiesFilters>({
      page: Number(searchParams.get('page')) || 1,
      pageSize: Number(searchParams.get('pageSize')) || 10,
      sortKey: searchParams.get('sortKey') || undefined,
      sortDesc: searchParams.get('sortDesc') == 'true',
      keyword: searchParams.get('keyword') || undefined,
      orgId: searchParams.get('orgID') || undefined,
      organizationType: searchParams.get('organizationType') || undefined,
      // opportunityType: searchParams.get('opportunityType') || undefined,
    });

  useEffect(() => {
    updatePath(volunteerOpportunitiesFilters);
  }, [volunteerOpportunitiesFilters]);

  // const updatePath = (filterData: VolunteerOpportuntiesFilters) => {
  //   const paramString = Object.entries(filterData)
  //     .map(([key, value]) => (value != null ? `${key}=${value}` : undefined))
  //     .filter((item) => item != null)
  //     .join('&');

  //   router.replace(`${pathname}?${paramString}`, { scroll: false });
  // };

  const updatePath = (filterData: VolunteerOpportuntiesFilters) => {
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

  const handleOpportunityListUpdate = async (
    filters: VolunteerOpportuntiesFilters
  ) => {
    setVolunteerOpportunitiesFilters(filters);
    updatePath(volunteerOpportunitiesFilters);
  };

  const [searchTerm, setSearchTerm] = useState(
    volunteerOpportunitiesFilters.keyword || ''
  );
  const debouncedSearch = useDebouncedCallback(
    (keyword: string) => {
      handleOpportunityListUpdate({
        ...volunteerOpportunitiesFilters,
        page: 1,
        keyword: keyword,
      });
    },
    // delay in ms before calling refresh (instead of calling it each type keyboard is typed)
    500
  );
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  const {
    data: volunteeringOpportunityList,
    isFetching: isFetchingOpportunities,
  } = useGetAllVolunteerOpportunitiesQuery(queryParams, {
    refetchOnMountOrArgChange: 60,
  });

  return (
    <div className='w-screen' style={{ backgroundColor: 'white' }}>
      <div className='text-center p-3'>
        <Input
          label='Search Opportunities'
          value={searchTerm}
          color='amber'
          onChange={(event) => {
            setSearchTerm(event.target.value);
            debouncedSearch(event.target.value);
          }}
          className=' w-3/4  '
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
              ...volunteerOpportunitiesFilters,
              categories: [],
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
                ...volunteerOpportunitiesFilters,
                categories: selectedCategories.includes(value)
                  ? selectedCategories.filter((cat) => cat !== value)
                  : [...selectedCategories, value],
              });
            }}
          >
            {label.split(' ')[0]}
          </div>
        ))}
      </div>

      <div className='flex justify-between gap-2 px-3 flex-wrap '>
        <TableContent
          opportuntiyListData={volunteeringOpportunityList?.data || []}
          loading={isFetchingOpportunities}
        />
      </div>
    </div>
  );
};

interface TableContentProps {
  loading?: boolean;
  opportuntiyListData: OpportunityDetail[];
}

const TableContent: React.FC<TableContentProps> = ({
  loading,
  opportuntiyListData,
}) => {
  const router = useRouter();
  if (loading) {
    return <LoadingPage />;
  }

  if (!opportuntiyListData.length) {
    return (
      <div className='mx-auto my-auto h-screen'>
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

  return opportuntiyListData.map(
    (
      {
        title,
        description,
        opType,
        location,
        logoUrl,
        orgName,
        status,
        categories,
        viewsCount,
        datePosted,
        id,
      },
      index
    ) => (
      <div
        key={index}
        className='my-2 cursor-pointer '
        onClick={() => router.push(`/volunteer-mini/home/${id}`)}
      >
        <OpportunityCard
          id={id}
          orgName={orgName}
          opportunityDescription={description}
          title={title}
          logoUrl={logoUrl}
          status={status}
          isBookmark={false}
          location={location}
          postedDate={datePosted}
          opType={opType == 'inPerson' ? 'In Person' : 'Remote'}
          viewCount={viewsCount}
          categories={categories}
        ></OpportunityCard>
      </div>
    )
  );
};

export default BrowseOpportunities;
