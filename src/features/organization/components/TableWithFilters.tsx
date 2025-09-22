'use client';

import LoadingButton from '@/components/buttons/LoadingButton';
import { SelectOption } from '@/select-options';
import {
  MagnifyingGlassIcon,
  ChevronUpDownIcon,
} from '@heroicons/react/24/outline';
import {
  Card,
  CardHeader,
  Input,
  Typography,
  Button,
  CardBody,
  Chip,
  CardFooter,
  Tabs,
  TabsHeader,
  Tab,
  Avatar,
  IconButton,
  Checkbox,
  Spinner,
  CardProps,
} from '@material-tailwind/react';
import { colors } from '@material-tailwind/react/types/generic';
import { useTranslations } from 'next-intl';
import { ComponentProps, useState } from 'react';
import {
  MdArrowBack,
  MdArrowForward,
  MdKeyboardDoubleArrowLeft,
  MdKeyboardDoubleArrowRight,
} from 'react-icons/md';
import { PiSortAscending, PiSortDescending } from 'react-icons/pi';
import { useDebouncedCallback } from 'use-debounce';

export type TableRow = {
  id: string;
  className?: string;
  cells: {
    [key: string]: TableCell;
  };
};

export type TableCell = ListItemCell | ActionsCell | TextCell | ChipCell;

type ListItemCell = {
  type: 'listItem';
  listItem: {
    title: string;
    subtitle: string;
    avatarUrl?: string;
    square?: boolean;
  };
};

type ActionsCell = {
  type: 'actions';
  actions: Array<ComponentProps<typeof IconButton>>;
};

type ChipCell = {
  type: 'chips';
  chips: Array<{
    text: string;
    color?: colors;
    variant?: 'filled' | 'outlined';
  }>;
};

type TextCell = {
  type: 'text';
  text: string;
};

interface BulkAction
  extends Omit<
    ComponentProps<typeof LoadingButton>,
    'children' | 'crossOrigin'
  > {
  action: (_ids?: string[]) => void;
  icon?: JSX.Element;
}

export type TableFilters = {
  sort?: {
    key?: string;
    desc: boolean;
  };
  page: {
    number: number;
    size: number;
  };
  filterValue?: string;
  keyword?: string;
};

const renderCell = (cell: TableCell) => {
  switch (cell.type) {
    case 'listItem':
      return (
        <div className='flex items-center gap-3'>
          {cell.listItem.avatarUrl && (
            <Avatar
              src={cell.listItem.avatarUrl}
              alt={cell.listItem.title}
              className={`border-secondary shadow-sm ${
                cell.listItem.square && 'p-1'
              }`}
              withBorder={cell.listItem.square}
              variant={cell.listItem.square ? 'rounded' : 'circular'}
            />
          )}
          <div className='flex flex-col'>
            <Typography
              variant='small'
              color='blue-gray'
              className='font-normal capitalize'
            >
              {cell.listItem.title}
            </Typography>
            <Typography
              variant='small'
              color='blue-gray'
              className='font-normal opacity-70'
            >
              {cell.listItem.subtitle}
            </Typography>
          </div>
        </div>
      );
    case 'actions':
      return (
        <div className='w-max flex justify-center flex-wrap gap-2 mx-auto'>
          {cell.actions.map((actionProps) => (
            <IconButton
              {...actionProps}
              key={actionProps.title}
              variant={actionProps.variant || 'text'}
              className='rounded-full'
            />
          ))}
        </div>
      );
    case 'chips':
      return (
        <div className='flex flex-wrap justify-center gap-1 mx-auto rounded-full'>
          {cell.chips.map((chip) => (
            <Chip
              key={chip.text}
              variant={chip.variant || 'ghost'}
              size='sm'
              value={chip.text}
              color={chip.color}
            />
          ))}
        </div>
      );
    case 'text':
    default:
      return (
        <Typography variant='small' color='blue-gray' className='font-normal'>
          {cell.text}
        </Typography>
      );
  }
};

interface TableWithFiltersProps extends Omit<CardProps, 'children' | 'ref'> {
  dataType?: string;
  tableData: TableRow[];
  headers: SelectOption[];
  filters: TableFilters;
  filterOptions?: SelectOption[];
  refreshTable: (_filters: TableFilters) => void;
  onRowClick?: (_rowId: string) => void;
  titleMessage?: string;
  totalCount?: number;
  loading?: boolean;
  bulkActions?: BulkAction[];
  useStickyHeader?: boolean;
}

