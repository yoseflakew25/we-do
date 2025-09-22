'use client';

import {
  TableFilters,
  TableRow,
  TableWithFilters,
} from '../../components/TableWithFilters';
import { useGetOpportunityApplicantsQuery } from '@/app/api/slices/volunteer-api-slice';
import { PaginationFilters } from '@/app/api/types';
import { useAvatarImage } from '@/hook';
import { APPLICANT_STATUS_OPTIONS, SelectOption } from '@/select-options';
import dateFormat from 'dateformat';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';

// Assuming colors is imported from your design system
type colors = 'lime' | 'blue' | 'purple' | 'teal' | 'green' | 'pink' | 'gray';

const chipColors: Record<string, colors> = {
  pending: 'lime',
  'in-review': 'blue',
  interview: 'purple',
  'offer-extended': 'teal',
  hired: 'green',
  declined: 'pink',
  certified: 'gray',
};

type ViewApplicantsProps = {
  id: string;
};

function ViewApplicantsTable({ id }: ViewApplicantsProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const getAvatar = useAvatarImage();

  const buildApplicantFilters = (tableFilters: TableFilters) => {
    const opportunityFilters: PaginationFilters = {
      sortKey: tableFilters.sort?.key,
      sortDesc: tableFilters.sort?.desc,
      page: tableFilters.page.number,
      pageSize: tableFilters.page.size,
      keyword: tableFilters.keyword,
    };
    if (tableFilters.filterValue) {
      opportunityFilters.status = tableFilters.filterValue;
    }

    return opportunityFilters;
  };

  const [tableFilters, setTableFilters] = useState<TableFilters>({
    sort: {
      key: searchParams.get('sortKey') || 'dateApplied',
      desc: searchParams.get('sortDesc')
        ? searchParams.get('sortDesc') === 'true'
        : true,
    },
    page: {
      number: Number(searchParams.get('page')) || 1,
      size: Number(searchParams.get('pageSize')) || 10,
    },
    filterValue: searchParams.get('status') || 'pending',
    keyword: searchParams.get('keyword') || undefined,
  });

  const [applicantFilters, setApplicantFilters] = useState(
    buildApplicantFilters(tableFilters)
  );
  const { data: applicantData, isFetching: isFetchingApplicants } =
    useGetOpportunityApplicantsQuery(
      { id, filters: applicantFilters },
      { refetchOnMountOrArgChange: 5 * 60 }
    );

  const handleRowClick = (id: string) => {
    router.push(`${pathname}/applicants/${id}`);
  };

  const tableFilterOptions = [
    ...APPLICANT_STATUS_OPTIONS,
    { label: 'All', value: '' },
  ];

  // sort applicant data based on resume score
  const sortedApplicantData = [...(applicantData?.data || [])].sort((a, b) => {
    const scoreA = a.resumeScore?.score;
    const scoreB = b.resumeScore?.score;

    if (typeof scoreA !== 'number' && typeof scoreB !== 'number') return 0;
    if (typeof scoreA !== 'number') return 1;
    if (typeof scoreB !== 'number') return -1;

    return scoreB - scoreA;
  });

  const parsedTableData: TableRow[] =
    sortedApplicantData?.map((applicant) => {
      const score = applicant.resumeScore?.score;

      return {
        id: applicant.ID,
        cells: {
          user: {
            type: 'listItem',
            listItem: {
              title: applicant.name,
              subtitle: applicant.email,
              avatarUrl: getAvatar(applicant.name, undefined),
            },
          },
          score: {
            type: 'chips',
            chips: [
              {
                text: score != null ? `${score} % match score` : 'No Resume',
                color: 'green', // Using one of the defined colors
              },
            ],
          },
          status: {
            type: 'chips',
            chips: [
              {
                text:
                  APPLICANT_STATUS_OPTIONS.find(
                    ({ value }) => value == applicant.status
                  )?.label || '',
                color: chipColors[applicant.status],
              },
            ],
          },
          dateApplied: {
            type: 'text',
            text: dateFormat(applicant.dateApplied, 'ddd, mmm dd, yyyy'),
          },
        },
      };
    }) || [];

  const handleTableUpdate = (filters: TableFilters) => {
    setTableFilters(filters);

    const opportunityFilters = buildApplicantFilters(filters);
    setApplicantFilters(opportunityFilters);

    const paramString = Object.entries(opportunityFilters)
      .map(([key, value]) => (value != null ? `${key}=${value}` : undefined))
      .filter((item) => item != null)
      .join('&');
    router.replace(`${pathname}?tab=applicants&${paramString}`, {
      scroll: false,
    });
  };

  const tableHeaders: SelectOption[] = [
    { label: 'Applicant', value: 'name' },
    { label: 'AI Resume Filter', value: 'resumeScore' },
    { label: 'Status', value: 'status' },
    { label: 'Date Applied', value: 'dateApplied' },
  ];

  return (
    <div className='container mx-auto items-center px-7 sm:px-6 lg:px-8 '>
      <div className='-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8'>
        <div className='min-w-full py-2 align-middle sm:px-6 lg:px-8 sm:mt-8'>
          <TableWithFilters
            dataType='Applicants'
            tableData={parsedTableData}
            headers={tableHeaders}
            refreshTable={handleTableUpdate}
            loading={isFetchingApplicants}
            filterOptions={tableFilterOptions}
            filters={tableFilters}
            onRowClick={handleRowClick}
            totalCount={applicantData?.count || parsedTableData.length}
            titleMessage='Applicants to this opportunity'
          />
        </div>
      </div>
    </div>
  );
}

export default ViewApplicantsTable;