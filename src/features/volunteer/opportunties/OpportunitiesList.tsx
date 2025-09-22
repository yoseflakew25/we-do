'use client';

import OpportunityCard, { tagColors } from '../components/OpportunityCard';
import { OpportunitiesListSkeleton } from './OpportunitiesListSkeleton';
import {
  useGetAllVolunteerOpportunitiesQuery,
  useCreateSearchAlertMutation,
} from '@/app/api/slices/volunteer-api-slice';
import {
  OpportunityDetail,
  VolunteerOpportuntiesFilters,
} from '@/app/api/types';
import ThreeDotsLoading from '@/components/ThreeDotsLoading';
import { locales } from '@/config';
import MovingBackgroundEffect from '@/features/landing-page-v2/components/ui/MovingBackgroundEffect';
import {
  LOCATION_OPTIONS,
  NGO_TYPE_OPTIONS,
  OP_TYPE_OPTIONS,
  ORG_AREA_OPTIONS, // ORGANIZATION_TYPE_OPTIONS,
} from '@/select-options';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import {
  Button,
  Card,
  CardBody,
  Checkbox,
  Input,
  List,
  ListItem,
  ListItemPrefix,
  Select,
  Option,
  Typography,
} from '@material-tailwind/react';
import { useSession } from 'next-auth/react';
import { useTranslations } from 'next-intl';
import dynamic from 'next/dynamic';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState, useRef } from 'react';
import { IoClose } from 'react-icons/io5';
import 'react-quill/dist/quill.bubble.css';
import { toast } from 'react-toastify';
import { useDebouncedCallback } from 'use-debounce';