export const TableWithFilters: React.FC<TableWithFiltersProps> = ({
  dataType = 'results',
  tableData,
  headers,
  filterOptions,
  filters,
  refreshTable,
  onRowClick,
  totalCount = 0,
  bulkActions,
  loading,
  useStickyHeader,
  ...cardProps
}) => {
  const pagesCount = Math.ceil(totalCount / filters.page.size); //override it with the dynamic content
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const t = useTranslations('tableInfo');

  const onRefreshTable = (filters: TableFilters) => {
    setSelectedRows([]);
    refreshTable(filters);
  };

  const handleCheckSelect = (id: string) => {
    if (selectedRows.includes(id)) {
      setSelectedRows(selectedRows.filter((item) => item !== id));
    } else {
      setSelectedRows(selectedRows.concat([id]));
    }
  };

  const allIds = tableData.map((row) => row.id);

  const handleSelectAll = () => {
    if (selectedRows.length === allIds.length) {
      setSelectedRows([]);
    } else {
      setSelectedRows(allIds);
    }
  };

  const [searchKeyword, setSearchKeyword] = useState(filters.keyword);
  const debouncedSearch = useDebouncedCallback(
    (keyword: string) => {
      onRefreshTable({
        ...filters,
        page: { ...filters.page, number: 1 },
        keyword: keyword,
      });
    },
    // delay in ms before calling refresh (instead of calling it each type keyboard is typed)
    500
  );

  const generatePageNumbers = (currentPage: number, totalPages: number) => {
    const pages = [];
    const maxVisiblePages = 5; // Adjust this number as needed

    if (totalPages <= maxVisiblePages) {
      // Show all pages if there aren't too many
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always show first page
      pages.push(1);

      // Calculate range around current page
      let start = Math.max(2, currentPage - 1);
      let end = Math.min(totalPages - 1, currentPage + 1);

      // Adjust if we're at the beginning or end
      if (currentPage <= 3) {
        end = 3;
      } else if (currentPage >= totalPages - 2) {
        start = totalPages - 2;
      }

      // Add ellipsis if needed
      if (start > 2) {
        pages.push('...');
      }

      // Add middle pages
      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      // Add ellipsis if needed
      if (end < totalPages - 1) {
        pages.push('...');
      }

      // Always show last page
      pages.push(totalPages);
    }

    return pages;
  };

  return (
    <Card
      {...cardProps}
      shadow={false}
      className={`h-full w-full z-0 ${cardProps.className}`}
    >
      <CardHeader floated={false} shadow={false} className='rounded-none mb-3'>
        <div className='mb-8 flex items-center justify-between gap-8 -mt-8'>
          {/* <div>
            {locale === 'om' ? (
              <Typography variant='h5' color='blue-gray'>
                {dataType} {totalCount}
              </Typography>
            ) : (
              <Typography variant='h5' color='blue-gray'>
                {totalCount} {dataType}
              </Typography>
            )}

            <Typography color='gray' className='mt-1 font-normal'>
              {titleMessage}
            </Typography>
          </div> */}
          <div className='flex shrink-0 flex-col gap-2 sm:flex-row'>
            {bulkActions &&
              (filters.filterValue !== 'myPool'
                ? // Render buttons for the first condition
                  bulkActions
                    .filter(
                      (bulkAction) => bulkAction.title !== 'Upload Members'
                    )
                    .map(
                      (
                        { title, action, icon, className, ...inputProps },
                        index
                      ) => (
                        <LoadingButton
                          {...inputProps}
                          className={`flex gap-2 items-center ${className}`}
                          key={index}
                          onClick={() => action(selectedRows)}
                          size='sm'
                          disabled={selectedRows.length === 0}
                        >
                          {title}
                          {icon}
                        </LoadingButton>
                      )
                    )
                : // Render a single button for the second condition
                  (() => {
                    const { title, action, icon, className, ...inputProps } =
                      bulkActions[1];
                    return (
                      <LoadingButton
                        {...inputProps}
                        className={`flex gap-2 items-center ${className}`}
                        key={title}
                        onClick={() => action()}
                        size='sm'
                      >
                        {title}
                        {icon}
                      </LoadingButton>
                    );
                  })())}
          </div>
        </div>
        <div className='flex flex-col items-center justify-between gap-4 md:flex-row'>
          {/* Tabs for All, Interested, Saved */}
          <Tabs
            value={filters.filterValue || ''}
            className='w-full md:w-max overflow-scroll'
          >
            <TabsHeader className='overflow-scroll rounded-full p-2 space-x-2'>
              {filterOptions?.map(({ label, value }) => (
                <Tab
                  key={value}
                  value={value}
                  onClick={() =>
                    onRefreshTable({
                      ...filters,
                      page: { ...filters.page, number: 1 },
                      filterValue: value,
                    })
                  }
                  className='rounded-tab'
                >
                  <div className='flex items-center gap-2 whitespace-nowrap capitalize'>
                    &nbsp;&nbsp;{label}&nbsp;&nbsp;
                  </div>
                </Tab>
              ))}
            </TabsHeader>
          </Tabs>

          {/* Search Input */}
          <div className='w-full md:w-72'>
            <Input
              label={t('search')}
              value={searchKeyword}
              onChange={(event) => {
                setSearchKeyword(event.target.value);
                debouncedSearch(event.target.value);
              }}
              icon={<MagnifyingGlassIcon className='h-5 w-5' />}
              crossOrigin={undefined}
              className='rounded-full'
            />
          </div>
        </div>
      </CardHeader>
      <CardBody className='overflow-scroll p-0 border border-boundery'>
        <table className='w-full min-w-max table-auto text-left border-b'>
          <thead>
            <tr
              className={` z-20 border-blue-gray-100 bg-white ${
                useStickyHeader ? '' : 'sticky top-0'
              }`}
            >
              <th className='w-10 text-center transition-colors hover:bg-blue-gray-50 border-b border-table bg-blue-gray-50 lg:bg-white z-30 sticky left-0'>
                <Checkbox
                  crossOrigin={undefined}
                  disabled={loading || allIds.length == 0}
                  color='amber'
                  onClick={handleSelectAll}
                  onChange={() => {}}
                  checked={
                    allIds.length > 0 && selectedRows.length === allIds.length
                  }
                />
              </th>
              {headers.map(({ label, value }) => (
                <th
                  key={value}
                  className='bg-blue-gray-50/50 lg:bg-white transition-colors p-0 border-b border-table'
                >
                  <Button
                    disabled={loading || tableData.length == 0}
                    variant='text'
                    color='amber'
                    className={`text-gray-800 rounded-none py-5 hover:bg-primary/5 ${
                      filters.sort?.key == value &&
                      'bg-primary/10 md:bg-white focus:bg-primary/10'
                    }`}
                    onClick={() =>
                      onRefreshTable({
                        ...filters,
                        page: { ...filters.page, number: 1 },
                        sort: {
                          key: value,
                          desc:
                            filters.sort?.key === value && !filters.sort?.desc,
                        },
                      })
                    }
                    fullWidth
                  >
                    <Typography
                      variant='small'
                      className='flex items-center justify-between gap-2 font-normal leading-none opacity-70'
                    >
                      {label}
                      {filters.sort?.key !== value ? (
                        <ChevronUpDownIcon
                          strokeWidth={2}
                          className='h-4 w-4'
                        />
                      ) : filters.sort?.desc ? (
                        <PiSortAscending className='h-4 w-4' />
                      ) : (
                        <PiSortDescending className='h-4 w-4' />
                      )}
                    </Typography>
                  </Button>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <TableContent
              {...{
                tableData,
                handleCheckSelect,
                loading,
                onRowClick,
                selectedRows,
              }}
              colsCount={headers.length + 1}
            />
          </tbody>
        </table>
      </CardBody>
      <CardFooter className='flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-blue-gray-50 p-4 bg-blue-gray-50/20'>
        <div className='flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-6'>
          <div className='flex items-center gap-2'>
            <Typography variant='small' className='text-gray-600'>
              Rows per page:
            </Typography>
            <select
              className='h-8 rounded-lg border border-gray-300 bg-white px-3 py-0 text-sm shadow-sm transition-all hover:border-primary focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30 disabled:opacity-50'
              value={filters.page.size}
              onChange={(e) =>
                onRefreshTable({
                  ...filters,
                  page: {
                    number: 1,
                    size: Number(e.target.value),
                  },
                })
              }
              disabled={loading}
            >
              {[5, 10, 20, 50].map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>
          </div>

          <Typography variant='small' className='text-gray-600'>
            Showing{' '}
            <span className='font-semibold text-amber-500'>
              {(filters.page.number - 1) * filters.page.size + 1}
            </span>{' '}
            to{' '}
            <span className='font-semibold text-amber-500'>
              {Math.min(filters.page.number * filters.page.size, totalCount)}
            </span>{' '}
            of <span className='font-semibold text-gray-800'>{totalCount}</span>{' '}
            {dataType}
          </Typography>
        </div>

        <div className='flex items-center gap-1'>
          <IconButton
            variant='text'
            size='sm'
            color='blue-gray'
            disabled={loading || filters.page.number <= 1}
            onClick={() =>
              onRefreshTable({
                ...filters,
                page: {
                  ...filters.page,
                  number: 1,
                },
              })
            }
            className='rounded-lg hover:bg-blue-gray-50 transition-colors'
          >
            <MdKeyboardDoubleArrowLeft className='h-4 w-4' />
          </IconButton>

          <IconButton
            variant='text'
            size='sm'
            color='blue-gray'
            disabled={loading || filters.page.number <= 1}
            onClick={() =>
              onRefreshTable({
                ...filters,
                page: {
                  ...filters.page,
                  number: filters.page.number - 1,
                },
              })
            }
            className='rounded-lg hover:bg-blue-gray-50 transition-colors'
          >
            <MdArrowBack className='h-4 w-4' />
          </IconButton>

          <div className='flex items-center gap-1 mx-1'>
            {generatePageNumbers(filters.page.number, pagesCount).map(
              (page, index) =>
                page === '...' ? (
                  <div
                    key={`ellipsis-${index}`}
                    className='w-8 h-8 flex items-center justify-center'
                  >
                    <Typography variant='small' className='text-gray-500'>
                      ...
                    </Typography>
                  </div>
                ) : (
                  <Button
                    key={page}
                    variant={page === filters.page.number ? 'filled' : 'text'}
                    size='sm'
                    color={page === filters.page.number ? 'amber' : 'blue-gray'}
                    onClick={() =>
                      onRefreshTable({
                        ...filters,
                        page: {
                          ...filters.page,
                          number: Number(page), // or use page as number if you're sure of its type
                        },
                      })
                    }
                    disabled={loading}
                    className={`rounded-lg min-w-[32px] h-8 flex items-center justify-center transition-all ${
                      page === filters.page.number
                        ? 'shadow-amber-100 hover:shadow-amber-200'
                        : 'hover:bg-blue-gray-50'
                    }`}
                  >
                    {page}
                  </Button>
                )
            )}
          </div>

          <IconButton
            variant='text'
            size='sm'
            color='blue-gray'
            disabled={loading || filters.page.number >= pagesCount}
            onClick={() =>
              onRefreshTable({
                ...filters,
                page: {
                  ...filters.page,
                  number: filters.page.number + 1,
                },
              })
            }
            className='rounded-lg hover:bg-blue-gray-50 transition-colors'
          >
            <MdArrowForward className='h-4 w-4' />
          </IconButton>

          <IconButton
            variant='text'
            size='sm'
            color='blue-gray'
            disabled={loading || filters.page.number >= pagesCount}
            onClick={() =>
              onRefreshTable({
                ...filters,
                page: {
                  ...filters.page,
                  number: pagesCount,
                },
              })
            }
            className='rounded-lg hover:bg-blue-gray-50 transition-colors'
          >
            <MdKeyboardDoubleArrowRight className='h-4 w-4' />
          </IconButton>
        </div>
      </CardFooter>
    </Card>
  );
};

interface TableContentProps {
  tableData: TableRow[];
  colsCount: number;
  selectedRows: string[];
  handleCheckSelect: (_id: string) => void;
  onRowClick?: (_rowId: string) => void;
  loading?: boolean;
}

const TableContent: React.FC<TableContentProps> = ({
  loading,
  tableData,
  onRowClick,
  colsCount,
  selectedRows,
  handleCheckSelect,
}) => {
  if (loading) {
    return (
      <tr>
        <td colSpan={colsCount} className='py-5'>
          <Spinner className='h-8 w-8 mx-auto opacity-50' />
        </td>
      </tr>
    );
  }

  if (!tableData.length) {
    return (
      <tr>
        <td colSpan={colsCount} className='py-5'>
          <Typography
            variant='small'
            color='blue-gray'
            className='font-normal text-center text-gray-500'
          >
            No results found
          </Typography>
        </td>
      </tr>
    );
  }

  return tableData.map(({ cells, id: rowId, className }, index) => (
    <tr
      key={index}
      className={`${className} ${
        onRowClick && 'hover:bg-gray-100 cursor-pointer'
      } ${
        selectedRows.includes(rowId) && 'bg-primary/10 hover:bg-primary/20'
      } first-letter:
      ${index % 2 === 0 ? 'bg-table' : 'bg-white'}`}
    >
      <td
        className={`p-4 z-10 sticky bg-gray-50 lg:bg-transparent left-0 ${
          selectedRows.includes(rowId) && '!bg-[#D7D5EA] hover:!bg-[#C4C2DF]'
        }`} 
      >
        <Checkbox
          crossOrigin={undefined}
          color='amber'
          onClick={() => handleCheckSelect(rowId)}
          checked={selectedRows.includes(rowId)}
          onChange={() => {}}
        />
      </td>
      {Object.entries(cells).map(([key, cell]) => (
        <td
          className='p-4 max-w-xs'
          key={key}
          onClick={
            onRowClick && cell.type !== 'actions'
              ? () => onRowClick(rowId)
              : undefined
          }
        >
          {renderCell(cell)}
        </td>
      ))}
    </tr>
  ));
};
