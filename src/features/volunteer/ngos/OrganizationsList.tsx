'use client';

import { tagColors } from '../components/OpportunityCard';
import OrganizationCard from '../components/OrganizationCard';
import { OrganizationsListSkeleton } from './OrganizationsListSkeleton';
import { useGetAllOrganizationsAsVolunteerQuery } from '@/app/api/slices/org-api-slice';
import { OrganizationFilters, OrganizationProfile } from '@/app/api/types';
import ThreeDotsLoading from '@/components/ThreeDotsLoading';
import { locales } from '@/config';
import MovingBackgroundEffect from '@/features/landing-page-v2/components/ui/MovingBackgroundEffect';
import {
  LOCATION_OPTIONS,
  NGO_TYPE_OPTIONS,
  ORG_AREA_OPTIONS,
  ORGANIZATION_TYPE_OPTIONS,
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
  Typography,
  Select,
  Option,
} from '@material-tailwind/react';
import { useTranslations } from 'next-intl';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { IoClose } from 'react-icons/io5';
import { useDebouncedCallback } from 'use-debounce';

const OrganizationsList: React.FC = () => {
  const t = useTranslations('AkilMotto');
  const t1 = useTranslations('browseOrganizations');
  const t_orgAreaOptions = useTranslations('ngoAreaOptions');

  const sortOptions = [
    {
      id: 'oppCount_desc',
      label: `${t1('sortOptions.mostOpportunities')}`,
      value: 'oppCount',
      descending: true,
    },
    {
      id: 'oppCount_asc',
      label: `${t1('sortOptions.leastOpportunities')}`,
      value: 'oppCount',
      descending: false,
    },
    {
      id: 'year_desc',
      label: `${t1('sortOptions.newestFirst')}`,
      value: 'year',
      descending: true,
    },
    {
      id: 'year_asc',
      label: `${t1('sortOptions.oldestFirst')}`,
      value: 'year',
      descending: false,
    },
    {
      id: 'orgName_asc',
      label: `${t1('sortOptions.ascendingOrder')}`,
      value: 'orgName',
      descending: false,
    },
    {
      id: 'orgName_desc',
      label: `${t1('sortOptions.descendingOrder')}`,
      value: 'orgName',
      descending: true,
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

  const [searchTerm, setSearchTerm] = useState('');
  const [queryParams, setQueryParams] = useState('');
  const [selectedNgoType, setSelectedNgoType] = useState('');
  const [selectedOrgType, setSelectedOrgType] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  const [organizationFilters, setOrganizationFilters] =
    useState<OrganizationFilters>({
      page: Number(searchParams.get('page')) || 1,
      pageSize: Number(searchParams.get('pageSize')) || 10,
      sortKey: searchParams.get('sortKey') || undefined,
      sortDesc: searchParams.get('sortDesc') == 'true',
      keyword: searchParams.get('keyword') || undefined,
      ngoType: searchParams.get('ngoType') || undefined,
      orgType: searchParams.get('orgType') || undefined,
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

  const handleOrganizationsListUpdate = async (
    filters: OrganizationFilters
  ) => {
    setOrganizationFilters(filters);
    updatePath(organizationFilters);
  };

  const debouncedSearch = useDebouncedCallback(
    (keyword: string) => {
      handleOrganizationsListUpdate({
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
  // const { data: organizationsListAll } = useGetAllOrganizationsAsVolunteerQuery(
  //   'queryParams',
  //   {
  //     refetchOnMountOrArgChange: true,
  //   }
  // );
  const pagesCount = Math.ceil(
    (organizationsList?.count || 1) / organizationFilters.pageSize
  );

  const handleCategoryClick = (category: string) => {
    const updatedCategories = selectedCategories.includes(category)
      ? selectedCategories.filter((cat) => cat !== category)
      : [...selectedCategories, category];

    setSelectedCategories(updatedCategories);
    handleOrganizationsListUpdate({
      ...organizationFilters,
      orgArea: updatedCategories,
    });
  };

  const handleOrganizationTypeClick = (orgType: string) => {
    const updatedOrgType = selectedOrgType === orgType ? '' : orgType;

    setSelectedOrgType(updatedOrgType);
    handleOrganizationsListUpdate({
      ...organizationFilters,
      orgType: updatedOrgType,
    });
  };

  return (
    <div className='' style={{ backgroundColor: 'white' }}>
      {/* Hero section */}
      <div className='w-full h-[260px] sm:h-[280px] shadow-sm  mx-auto text-center overflow-hidden mt-8 '>
        <MovingBackgroundEffect>
          <div className='text-center py-5 md:py-9 flex flex-col justify-center items-center gap-2 md:gap-6'>
            <h1 className='text-2xl md:text-4xl text-moto font-inherit font-semibold'>
              {t('title')}
            </h1>
            <p className='text-sm md:text-base text-neutrals60 '>
              {t1('subtitle').split(' ').slice(0, 5).join(' ')}
              <span className='block'>
                {t1('subtitle').split(' ').slice(5).join(' ')}
              </span>
            </p>

            <Card className='w-2/3'>
              <CardBody className='overflow-x-auto'>
                <div className=' flex flex-col lg:flex-row gap-3 w-full '>
                  <div className='w-full min-w-[200px] h-10'>
                    <Input
                      label={t1('searchOrganization')}
                      value={searchTerm}
                      onChange={(event) => {
                        setSearchTerm(event.target.value);
                        debouncedSearch(event.target.value);
                      }}
                      icon={<MagnifyingGlassIcon className='h-5 w-5' />}
                      crossOrigin={undefined}
                    />
                  </div>
                  <div className='relative h-10 w-full min-w-[200px] basis-1/2'>
                    <select
                      className='peer h-full w-full rounded-[7px] border border-blue-gray-200 border-t-transparent bg-transparent px-3 py-2.5 font-sans text-sm font-normal text-blue-gray-700 outline outline-0 transition-all placeholder-shown:border placeholder-shown:border-blue-gray-200 placeholder-shown:border-t-blue-gray-200 empty:!bg-gray-900 focus:border-2 focus:border-gray-900 focus:border-t-transparent focus:outline-0 disabled:border-0 disabled:bg-blue-gray-50'
                      onChange={(e) =>
                        handleOrganizationsListUpdate({
                          ...organizationFilters,
                          location: [e.target.value],
                        })
                      }
                    >
                      <option value=''></option>
                      {LOCATION_OPTIONS.map((city, index) => (
                        <option key={index} value={city.value}>
                          {city.label}
                        </option>
                      ))}
                    </select>
                    <label className="before:content[' '] after:content[' '] pointer-events-none absolute left-0 -top-1.5 flex h-full w-full select-none text-[11px] font-normal leading-tight text-blue-gray-400 transition-all before:pointer-events-none before:mt-[6.5px] before:mr-1 before:box-border before:block before:h-1.5 before:w-2.5 before:rounded-tl-md before:border-t before:border-l before:border-blue-gray-200 before:transition-all after:pointer-events-none after:mt-[6.5px] after:ml-1 after:box-border after:block after:h-1.5 after:w-2.5 after:flex-grow after:rounded-tr-md after:border-t after:border-r after:border-blue-gray-200 after:transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:leading-[3.75] peer-placeholder-shown:text-blue-gray-500 peer-placeholder-shown:before:border-transparent peer-placeholder-shown:after:border-transparent peer-focus:text-[11px] peer-focus:leading-tight peer-focus:text-gray-900 peer-focus:before:border-t-2 peer-focus:before:border-l-2 peer-focus:before:border-gray-900 peer-focus:after:border-t-2 peer-focus:after:border-r-2 peer-focus:after:border-gray-900 peer-disabled:text-transparent peer-disabled:before:border-transparent peer-disabled:after:border-transparent peer-disabled:peer-placeholder-shown:text-blue-gray-500">
                      {t1('city')}
                    </label>
                  </div>
                  {/* <Button color='amber' className='rounded-full lg:w-48'>
                    {t1('search')}
                  </Button> */}
                </div>
              </CardBody>
            </Card>
          </div>
        </MovingBackgroundEffect>
      </div>
      <div className='container grid grid-cols-9 px-8 md:mt-10 md:space-x-6'>
        {/* Left section */}
        <div className='hidden lg:col-span-2 lg:block flex-col py-2 '>
          <h6 className='font-inherit font-black text-sm  text-neutrals100'>
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
                        handleOrganizationsListUpdate({
                          ...organizationFilters,
                          orgType: selectedOrgType === value ? '' : value,
                        });
                      }}
                      checked={value === selectedOrgType}
                    />
                  </ListItemPrefix>
                  <Typography
                    color='blue-gray'
                    className='font-poppins text-sm'
                  >
                    {`${t1('ORGANIZATION_TYPE_OPTIONS' + '.' + label)}`}
                  </Typography>
                </label>
              </ListItem>
            ))}
          </List>
          <h6 className='  font-inherit font-black text-sm  text-neutrals100'>
            {t1('operationalReach')}
          </h6>
          <List>
            {NGO_TYPE_OPTIONS.map(({ label, value }, index) => (
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

                        handleOrganizationsListUpdate({
                          ...organizationFilters,
                          ngoType: selectedNgoType === value ? '' : value,
                        });
                      }}
                      checked={value === selectedNgoType}
                    />
                  </ListItemPrefix>
                  <Typography
                    color='blue-gray'
                    className='font-poppins text-sm'
                  >
                    {`${t1('NGO_TYPE_OPTIONS' + '.' + label)}`}
                  </Typography>
                </label>
              </ListItem>
            ))}
          </List>
          <h6 className='font-inherit font-black text-sm  text-neutrals100'>
            {t1('causeArea')}
          </h6>
          <List>
            {ORG_AREA_OPTIONS.map(({ label, value }, index) => (
              <ListItem key={index} className='p-0'>
                <label
                  htmlFor={`checkbox-${index}`}
                  className='flex w-full cursor-pointer items-center px-3 py-2'
                >
                  <ListItemPrefix className='mr-3'>
                    <Checkbox
                      id={`checkbox-${index}`}
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
                        handleOrganizationsListUpdate({
                          ...organizationFilters,
                          orgArea: selectedCategories.includes(value)
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
              <h3
                className={`font-inherit py-3 font-black text-xl md:text-2xl text-[#25324B] text-left pb-4`}
              >
                {t1('allOrganizations')}
              </h3>
              <div className='hidden md:block'>
                <p className='font-normal text-base text-neutrals80'>
                  <span>
                    {t1('showingResults').split(' ').length > 1
                      ? t1('showingResults').split(' ')[0] +
                        ' ' +
                        (organizationsList?.data?.length || 0) +
                        ' ' +
                        t1('showingResults').split(' ')[1]
                      : (organizationsList?.data?.length || 0) +
                        ' ' +
                        t1('showingResults')}
                  </span>
                  <span>
                    {' '}
                    {t1('of')} {organizationsList?.count || 0}{' '}
                    {t1('organizations')}
                  </span>
                </p>
              </div>
            </div>
            <div className='max-w-fit select'>
              <Select
                label='Sort By'
                size='md'
                className='font-inherit !min-w-[10rem] w-40'
                value={sortOptions[0].id}
                onChange={(selectedId) => {
                  // Find the selected option by its unique ID
                  const selectedOption = sortOptions.find(
                    (option) => option.id === selectedId
                  );
                  if (selectedOption) {
                    handleOrganizationsListUpdate({
                      ...organizationFilters,
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
                    (organizationsList?.data?.length || 0) +
                    ' ' +
                    t1('showingResults').split(' ')[1]
                  : (organizationsList?.data?.length || 0) +
                    ' ' +
                    t1('showingResults')}
              </span>
              <span> of {organizationsList?.count || 0} Organizations</span>
            </p>
          </div>

          <div className='flex flex-row overflow-x-auto no-scrollbar gap-2 pl-2 py-2 '>
            {selectedOrgType && (
              <div
                onClick={(e) => {
                  e.stopPropagation(); // Prevent triggering the card click
                  handleOrganizationTypeClick(selectedOrgType); // Call the function
                }}
              >
                <Button
                  className={`
                ${
                  selectedOrgType === 'Non-Profit'
                    ? 'bg-[#CCEAE7] text-[#004D40]'
                    : 'bg-[#FFEACC] text-[#E65100]'
                }
                   px-2 pr-1 flex gap-1 rounded-full capitalize py-1  w-max h-5 items-center font-poppins
                  `}
                  size='sm'
                >
                  {selectedOrgType}
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
                    className='px-1 flex gap-1 rounded-full capitalize py-1 border-2 w-max h-5 items-center font-poppins'
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
          </div>

          <div>
            <TableContent
              organizationsListData={organizationsList?.data || []}
              loading={isFetching}
              onCategoryClick={handleCategoryClick}
              onOrganizationTypeClick={handleOrganizationTypeClick}
            />
          </div>

          <div className=' flex flex-row justify-center items-center font-poppins gap-8 my-8'>
            <Button
              variant='outlined'
              size='sm'
              disabled={isFetching || organizationFilters.page <= 1}
              onClick={() =>
                handleOrganizationsListUpdate({
                  ...organizationFilters,
                  page: organizationFilters.page - 1,
                })
              }
            >
              {t1('previous')}
            </Button>
            <Typography variant='h6' color='blue-gray' className='font-poppins'>
              {t1('page')}{' '}
              <strong className='text-gray-900'>
                {organizationFilters.page}
              </strong>{' '}
              {t1('of')} <strong className='text-gray-900'>{pagesCount}</strong>
            </Typography>

            <Button
              variant='outlined'
              size='sm'
              disabled={isFetching || organizationFilters.page >= pagesCount}
              onClick={() =>
                handleOrganizationsListUpdate({
                  ...organizationFilters,
                  page: organizationFilters.page + 1,
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
  organizationsListData: OrganizationProfile[];
  // eslint-disable-next-line unused-imports/no-unused-vars
  onCategoryClick?: (category: string) => void;
  // eslint-disable-next-line unused-imports/no-unused-vars
  onOrganizationTypeClick?: (orgType: string) => void;
}

const TableContent: React.FC<TableContentProps> = ({
  loading,
  organizationsListData,
  onCategoryClick,
  onOrganizationTypeClick,
}) => {
  const pathname = usePathname();
  const router = useRouter();
  const [loadingDetailId, setLoadingDetailId] = useState<null | string>(null);

  const foundLocale = locales.find(
    (locale) => pathname.startsWith(`/${locale}`) || pathname === `/${locale}`
  );

  const currentLocale = foundLocale;

  if (loading) {
    return <OrganizationsListSkeleton />;
  }

  if (!organizationsListData.length) {
    return (
      <div className='mx-auto my-auto'>
        <Typography
          variant='small'
          color='blue-gray'
          className='font-poppins text-center text-gray-500'
        >
          No results found
        </Typography>
      </div>
    );
  }

  return (
    <div className='grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-4'>
      {organizationsListData.map((org, index) => (
        <div
          className='cursor-pointer relative'
          key={index}
          onClick={() => {
            setLoadingDetailId(org.id);
            if (pathname.startsWith(`/${currentLocale}/organization`)) {
              router.push(`${pathname}/ngos/${org.id}`);
            } else {
              router.push(`${pathname}/${org.id}`);
            }
          }}
        >
          <OrganizationCard
            name={org.orgName}
            orgType={org.orgType}
            opportunities={org.oppCount}
            logoUrl={org.LogoUrl}
            startDate={org.year}
            description={org.description}
            tags={org.orgArea}
            key={index}
            viewCounts={org.viewsCount}
            average_rating={org.average_rating}
            total_reviews={org.total_reviews}
            onCategoryClick={onCategoryClick}
            onOrganizationTypeClick={onOrganizationTypeClick}
          />
          {loadingDetailId === org.id && (
            <div className='absolute inset-0 flex items-center justify-center bg-gray-400 rounded-2xl bg-opacity-50'>
              <ThreeDotsLoading />
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default OrganizationsList;