const OpportunitiesList: React.FC = () => {
  // IDs for testing
  const searchBarTestId = `search-bar`;
  const selectLocationTestId = `select-location`;
  // const searchButtonTestId = `search-button`;

  const t = useTranslations('AkilMotto');
  const t1 = useTranslations('findOpportunities');
  const t2 = useTranslations('ViewOpportunityInfoPage');
  const t_orgAreaOptions = useTranslations('ngoAreaOptions');
  const sortOptions = [
    {
      id: 'datePosted_desc',
      label: t1('sortOptions.mostRecent'),
      value: 'datePosted',
      descending: true,
    },
    {
      id: 'datePosted_asc',
      label: t1('sortOptions.oldestFirst'),
      value: 'datePosted',
      descending: false,
    },
    {
      id: 'applicantsCount_desc',
      label: t1('sortOptions.mostApplicants'),
      value: 'applicantsCount',
      descending: true,
    },
    {
      id: 'applicantsCount_asc',
      label: t1('sortOptions.leastApplicants'),
      value: 'applicantsCount',
      descending: false,
    },
    {
      id: 'deadline_desc',
      label: t1('sortOptions.farthestDeadline'),
      value: 'deadline',
      descending: true,
    },
    {
      id: 'deadline_asc',
      label: t1('sortOptions.nearestDeadline'),
      value: 'deadline',
      descending: false,
    },
    {
      id: 'viewsCount_desc',
      label: t1('sortOptions.mostViewed'),
      value: 'viewsCount',
      descending: true,
    },
    {
      id: 'viewsCount_asc',
      label: t1('sortOptions.leastViewed'),
      value: 'viewsCount',
      descending: false,
    },
    {
      id: 'average_rating_desc',
      label: 'Highest Rated',
      value: 'average_rating',
      descending: true,
    },
    {
      id: 'average_rating_asc',
      label: 'Lowest Rated',
      value: 'average_rating',
      descending: false,
    },
  ];

  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();
  const [queryParams, setQueryParams] = useState('');
  const { data: session } = useSession();
  const isSession = !!session;

  const [volunteerOpportunitiesFilters, setVolunteerOpportunitiesFilters] =
    useState<VolunteerOpportuntiesFilters>({
      page: Number(searchParams.get('page')) || 1,
      pageSize: Number(searchParams.get('pageSize')) || 10,
      sortKey: searchParams.get('sortKey') || undefined,
      sortDesc: searchParams.get('sortDesc') == 'true',
      keyword: searchParams.get('keyword') || undefined,
      orgId: searchParams.get('orgID') || undefined,
      organizationType: searchParams.get('organizationType') || undefined,
      opportunityType: searchParams.get('opportunityType') || undefined,
      categories: searchParams.get('categories')?.split(',') || undefined,
      //  orgType: searchParams.get('orgType') || undefined,
    });

  useEffect(() => {
    updatePath(volunteerOpportunitiesFilters);
  }, [volunteerOpportunitiesFilters]);

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
      setSearchTerm(keyword);
    },
    // delay in ms before calling refresh (instead of calling it each type keyboard is typed)
    500
  );
  const [selectedEmploymentType, setSelectedEmploymentType] = useState('');
  const [selectedNgoType, setSelectedNgoType] = useState('');
  //  const [selectedOrgType, setSelectedOrgType] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [tooltipVisiblity, setTooltipVisiblity] = useState(false);
  const [searchAlertRequested, setSearchAlertRequested] = useState(false);

  useEffect(() => {
    const categoriesFromUrl = searchParams.get('categories');
    if (categoriesFromUrl) {
      setSelectedCategories(categoriesFromUrl.split(','));
    }
  }, []);

  const {
    data: volunteeringOpportunityList,
    isFetching: isFetchingOpportunities,
    refetch,
  } = useGetAllVolunteerOpportunitiesQuery(queryParams, {
    refetchOnMountOrArgChange: true,
  });

  useEffect(() => {
    refetch();
  }, [refetch]);

  // const { data: volunteeringOpportunityListAll } =
  //   useGetAllVolunteerOpportunitiesQuery('queryParams', {
  //     refetchOnMountOrArgChange: true,
  //   });

  const pagesCount = Math.ceil(
    (volunteeringOpportunityList?.count || 1) /
      volunteerOpportunitiesFilters.pageSize
  );

  const [createSearchAlert, { isSuccess, isError }] =
    useCreateSearchAlertMutation({});
  const tooltipRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (
      !isFetchingOpportunities &&
      volunteeringOpportunityList?.data?.length == 0 &&
      searchTerm.trim() !== ''
    ) {
      setTooltipVisiblity(true);
      const timer = setTimeout(() => setTooltipVisiblity(false), 15000);
      return () => clearTimeout(timer);
    } else {
      setTooltipVisiblity(false);
    }
  }, [volunteeringOpportunityList, isFetchingOpportunities, searchTerm]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        tooltipRef.current &&
        !tooltipRef.current.contains(e.target as Node)
      ) {
        setTooltipVisiblity(false);
        setSearchAlertRequested(false);
      }
    };
    if (tooltipVisiblity) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [tooltipVisiblity]);

  useEffect(() => {
    if (isSuccess) {
      toast.success('You job alert is saved.');
      setTooltipVisiblity(false);
      setSearchAlertRequested(false);
    } else if (isError) {
      toast.error('Something went wrong. Please try again.');
      setSearchAlertRequested(false);
    }
  }, [isSuccess, isError]);

  const handleCategoryClick = (category: string) => {
    const updatedCategories = selectedCategories.includes(category)
      ? selectedCategories.filter((cat) => cat !== category)
      : [...selectedCategories, category];

    setSelectedCategories(updatedCategories);
    handleOpportunityListUpdate({
      ...volunteerOpportunitiesFilters,
      categories: updatedCategories,
    });
  };

  const handleEmploymentTypeClick = (employmentType: string) => {
    const updatedEmploymentType =
      selectedEmploymentType === employmentType ? '' : employmentType;

    setSelectedEmploymentType(updatedEmploymentType);
    handleOpportunityListUpdate({
      ...volunteerOpportunitiesFilters,
      opportunityType: updatedEmploymentType,
    });
  };

  const handleCheckSearchAlert = (isChecked: boolean) => {
    setSearchAlertRequested(isChecked);

    if (isChecked) {
      createSearchAlert({
        filter: { params: { keyword: searchTerm } },
      });
    }
  };

  return (
    <div className='' style={{ backgroundColor: 'white' }}>
      {/* Hero section */}
      <div className='w-full h-[260px] sm:h-[280px] shadow-sm  mx-auto text-center overflow-hidden mt-8 '>
        <MovingBackgroundEffect>
          <div className='bg-cover text-center py-5 sm:py-9 flex flex-col justify-center items-center gap-2 sm:gap-6 '>
            <h1 className='text-2xl sm:text-4xl text-moto font-inherit font-semibold'>
              {t('title')}
            </h1>
            <p className='text-sm sm:text-base text-neutrals60 '>
              {t1('subtitle').split(' ').slice(0, 5).join(' ')}
              <span className='block'>
                {t1('subtitle').split(' ').slice(5).join(' ')}
              </span>
            </p>

            <Card className='w-2/3 relative'>
              <CardBody className='overflow-x-auto'>
                <div className=' flex flex-col lg:flex-row gap-3 w-full '>
                  <div className='w-full min-w-[200px] h-10'>
                    <Input
                      label={t1('searchOpportunities')}
                      value={searchTerm}
                      onChange={(event) => {
                        setSearchTerm(event.target.value);
                        debouncedSearch(event.target.value);
                      }}
                      icon={<MagnifyingGlassIcon className='h-5 w-5' />}
                      crossOrigin={undefined}
                      data-testid={searchBarTestId}
                    />
                  </div>
                  <div className='relative h-10 w-full min-w-[200px] basis-1/2'>
                    <select
                      className='peer h-full w-full rounded-[7px] border border-blue-gray-200 border-t-transparent bg-transparent px-3 py-2.5 font-sans text-sm font-normal text-blue-gray-700 outline outline-0 transition-all placeholder-shown:border placeholder-shown:border-blue-gray-200 placeholder-shown:border-t-blue-gray-200 empty:!bg-gray-900 focus:border-2 focus:border-gray-900 focus:border-t-transparent focus:outline-0 disabled:border-0 disabled:bg-blue-gray-50'
                      onChange={(e) =>
                        handleOpportunityListUpdate({
                          ...volunteerOpportunitiesFilters,
                          location: [e.target.value],
                        })
                      }
                      data-testid={selectLocationTestId}
                    >
                      <option value=''></option>
                      {LOCATION_OPTIONS?.map((city, index) => (
                        <option key={index} value={city.value}>
                          {city.label}
                        </option>
                      ))}
                    </select>
                    <label className="before:content[' '] after:content[' '] pointer-events-none absolute left-0 -top-1.5 flex h-full w-full select-none text-[11px] font-normal leading-tight text-blue-gray-400 transition-all before:pointer-events-none before:mt-[6.5px] before:mr-1 before:box-border before:block before:h-1.5 before:w-2.5 before:rounded-tl-md before:border-t before:border-l before:border-blue-gray-200 before:transition-all after:pointer-events-none after:mt-[6.5px] after:ml-1 after:box-border after:block after:h-1.5 after:w-2.5 after:flex-grow after:rounded-tr-md after:border-t after:border-r after:border-blue-gray-200 after:transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:leading-[3.75] peer-placeholder-shown:text-blue-gray-500 peer-placeholder-shown:before:border-transparent peer-placeholder-shown:after:border-transparent peer-focus:text-[11px] peer-focus:leading-tight peer-focus:text-gray-900 peer-focus:before:border-t-2 peer-focus:before:border-l-2 peer-focus:before:border-gray-900 peer-focus:after:border-t-2 peer-focus:after:border-r-2 peer-focus:after:border-gray-900 peer-disabled:text-transparent peer-disabled:before:border-transparent peer-disabled:after:border-transparent peer-disabled:peer-placeholder-shown:text-blue-gray-500">
                      {t1('city')}
                    </label>
                  </div>

                  {/* <Button
                      color='amber'
                      className='rounded-full lg:w-48'
                      data-testid={searchButtonTestId}
                    >
                      {t1('search')}
                    </Button> */}
                </div>
              </CardBody>
            </Card>

            {/* tooltip for search alert */}
            {tooltipVisiblity && isSession && (
              <div
                ref={tooltipRef}
                className='absolute top-16 left-1/2 transform -translate-x-1/2 bg-white shadow p-4 rounded'
              >
                <div className='flex justify-between items-start'>
                  <Typography variant='small' color='gray'>
                    Unfortunately, we do not have any opportunities that match
                    your search. Would you like to be notified later for this
                    opportunity?
                  </Typography>
                  <Button
                    onClick={() => {
                      setTooltipVisiblity(false);
                      setSearchAlertRequested(false);
                    }}
                    className='ml-2 text-primary text-md'
                    style={{
                      backgroundColor: 'transparent',
                      boxShadow: 'none',
                    }}
                  >
                    <IoClose size={20} />
                  </Button>
                </div>
                <div className='flex items-center mt-2'>
                  <Checkbox
                    id='search-alert'
                    onChange={(e) => handleCheckSearchAlert(e.target.checked)}
                    checked={searchAlertRequested}
                    crossOrigin={''}
                  />
                  <label htmlFor='search-alert' className='ml-2 text-sm'>
                    Notify me when a matching opportunity is available
                  </label>
                </div>
              </div>
            )}
          </div>
        </MovingBackgroundEffect>
      </div>

      <div className='container grid grid-cols-9 px-8 md:mt-10 md:space-x-6'>
        {/* Left section */}
        <div className='hidden lg:col-span-2 lg:block flex-col py-3 '>
          <h6 className='font-inherit font-black text-sm  text-neutrals100 capitalize'>
            {t1('typeOfEmployment')}
          </h6>
          <List>
            {OP_TYPE_OPTIONS?.map(({ label, value }, index) => (
              <ListItem key={index} className='p-0'>
                <label
                  htmlFor={`opType-${index}`}
                  className='flex w-full cursor-pointer items-center px-3 py-2'
                >
                  <ListItemPrefix className='mr-3'>
                    <Checkbox
                      id={`opType-${index}`}
                      ripple={false}
                      className='hover:before:opacity-0'
                      containerProps={{
                        className: 'p-0',
                      }}
                      crossOrigin={undefined}
                      onChange={() => {
                        if (selectedEmploymentType === value) {
                          // If the value is already selected, unselect it
                          setSelectedEmploymentType('');
                        } else {
                          // If the value is not selected
                          setSelectedEmploymentType(value);
                        }
                        // setSelectedEmploymentType(value);5
                        handleOpportunityListUpdate({
                          ...volunteerOpportunitiesFilters,
                          opportunityType:
                            selectedEmploymentType === value ? '' : value,
                        });
                      }}
                      checked={value === selectedEmploymentType}
                    />
                  </ListItemPrefix>
                  <Typography
                    color='blue-gray'
                    className='font-poppins text-sm'
                  >
                    {label === 'In Person'
                      ? t2('OP_TYPE_OPTIONS.In Person')
                      : label === 'Remote'
                      ? t2('OP_TYPE_OPTIONS.Remote')
                      : t2('OP_TYPE_OPTIONS.Hybrid')}
                  </Typography>
                </label>
              </ListItem>
            ))}
          </List>
          {/* <h6 className='font-inherit font-black text-sm  text-neutrals100'>
            {t1('organizationType')}
          </h6>
          <List>
            {ORGANIZATION_TYPE_OPTIONS.map(({ label, value }, index) => (
              <ListItem key={index} className='p-0'>
                <label
                  htmlFor={`orgType-${index}`}
                  className='flex w-full cursor-pointer items-center px-3 py-2'
                >
                  <ListItemPrefix className='mr-3'>
                    <Checkbox
                      id={`orgType-${index}`}
                      ripple={false}
                      className='hover:before:opacity-0'
                      containerProps={{
                        className: 'p-0',
                      }}
                      crossOrigin={undefined}
                      onChange={() => {
                        if (selectedOrgType === value) {
                          // If the value is already selected, unselect it
                          setSelectedOrgType('');
                        } else {
                          // If the value is not selected
                          setSelectedOrgType(value);
                        }
                        handleOpportunityListUpdate({
                          ...volunteerOpportunitiesFilters,
                          orgType: selectedOrgType === value ? '' : value,
                        });
                      }}
                      checked={value === selectedOrgType}
                    />
                  </ListItemPrefix>
                  <Typography color='blue-gray' className=' text-sm'>
                    {label}
                  </Typography>
                </label>
              </ListItem>
            ))}
          </List> */}
          <h6 className='  font-inherit font-black text-sm  text-neutrals100'>
            {t1('operationalReach')}
          </h6>
          <List>
            {NGO_TYPE_OPTIONS?.map(({ label, value }, index) => (
              <ListItem key={index} className='p-0'>
                <label
                  htmlFor={`ngoType-${index}`}
                  className='flex w-full cursor-pointer items-center px-3 py-2'
                >
                  <ListItemPrefix className='mr-3'>
                    <Checkbox
                      id={`ngoType-${index}`}
                      ripple={false}
                      className='hover:before:opacity-0'
                      containerProps={{
                        className: 'p-0',
                      }}
                      crossOrigin={undefined}
                      onChange={() => {
                        if (selectedNgoType === value) {
                          // If the value is already selected, unselect it
                          setSelectedNgoType('');
                        } else {
                          // If the value is not selected
                          setSelectedNgoType(value);
                        }

                        handleOpportunityListUpdate({
                          ...volunteerOpportunitiesFilters,
                          organizationType:
                            selectedNgoType === value ? '' : value,
                        });
                      }}
                      checked={value === selectedNgoType}
                    />
                  </ListItemPrefix>
                  <Typography
                    color='blue-gray'
                    className='font-poppins text-sm'
                  >
                    {`${t2('NGO_TYPE_OPTIONS' + '.' + label)}`}
                  </Typography>
                </label>
              </ListItem>
            ))}
          </List>
          <h6 className='font-inherit font-black text-sm  text-neutrals100'>
            {t1('categories')}
          </h6>
          <List>
            {ORG_AREA_OPTIONS?.map(({ label, value }, index) => (
              <ListItem key={index} className='p-0'>
                <label
                  htmlFor={`orgArea-${index}`}
                  className='flex w-full cursor-pointer items-center px-3 py-2'
                >
                  <ListItemPrefix className='mr-3'>
                    <Checkbox
                      id={`orgArea-${index}`}
                      ripple={false}
                      className='hover:before:opacity-0'
                      containerProps={{
                        className: 'p-0',
                      }}
                      crossOrigin={undefined}
                      onChange={() => {
                        if (selectedCategories.includes(value)) {
                          // If the value is already selected, remove it from the selectedCategories array
                          setSelectedCategories((prevSelectedCategories) =>
                            prevSelectedCategories.filter(
                              (cat) => cat !== value
                            )
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
                      checked={selectedCategories.includes(value)}
                    />
                  </ListItemPrefix>
                  <Typography
                    color='blue-gray'
                    className='font-poppins text-sm'
                  >
                    {t_orgAreaOptions(`${label}`)}
                  </Typography>
                </label>
              </ListItem>
            ))}
          </List>
        </div>
        {/* Right section */}
        <div className='block col-span-9 lg:col-span-7 '>
          <div className='flex justify-between items-center'>
            <div className='pb-2'>
              {/* Opportunities Title */}
              <h3
                className={`font-inherit py-3 font-black text-xl md:text-2xl text-[#25324B] text-left pb-4`}
              >
                {t1('opportunities')}
              </h3>

              <div className='hidden md:block'>
                <p className='font-normal text-base text-neutrals80'>
                  <span>
                    {t1('showingResults').split(' ').length > 1
                      ? t1('showingResults').split(' ')[0] +
                        ' ' +
                        (volunteeringOpportunityList?.data.length || 0) +
                        ' ' +
                        t1('showingResults').split(' ')[1]
                      : (volunteeringOpportunityList?.data.length || 0) +
                        ' ' +
                        t1('showingResults')}
                  </span>
                  <span>
                    {' '}
                    {t1('of')} {volunteeringOpportunityList?.count}{' '}
                    {t1('opportunities')}
                  </span>
                </p>
              </div>
            </div>

            {/* Sort By */}
            <div className='max-w-fit select'>
              <Select
                label='Sort By'
                size='md'
                className='font-poppins !min-w-[10rem] w-40'
                value={sortOptions[0].id}
                onChange={(selectedId) => {
                  // Find the selected option by its unique ID
                  const selectedOption = sortOptions.find(
                    (option) => option.id === selectedId
                  );
                  if (selectedOption) {
                    handleOpportunityListUpdate({
                      ...volunteerOpportunitiesFilters,
                      sortKey: selectedOption.value,
                      sortDesc: selectedOption.descending,
                    });
                  }
                }}
              >
                {sortOptions.map(({ label, id }) => (
                  <Option
                    key={id}
                    value={id}
                    className='py-1 rounded-sm focus:!bg-gray-100 hover:!bg-gray-50'
                  >
                    {label}
                  </Option>
                ))}
              </Select>
            </div>
          </div>
          <div className='md:hidden'>
            <p className='font-normal text-base text-neutrals80'>
              <span>
                {t1('showingResults').split(' ').length > 1
                  ? t1('showingResults').split(' ')[0] +
                    ' ' +
                    (volunteeringOpportunityList?.data.length || 0) +
                    ' ' +
                    t1('showingResults').split(' ')[1]
                  : (volunteeringOpportunityList?.data.length || 0) +
                    ' ' +
                    t1('showingResults')}
              </span>
              <span>
                {' '}
                of {volunteeringOpportunityList?.count} Opportunities
              </span>
            </p>
          </div>
          <div className='flex flex-row overflow-x-auto no-scrollbar gap-2 pl-2 py-2 '>
            {selectedEmploymentType && (
              <div
                onClick={(e) => {
                  e.stopPropagation(); // Prevent triggering the card click
                  handleEmploymentTypeClick(selectedEmploymentType); // Call the function
                }}
              >
                <Button
                  className={`px-2 pr-1 flex gap-1 rounded-full capitalize py-1  w-max h-5 items-center 
                    ${
                      selectedEmploymentType === 'virtual'
                        ? ' bg-[#E1D8F1]  text-[#311b92] '
                        : selectedEmploymentType === 'hybrid'
                        ? 'bg-[#E8F3DB] text-[#33691E]'
                        : 'bg-[#CDEEFD] text-[#01579B]'
                    }
              }`}
                  size='sm'
                >
                  {selectedEmploymentType === 'inPerson'
                    ? 'In Person'
                    : selectedEmploymentType === 'virtual'
                    ? 'Remote'
                    : selectedEmploymentType}
                  <span>
                    <IoClose size={16} />
                  </span>
                </Button>
              </div>
            )}

            {selectedCategories?.map((item, index) => {
              const currentColor = tagColors[index % tagColors.length];
              return (
                <div
                  key={index}
                  onClick={(e) => {
                    e.stopPropagation(); // Prevent triggering the card click
                    handleCategoryClick(item); // Call the function
                  }}
                >
                  <Button
                    variant='outlined'
                    className='px-1 flex gap-1 rounded-full capitalize py-1 border-2 w-max h-5 items-center'
                    color={currentColor}
                    size='sm'
                  >
                    {item}
                    <span>
                      <IoClose size={16} />
                    </span>
                  </Button>
                </div>
              );
            })}
          </div>{' '}
          <div className='flex flex-col '>
            <TableContent
              opportunityListData={volunteeringOpportunityList?.data || []}
              loading={isFetchingOpportunities}
              onCategoryClick={handleCategoryClick}
              onEmploymentTypeClick={handleEmploymentTypeClick}
            />
          </div>
          <div className=' flex flex-row justify-center items-center gap-8 my-8'>
            <Button
              variant='outlined'
              size='sm'
              disabled={
                isFetchingOpportunities ||
                volunteerOpportunitiesFilters.page <= 1
              }
              onClick={() =>
                handleOpportunityListUpdate({
                  ...volunteerOpportunitiesFilters,
                  page: volunteerOpportunitiesFilters.page - 1,
                })
              }
            >
              {t1('previous')}
            </Button>
            <Typography variant='h6' color='blue-gray' className='font-normal'>
              {t1('page')}{' '}
              <strong className='text-gray-900'>
                {volunteerOpportunitiesFilters.page}
              </strong>{' '}
              {t1('of')} <strong className='text-gray-900'>{pagesCount}</strong>
            </Typography>

            <Button
              variant='outlined'
              size='sm'
              disabled={
                isFetchingOpportunities ||
                volunteerOpportunitiesFilters.page >= pagesCount
              }
              onClick={() =>
                handleOpportunityListUpdate({
                  ...volunteerOpportunitiesFilters,
                  page: volunteerOpportunitiesFilters.page + 1,
                })
              }
            >
              {t1('next')}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

interface TableContentProps {
  loading?: boolean;
  opportunityListData: OpportunityDetail[];
  // eslint-disable-next-line unused-imports/no-unused-vars
  onCategoryClick?: (category: string) => void;
  // eslint-disable-next-line unused-imports/no-unused-vars
  onEmploymentTypeClick?: (empType: string) => void;
}

const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });

const TableContent: React.FC<TableContentProps> = ({
  loading,
  opportunityListData,
  onCategoryClick,
  onEmploymentTypeClick,
}) => {
  const router = useRouter();
  const pathname = usePathname();
  const [loadingDetailId, setLoadingDetailId] = useState<null | string>(null);

  const foundLocale = locales.find(
    (locale) => pathname.startsWith(`/${locale}`) || pathname === `/${locale}`
  );

  const currentLocale = foundLocale;

  if (loading) {
    return <OpportunitiesListSkeleton />;
  }

  if (!opportunityListData.length) {
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

  return opportunityListData.map(
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
        applicantsCount,
        datePosted,
        id,
        isBookmarked,
        average_rating,
        total_reviews,
      },
      index
    ) => (
      <div
        key={index}
        className='my-2 cursor-pointer relative'
        onClick={() => {
          setLoadingDetailId(id);
          // Handle organization-specific paths
          const targetPath = pathname.startsWith(
            `/${currentLocale}/organization`
          )
            ? `${pathname}/opportunities/${id}`
            : `${pathname}/${id}`;
          router.push(targetPath);
        }}
      >
        <OpportunityCard
          id={id}
          opportunityTitle={title}
          opportunityDescription={
            <ReactQuill value={description} readOnly={true} theme='bubble' />
          }
          opportunityType={
            opType === 'inPerson'
              ? 'In Person'
              : opType === 'virtual'
              ? 'Remote'
              : 'Hybrid'
          }
          location={location}
          logoUrl={logoUrl}
          orgName={orgName}
          status={status}
          tags={categories}
          isBookmark={isBookmarked}
          viewsCount={viewsCount || 0}
          applicantsCount={applicantsCount || 0}
          datePosted={datePosted}
          average_rating={average_rating}
          total_reviews={total_reviews}
          onCategoryClick={onCategoryClick}
          onEmploymentTypeClick={onEmploymentTypeClick}
        />
        {loadingDetailId === id && (
          <div className='absolute inset-0 flex items-center justify-center bg-gray-400 rounded-2xl bg-opacity-50'>
            <ThreeDotsLoading />
          </div>
        )}
      </div>
    )
  );
};

export default OpportunitiesList;
