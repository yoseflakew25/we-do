import ChartCard, {
  ChartCardProps,
  percentDifference,
  renderChangeProperties,
} from '../components/ChartCard';
import { ChartColors } from '../components/DashboardCards';
import DateDifferenceSelector from '../components/DateDifferenceSelector';
import { useGetRecentAggregatesQuery } from '@/app/api/slices/chart-api-slice';
import {
  List,
  ListItem,
  ListItemPrefix,
  Typography,
  Chip,
} from '@material-tailwind/react';
import { color } from '@material-tailwind/react/types/components/chip';
import { useState } from 'react';
import { BsBuildingsFill } from 'react-icons/bs';
import { FaHandshake } from 'react-icons/fa';
import { ImUsers } from 'react-icons/im';
import { IoDocumentText } from 'react-icons/io5';
import { RiHandCoinFill } from 'react-icons/ri';

interface RecentAggregatesProps
  extends Omit<ChartCardProps, 'children' | 'title' | 'filters'> {}

export const RecentAggregates: React.FC<RecentAggregatesProps> = (
  chartCardProps
) => {
  const [filters, setFilters] = useState({
    startDate: new Date(Date.parse('2023-01-01')),
    endDate: new Date(Date.now()),
    role: 'user',
  });

  const {
    data: recentAggregatesData,
    isFetching,
    isError,
  } = useGetRecentAggregatesQuery(filters, {
    refetchOnMountOrArgChange: 60,
  });

  const recentAggregates = [
    {
      title: 'Total Verified organizations',
      color: ChartColors.ORGANIZATION[0],
      chipColor: 'amber' as color,
      icon: <BsBuildingsFill size={15} />,
      value: recentAggregatesData?.data['newNgoRegistered'] || 0,
      prevValue: undefined,
    },
    {
      title: 'Total Opportunities',
      color: ChartColors.OPPORTUNITY[0],
      chipColor: 'purple' as color,
      icon: <RiHandCoinFill size={15} />,
      value: recentAggregatesData?.data['newOpportunities'] || 0,
      prevValue: undefined,
    },
    {
      title: 'Total Opportunity seekers',
      color: ChartColors.VOLUNTEER[0],
      chipColor: 'light-blue' as color,
      icon: <ImUsers size={15} />,
      value: recentAggregatesData?.data['newVolunteers'] || 0,
      prevValue: undefined,
    },
    {
      title: 'Total Applications',
      color: ChartColors.OPPORTUNITY[0],
      chipColor: 'light-blue' as color,
      icon: <IoDocumentText size={15} />,
      value: recentAggregatesData?.data['newApplicaitons'] || 0,
      prevValue: undefined,
    },
    {
      title: 'Total Successful Connections',
      color: '#4882E2',
      chipColor: 'teal' as color,
      icon: <FaHandshake size={15} />,
      value: recentAggregatesData?.data['newSuccessfulConnection'] || 0,
      prevValue: undefined,
    },
  ];

  return (
    <ChartCard
      {...chartCardProps}
      title='Insights'
      loading={isFetching}
      filters={[
        <DateDifferenceSelector
          key='date-selector'
          onChange={(newStartDate) =>
            setFilters({
              ...filters,
              startDate: newStartDate,
            })
          }
        />,
      ]}
    >
      <List>
        {isError ? (
          <Typography className='mx-auto text-center p-5 text-gray-400'>
            Could not load data
          </Typography>
        ) : (
          recentAggregates?.map(
            ({ title, chipColor, icon, value, prevValue }, index) => {
              return (
                <ListItem key={index}>
                  <ListItemPrefix>
                    <Chip
                      value={icon}
                      className='rounded-full'
                      color={chipColor}
                      variant='ghost'
                    />
                  </ListItemPrefix>
                  <div>
                    <div className='flex gap-2'>
                      <Typography variant='h6' color='blue-gray'>
                        {value}
                      </Typography>
                      {prevValue != null && (
                        <Typography
                          variant='small'
                          color={renderChangeProperties(value, prevValue).color}
                          className='flex items-center font-semibold'
                        >
                          {renderChangeProperties(value, prevValue).icon}
                          {Math.abs(percentDifference(value, prevValue))}%
                        </Typography>
                      )}{' '}
                    </div>

                    <Typography
                      variant='small'
                      color='gray'
                      className='font-normal capitalize'
                    >
                      {title}
                    </Typography>
                  </div>
                </ListItem>
              );
            }
          )
        )}
      </List>
    </ChartCard>
  );
};

export default RecentAggregates;
