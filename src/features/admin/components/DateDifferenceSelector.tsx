import { SelectOption } from '@/select-options';
import { Select, Option } from '@material-tailwind/react';
import { ComponentProps, useState } from 'react';

export const DEFAULT_START_DATE = new Date(
  new Date().setMonth(new Date().getMonth() - 2)
);

interface DateDifferenceSelectorProps
  extends Omit<ComponentProps<typeof Select>, 'children' | 'onChange'> {
  onChange: (_startDate: Date) => void;
}

const DateDifferenceSelector: React.FC<DateDifferenceSelectorProps> = ({
  onChange,
  ...selectProps
}) => {
  const [dateDifference, setDateDifference] = useState<string>('any');

  const selectOptions: SelectOption[] = [
    { label: 'All Time', value: 'any' },
    { label: 'Last Week', value: '7' },
    { label: 'Last Month', value: '30' },
    { label: 'Last Year', value: '365' },
  ];

  const handleChangeStartDate = (value: string) => {
    setDateDifference(value);
    const newStartDate =
      value === 'any'
        ? new Date(Date.parse('2023-01-01'))
        : new Date(Date.now() - 24 * 3600 * 1000 * parseInt(value));
    onChange(newStartDate);
  };

  return (
    <Select
      value={dateDifference || 'any'}
      color='amber'
      label='Results for'
      {...selectProps}
      onChange={(val) => handleChangeStartDate(val || 'any')}
    >
      {selectOptions.map(({ value, label }) => (
        <Option key={value} value={value}>
          {label}
        </Option>
      ))}
    </Select>
  );
};

export default DateDifferenceSelector;
