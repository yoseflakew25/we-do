import ChartCard, { ChartCardProps } from '../components/ChartCard';
import DateDifferenceSelector, {
  DEFAULT_START_DATE,
} from '../components/DateDifferenceSelector';
import { useGetRecentActivitiesQuery } from '@/app/api/slices/chart-api-slice';
import { useAvatarImage, useOrgLogo } from '@/hook';
import { List, Typography, Avatar, Card } from '@material-tailwind/react';
import dateFormat from 'dateformat';
import { useState } from 'react';

interface RecentActivitiesProps
  extends Omit<ChartCardProps, 'children' | 'title' | 'filters'> {}

export const RecentActivities: React.FC<RecentActivitiesProps> = (
  chartCardProps
) => {
  const getAvatar = useAvatarImage();
  const getOrgLogo = useOrgLogo();

  const [filters, setFilters] = useState({
    startDate: DEFAULT_START_DATE,
    endDate: new Date(Date.now()),
    page: 1,
    pageSize: 1000,
  });

  const {
    data: recentActivitiesData,
    isFetching,
    isError,
  } = useGetRecentActivitiesQuery(filters, { refetchOnMountOrArgChange: 60 });

  return (
    <ChartCard
      {...chartCardProps}
      loading={isFetching}
      title='Recent Activities'
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
      <List className=' max-h-96 overflow-auto'>
        {isError ? (
          <Typography className='mx-auto text-center p-5 text-gray-400'>
            Could not load data
          </Typography>
        ) : (
          recentActivitiesData?.data.map(
            ({ actorRole, name, action, timestamp, profilePicUrl }, index) => {
              return (
                action !== 'PageView' && (
                  <Card
                    shadow={false}
                    key={index}
                    className='hover:shadow-lg transition-shadow duration-300 hover:bg-gray-100'
                  >
                    <div className='flex justify-between space-x-2 p-2'>
                      <div>
                        <div className='flex items-center space-x-2 '>
                          <div>
                            <Avatar
                              variant='circular'
                              src={
                                actorRole === 'org'
                                  ? getOrgLogo(profilePicUrl)
                                  : getAvatar(name, profilePicUrl)
                              }
                            />
                          </div>
                          <div className='flex flex-col justify-between items-start'>
                            <Typography variant='small' color='blue-gray'>
                              {action}
                            </Typography>
                            <Typography
                              variant='small'
                              color='gray'
                              className='font-normal capitalize '
                            >
                              {name}
                            </Typography>
                          </div>
                        </div>
                      </div>
                      <div className='flex items-center'>
                        <Typography
                          variant='small'
                          color='gray'
                          className='font-normal capitalize items-center'
                        >
                          {dateFormat(timestamp)}
                        </Typography>
                      </div>
                    </div>
                  </Card>
                )
              );
            }
          )
        )}
      </List>
    </ChartCard>
  );
};

export default RecentActivities;
