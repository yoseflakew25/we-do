import {
  Popover,
  PopoverHandler,
  Input,
  PopoverContent,
} from '@material-tailwind/react';
import dateFormat from 'dateformat';
import React, { ComponentProps } from 'react';
import { DateRange, DayPicker } from 'react-day-picker';
import { MdChevronLeft, MdChevronRight } from 'react-icons/md';

type DateSelectorProps = ComponentProps<typeof DayPicker> & { label: string };

const DateSelector: React.FC<DateSelectorProps> = ({ ...datePickerProps }) => {
  type GetDateLabelProps =
    | {
        mode: 'single';
        dateData: Date;
      }
    | {
        mode: 'multiple';
        dateData: Date[];
      }
    | {
        mode: 'range';
        dateData: DateRange;
      }
    | {
        mode: 'default';
        dateData: undefined;
      };

  const getDateLabel = ({ mode, dateData }: GetDateLabelProps) => {
    switch (mode) {
      case 'range':
        return `${dateFormat(
          dateData.from,
          'ddd mmm d, yyyy'
        )}  \u2013  ${dateFormat(dateData.to, 'ddd mmm d, yyyy')}`;
      case 'multiple':
        return dateData
          .map((date) => dateFormat(date, 'ddd mmm d, yyyy'))
          .join(', ');
      case 'single':
        return dateFormat(dateData, 'ddd mmm d, yyyy');
      default:
        return '';
    }
  };

  return (
    <Popover placement='bottom'>
      <PopoverHandler>
        <Input
          label={datePickerProps.label || 'Select'}
          value={
            datePickerProps.mode && datePickerProps.selected
              ? getDateLabel({
                  mode: datePickerProps.mode,
                  dateData: datePickerProps.selected,
                } as GetDateLabelProps)
              : ''
          }
          crossOrigin={undefined}
        />
      </PopoverHandler>
      <PopoverContent>
        <DayPicker
          {...datePickerProps}
          showOutsideDays
          className='border-0'
          classNames={{
            caption: 'flex justify-center py-2 mb-4 relative items-center',
            caption_label: 'text-sm font-medium text-gray-900',
            nav: 'flex items-center',
            nav_button:
              'h-9 w-9 bg-transparent hover:bg-blue-gray-50 p-1 rounded-md transition-colors duration-300 flex items-center justify-center',
            nav_button_previous: 'absolute left-1.5',
            nav_button_next: 'absolute right-1.5',
            table: 'w-full border-collapse',
            head_row: 'flex font-medium text-gray-900',
            head_cell: 'm-0.5 w-9 font-normal text-sm',
            row: 'flex w-full mt-2',
            cell: 'text-gray-600 rounded-md h-9 w-9 text-center text-sm p-0 m-0.5 relative [&:has([aria-selected].day-range-end)]:rounded-r-md [&:has([aria-selected].day-outside)]:bg-gray-900/20 [&:has([aria-selected].day-outside)]:text-white [&:has([aria-selected])]:bg-gray-900/50 first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20',
            day: 'h-9 w-9 p-0 font-normal',
            day_range_end: 'day-range-end',
            day_selected:
              'rounded-md bg-gray-900 text-white hover:bg-gray-900 hover:text-white focus:bg-gray-900 focus:text-white',
            day_today: 'rounded-md bg-gray-200 text-gray-900',
            day_outside:
              'day-outside text-gray-500 opacity-50 aria-selected:bg-gray-500 aria-selected:text-gray-900 aria-selected:bg-opacity-10',
            day_disabled: 'text-gray-500 opacity-50',
            day_hidden: 'invisible',
          }}
          components={{
            IconLeft: ({ ...props }) => <MdChevronLeft size={22} {...props} />,
            IconRight: ({ ...props }) => (
              <MdChevronRight size={22} {...props} />
            ),
          }}
        />
      </PopoverContent>
    </Popover>
  );
};

export default DateSelector;
