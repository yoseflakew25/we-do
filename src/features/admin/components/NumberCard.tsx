import {
  Button,
  Card,
  CardBody,
  CardFooter,
  Spinner,
  Typography,
} from '@material-tailwind/react';
import Link from 'next/link';
import { ComponentProps } from 'react';

interface NumberCardProps
  extends Omit<ComponentProps<typeof Card>, 'children'> {
  title: string;
  value: number;
  iconRenderer?: (_props: { size: number; className: string }) => JSX.Element;
  theme?: string;
  action?: {
    link: string;
    name?: string;
  };
  vertical?: boolean;
  loading?: boolean;
}

export const NumberCard: React.FC<NumberCardProps> = ({
  title,
  value,
  iconRenderer,
  theme,
  action,
  vertical,
  loading,
  ...cardProps
}) => {
  const getThemeColorClasses = (theme?: string) => {
    switch (theme) {
      case 'organization':
        return {
          bg: 'bg-organization/10',
          text: 'text-organization',
        };
      case 'opportunity':
        return {
          bg: 'bg-opportunity/10',
          text: 'text-opportunity',
        };
      case 'volunteer':
        return {
          bg: 'bg-volunteer/10',
          text: 'text-volunteer',
        };
      default:
        return {
          bg: '',
          text: '',
        };
    }
  };

  const themeColors = getThemeColorClasses(theme);
  const bgIconClass = vertical
    ? '-right-5 top-12 -rotate-45'
    : '-right-2 top-6 -rotate-45';

  return (
    <Card {...cardProps} className={`overflow-hidden ${cardProps.className}`}>
      {loading && (
        <div className='absolute inset-0 h-full w-full flex items-center justify-center z-10'>
          <Spinner
            className='mx-auto my-auto w-8 h-8 opacity-90'
            color='amber'
          />
        </div>
      )}
      <span className={`absolute opacity-5 ${bgIconClass}`}>
        {iconRenderer &&
          iconRenderer({
            size: vertical ? 120 : 80,
            className: themeColors.text,
          })}
      </span>
      <CardBody
        className={`flex gap-4 font-poppins text-blue-gray-600 h-full ${
          vertical && 'flex-col'
        } ${loading && 'opacity-10'}`}
      >
        {iconRenderer && (
          <span
            className={`w-12 h-12 inline-flex items-center justify-center rounded-full bg-blue-gray-100 ${themeColors.bg}`}
          >
            {iconRenderer({ size: 20, className: themeColors.text })}
          </span>
        )}

        <div>
          {!vertical && <Typography variant='h2'>{value}</Typography>}
          <Typography
            variant={vertical ? 'h5' : 'small'}
            className='text-blue-gray-300 font-medium'
          >
            {title}
          </Typography>
          {vertical && (
            <Typography variant='h2' className={themeColors.text}>
              {value}
            </Typography>
          )}
        </div>
      </CardBody>
      {action && (
        <CardFooter className='p-0 border-t'>
          <Link href={action.link}>
            <Button
              variant='text'
              className={`rounded-none rounded-b-xl capitalize ${themeColors.text}`}
              fullWidth
            >
              {action.name || 'More Details'}
            </Button>
          </Link>
        </CardFooter>
      )}
    </Card>
  );
};

export default NumberCard;
