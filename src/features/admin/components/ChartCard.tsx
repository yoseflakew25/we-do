import { Card, CardBody, Spinner, Typography } from '@material-tailwind/react';
import { color } from '@material-tailwind/react/types/components/alert';
import { ComponentProps } from 'react';
import {
  MdOutlineArrowUpward,
  MdOutlineArrowDownward,
  MdHeight,
} from 'react-icons/md';

export interface ChartCardProps extends ComponentProps<typeof Card> {
  title: string;
  totalCount?: {
    value: number;
    previous?: number;
  };
  filters?: JSX.Element[];
  loading?: boolean;
}

export const percentDifference = (
  currentCount: number,
  previousCount: number
) => (100 * (currentCount - previousCount)) / previousCount;

export const renderChangeProperties = (
  currentCount: number,
  previousCount: number
) => {
  const change = currentCount - previousCount;
  if (change > 0) {
    return {
      icon: <MdOutlineArrowUpward />,
      color: 'teal' as color,
    };
  } else if (change < 0) {
    return {
      icon: <MdOutlineArrowDownward />,
      color: 'pink' as color,
    };
  }

  return {
    icon: <MdHeight />,
    color: 'amber' as color,
  };
};

const ChartCard: React.FC<ChartCardProps> = ({
  children,
  title,
  filters,
  totalCount,
  loading,
  ...cardProps
}) => {
  return (
    <Card {...cardProps} className={`${cardProps.className} min-h-[170px]`}>
      {loading && (
        <div className='absolute inset-0 h-full w-full flex items-center justify-center z-10'>
          <Spinner
            className='mx-auto my-auto w-8 h-8 opacity-90'
            color='amber'
          />
        </div>
      )}

      <CardBody className={loading ? 'opacity-10' : ''}>
        <div className='flex justify-between flex-wrap gap-2'>
          <div>
            {totalCount && (
              <div className='flex items-center gap-1'>
                <Typography variant='h4' color='blue-gray'>
                  {totalCount.value}
                </Typography>
                {totalCount.previous != null && (
                  <Typography
                    variant='small'
                    color={
                      renderChangeProperties(
                        totalCount.value,
                        totalCount.previous
                      ).color
                    }
                    className='flex items-center font-semibold'
                  >
                    {
                      renderChangeProperties(
                        totalCount.value,
                        totalCount.previous
                      ).icon
                    }{' '}
                    {Math.abs(
                      percentDifference(totalCount.value, totalCount.previous)
                    ).toFixed(1)}
                    %
                  </Typography>
                )}
              </div>
            )}

            <Typography color='gray' className='font-bold text-xl'>
              {title}
            </Typography>
          </div>
          {filters && <div className='flex gap-2'>{...filters}</div>}
        </div>
        {children}
      </CardBody>
    </Card>
  );
};

export default ChartCard;
