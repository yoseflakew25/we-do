import { SelectOption, YesNoOption } from '@/select-options';
import {
  Input,
  Spinner,
  Typography,
  TypographyProps,
  Textarea,
  List,
  ListItem,
  ListItemPrefix,
  Radio,
  Menu,
  MenuHandler,
  MenuList,
  Tooltip,
} from '@material-tailwind/react';
import dateFormat from 'dateformat';
import { useTranslations } from 'next-intl';
import { ComponentProps, useState } from 'react';
import { Calendar, DateRange } from 'react-date-range';
import 'react-date-range/dist/styles.css';
// main style file
import 'react-date-range/dist/theme/default.css';
import { Control, Controller, UseFormRegister } from 'react-hook-form';
import { AiFillCalendar, AiFillCheckCircle } from 'react-icons/ai';
import { HiSparkles } from 'react-icons/hi2';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { SingleValue, StylesConfig } from 'react-select';
import CreatableSelect from 'react-select/creatable';

interface InputFieldProps extends ComponentProps<typeof Input> {
  name: string;
  register: UseFormRegister<any>;
  message?: string;
  messageColor?: TypographyProps['color'];
  loading?: boolean;
  getValues?: any;
  setValue?: any;
  label?: string;
}

export const InputField: React.FC<InputFieldProps> = ({
  name,
  register,
  message,
  messageColor = 'red',
  loading,
  label,
  ...inputProps
}) => {
  return (
    <>
      <Input
        {...inputProps}
        color='amber'
        className={`${
          inputProps.className
        } font-poppins !text-primary !text-base ${
          label === undefined
            ? '!border-t-blue-gray-200 focus:!border-t-primary'
            : ''
        } focus:border-primary !font-poppins ${
          message == undefined
            ? ''
            : `${
                label === undefined
                  ? '!border-t-red-500 focus:!border-t-red-500'
                  : ''
              }`
        }`}
        label={label}
        labelProps={
          label
            ? { className: 'text-xs', children: label }
            : { className: 'hidden' }
        }
        crossOrigin={undefined}
        {...register(name, {
          required: inputProps.required,
        })}
        error={message != undefined}
        icon={
          !inputProps.icon && loading ? (
            <Spinner className='h-4 w-4' color='amber' />
          ) : (
            inputProps.icon
          )
        }
      />
      {message && (
        <Typography
          variant='small'
          color={messageColor}
          className='font-light font-poppins'
        >
          {message}
        </Typography>
      )}
    </>
  );
};

export const AIInputField: React.FC<InputFieldProps> = ({
  name,
  register,
  getValues,
  setValue,
  message,
  messageColor = 'red',
  label,
  ...inputProps
}) => {
  const [loading, setLoading] = useState(false);
  const currentValue = getValues(name);

  async function fetchSuggestions(event: React.MouseEvent<HTMLButtonElement>) {
    event.preventDefault();
    setLoading(true);
    try {
      const response = await fetch('/api/prediction', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: currentValue,
          type: name,
        }),
      });
      const data = await response.json();
      setValue(name, data.aiResponse);
      // touch the form field to trigger validation
      // @ts-ignore
      trigger(name);
    } catch (error) {
      console.error('Error fetching AI text:', error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className='relative'>
      <Input
        {...inputProps}
        color='amber'
        className={`${
          inputProps.className
        } font-poppins !text-primary !text-base ${
          label === undefined
            ? '!border-t-blue-gray-200 focus:!border-t-primary'
            : ''
        } focus:border-primary ${
          message == undefined
            ? ''
            : `${
                label === undefined
                  ? '!border-t-red-500 focus:!border-t-red-500'
                  : ''
              }`
        }`}
        label={label}
        labelProps={
          label
            ? { className: 'text-xs', children: label }
            : { className: 'hidden' }
        }
        {...register(name, {
          required: inputProps.required,
        })}
        error={message != undefined}
      />
      <Tooltip
        animate={{
          mount: { scale: 1, y: 0 },
          unmount: { scale: 0, y: 0 },
        }}
        className='border border-blue-gray-50 bg-white px-2 text-current shadow-black/10 text-xs'
        content='Get AI-Generated Suggestions'
        placement='top'
      >
        <button
          onClick={fetchSuggestions}
          className='absolute right-2 top-1 rounded-full p-1 animate-pulse'
        >
          {currentValue &&
            (loading ? (
              <Spinner color='amber' className='h-4 w-4' />
            ) : (
              <HiSparkles color='amber' size={15} />
            ))}
        </button>
      </Tooltip>
      {message && (
        <Typography variant='small' color={messageColor} className='font-light'>
          {message}
        </Typography>
      )}
    </div>
  );
};

interface TextAreaFieldProps extends ComponentProps<typeof Textarea> {
  name: string;
  register: UseFormRegister<any>;
  message?: string;
  messageColor?: TypographyProps['color'];
}

export const TextAreaField: React.FC<TextAreaFieldProps> = ({
  name,
  register,
  message,
  messageColor = 'red',
  label,
  ...textAreaProps
}) => {
  return (
    <>
      <Textarea
        {...textAreaProps}
        color='amber'
        className={`${
          textAreaProps.className
        } font-poppins !text-primary !text-base ${
          label === undefined
            ? '!border-t-blue-gray-200 focus:!border-t-primary'
            : ''
        } focus:border-primary ${
          message == undefined
            ? ''
            : `${
                label === undefined
                  ? '!border-t-red-500 focus:!border-t-red-500'
                  : ''
              }`
        }`}
        label={label}
        labelProps={
          label
            ? { className: 'text-xs', children: label }
            : { className: 'hidden' }
        }
        {...register(name, {
          required: textAreaProps.required,
        })}
        error={message != undefined}
      />

      {message && (
        <Typography variant='small' color={messageColor} className='font-light'>
          {message}
        </Typography>
      )}
    </>
  );
};

interface AITextAreaFieldProps extends TextAreaFieldProps {
  title?: string;
  setValue?: any;
  getValues?: any;
}

export const AITextAreaField: React.FC<AITextAreaFieldProps> = ({
  name,
  register,
  setValue,
  getValues,
  message,
  messageColor = 'red',
  title = 'default',
  ...textAreaProps
}) => {
  const [loading, setLoading] = useState(false);
  const [apiErrorMessage, setApiErrorMessage] = useState<string | null>(null); // State for API errors

  async function fetchSuggestions(event: React.MouseEvent<HTMLButtonElement>) {
    event.preventDefault();
    const currentValue = getValues(name);
    setLoading(true);
    setApiErrorMessage(null); // Reset API error before the request

    try {
      const response = await fetch(`/api/prediction`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: title,
          type: name,
          content: currentValue,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch AI suggestions');
      }

      const data = await response.json();
      setValue(name, data.aiResponse, {
        shouldValidate: true,
        shouldTouch: true,
      });
    } catch (error) {
      setApiErrorMessage(
        `Failed to fetch AI suggestions. Please fill in the opportunity title.`
      );
      console.error('Error fetching AI text:', error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className='relative'>
      <Textarea
        {...textAreaProps}
        color='amber'
        className={`${
          textAreaProps.className
        } !border-t-blue-gray-200 focus:!border-t-primary focus:border-primary pr-4 font-poppins !text-primary !text-base ${
          message == undefined
            ? ''
            : '!border-t-red-500 focus:!border-t-red-500'
        }`}
        labelProps={{
          className: 'hidden',
        }}
        {...register(name, {
          required: textAreaProps.required,
        })}
        error={message != undefined}
      />
      <Tooltip
        animate={{
          mount: { scale: 1, y: 0 },
          unmount: { scale: 0, y: 0 },
        }}
        className='border border-blue-gray-50 bg-white px-2 text-current shadow-black/10 text-xs'
        content='Get AI-Generated Suggestions'
        placement='top'
      >
        <button
          onClick={fetchSuggestions}
          className='absolute right-1 top-1 rounded-full p-1 animate-pulse'
        >
          {loading ? (
            <Spinner color='amber' className='h-5 w-5' />
          ) : (
            <HiSparkles color='amber' size={20} />
          )}
        </button>
      </Tooltip>

      {/* Validation Message */}
      {message && (
        <Typography variant='small' color={messageColor} className='font-light'>
          {message}
        </Typography>
      )}

      {/* API Error Message */}
      {apiErrorMessage && (
        <Typography variant='small' color='red' className='font-light'>
          {apiErrorMessage}
        </Typography>
      )}
    </div>
  );
};

interface SelectFieldProps
  extends Omit<ComponentProps<typeof CreatableSelect>, 'children'> {
  name: string;
  control: Control<any, any>;
  message?: string;
  required?: boolean;
  messageColor?: TypographyProps['color'];
  options: Array<SelectOption>;
}

export const SelectField: React.FC<SelectFieldProps> = ({
  name,
  control,
  message,
  messageColor = 'red',
  options,
  required,
}) => {
  const [selectOptions, setSelectOptions] = useState([...options]);

  return (
    <>
      <Controller
        name={name}
        control={control}
        render={({ field: { onChange, value, onBlur } }) => (
          <CreatableSelect
            className='capitalize font-poppins !text-inherit'
            closeMenuOnSelect={true}
            onBlur={onBlur}
            styles={REACT_SELECT_CUSTOM_STYLE}
            options={selectOptions}
            value={{ label: value, value }}
            // @ts-ignore
            onChange={(val: SingleValue<SelectOption>) => onChange(val.value)}
            onCreateOption={(newValue) => {
              setSelectOptions([
                ...selectOptions,
                { label: newValue, value: newValue },
              ]);
              onChange(newValue);
            }}
            formatCreateLabel={(userInput) => `Other: "${userInput}"`}
          />
        )}
        rules={{ required }}
      />
      {message && (
        <Typography
          variant='small'
          color={messageColor}
          className='font-normal font-poppins'
        >
          {message}
        </Typography>
      )}
    </>
  );
};

interface MultiSelectFieldProps
  extends Omit<ComponentProps<typeof CreatableSelect>, 'children'> {
  name: string;
  control: Control<any, any>;
  message?: string;
  required?: boolean;
  messageColor?: TypographyProps['color'];
  options: Array<{ label: string; value: string }>;
  closeMenuOnSelect?: boolean;
}

export const REACT_SELECT_CUSTOM_STYLE: StylesConfig<SelectOption, true> = {
  menuPortal: (styles) => ({
    ...styles,
    zIndex: 9999,
  }),
  control: (styles, { isFocused }) => ({
    ...styles,
    backgroundColor: 'white',
    borderRadius: '30px',
    padding: '2px 5px',
    color: '#3D3D4B',
    border: isFocused ? '2px solid #C4897B' : '1px solid #B0BEC5',
    boxShadow: 'none',
    ':hover': {
      ...styles[':hover'],
      borderColor: '#C4897B',
    },
  }),
  menu: (styles) => ({
    ...styles,
    padding: '8px 10px',
  }),
  option: (styles, { isDisabled, isFocused, isSelected }) => ({
    ...styles,
    borderRadius: '7px',
    fontSize: '.9em',
    backgroundColor: isDisabled
      ? undefined
      : isSelected
      ? '#EFF2F4'
      : isFocused
      ? '#EFF2F4'
      : undefined,
    color: isDisabled ? '#ccc' : isSelected ? '#3D3D4B' : '#455964',
    cursor: isDisabled ? 'not-allowed' : 'default',

    ':active': {
      ...styles[':active'],
      color: !isDisabled ? (isSelected ? 'white' : '#white') : undefined,
      backgroundColor: !isDisabled
        ? isSelected
          ? '#F8F8FD'
          : '#EFF2F4'
        : undefined,
    },
  }),
  multiValue: (styles, {}) => {
    return {
      ...styles,
      backgroundColor: '#F8F8FD',
      borderRadius: '20px',
      padding: '2px 5px',
      margin: '2px 5px 2px 0',
    };
  },
  multiValueLabel: (styles, {}) => ({
    ...styles,
    color: '#455964',
  }),
  multiValueRemove: (styles, {}) => ({
    ...styles,
    borderRadius: '20px',
    color: '#455964',
    ':hover': {
      backgroundColor: '#EFF2F4',
    },
  }),
};

export const MultiSelectField: React.FC<MultiSelectFieldProps> = ({
  name,
  control,
  message,
  messageColor = 'red',
  options,
  required,
  closeMenuOnSelect = false,
}) => {
  const [selectOptions, setSelectOptions] = useState(options);
  const [errorMessage, setErrorMessage] = useState(''); // State for error message

  return (
    <>
      <Controller
        name={name}
        control={control}
        render={({ field: { onChange, value: values, onBlur } }) => (
          <>
            <CreatableSelect
              isMulti
              placeholder='Select or type to add'
              closeMenuOnSelect={closeMenuOnSelect}
              onBlur={onBlur}
              styles={REACT_SELECT_CUSTOM_STYLE}
              options={selectOptions}
              value={
                values
                  ? values.map((val: string) => ({ label: val, value: val }))
                  : []
              }
              onChange={(val) => {
                setErrorMessage(''); // Clear error on valid selection
                onChange(val.map((c) => c.value));
              }}
              onCreateOption={(newValue) => {
                const newOption = { label: newValue, value: newValue };
                setSelectOptions([...selectOptions, newOption]);
                onChange([...values, newValue]);
                setErrorMessage(''); // Clear error on valid input
              }}
              formatCreateLabel={(userInput) => `Other: "${userInput}"`}
            />

            {/* Display error message if invalid input */}
            {errorMessage && (
              <p className='text-red-500 text-sm mt-1'>{errorMessage}</p>
            )}
          </>
        )}
        rules={{ required }}
      />

      {/* Validation error message */}
      {message && (
        <Typography
          variant='small'
          color={messageColor}
          className='font-normal font-poppins'
        >
          {message}
        </Typography>
      )}
    </>
  );
};

export const EnglishOnlyMultiSelectField: React.FC<MultiSelectFieldProps> = ({
  name,
  control,
  message,
  messageColor = 'red',
  options,
  required,
  closeMenuOnSelect = false,
}) => {
  const [selectOptions, setSelectOptions] = useState(options);
  const [errorMessage, setErrorMessage] = useState(''); // State for error message

  function isValidEnglishText(text: string) {
    return /^[A-Za-z0-9\s]+$/.test(text); // Allows only English letters, numbers, and spaces
  }

  return (
    <>
      <Controller
        name={name}
        control={control}
        render={({ field: { onChange, value: values, onBlur } }) => (
          <>
            <CreatableSelect
              isMulti
              placeholder='Select or type to add'
              closeMenuOnSelect={closeMenuOnSelect}
              onBlur={onBlur}
              styles={REACT_SELECT_CUSTOM_STYLE}
              options={selectOptions}
              value={
                values
                  ? values.map((val: string) => ({ label: val, value: val }))
                  : []
              }
              onChange={(val) => {
                setErrorMessage(''); // Clear error on valid selection
                onChange(val.map((c) => c.value));
              }}
              onCreateOption={(newValue) => {
                if (!isValidEnglishText(newValue)) {
                  setErrorMessage(
                    'Only English letters, numbers, and spaces are allowed.'
                  );
                  return;
                }
                const newOption = { label: newValue, value: newValue };
                setSelectOptions([...selectOptions, newOption]);
                onChange([...values, newValue]);
                setErrorMessage(''); // Clear error on valid input
              }}
              formatCreateLabel={(userInput) => `Other: "${userInput}"`}
            />

            {/* Display error message if invalid input */}
            {errorMessage && (
              <p className='text-red-500 text-sm mt-1'>{errorMessage}</p>
            )}
          </>
        )}
        rules={{ required }}
      />

      {/* Validation error message */}
      {message && (
        <Typography
          variant='small'
          color={messageColor}
          className='font-normal font-poppins'
        >
          {message}
        </Typography>
      )}
    </>
  );
};

interface RadioFieldProps {
  name: string;
  control: Control<any, any>;
  message?: string;
  messageColor?: TypographyProps['color'];
  radioOptions: SelectOption[] | YesNoOption[];
  required?: boolean;
  className?: string;
  type?: string;
}

export const RadioField: React.FC<RadioFieldProps> = ({
  name,
  message,
  control,
  messageColor = 'red',
  required,
  radioOptions,
  className,
  type,
}) => {
  const t = useTranslations('ViewOpportunityInfoPage');

  return (
    <div className={className}>
      <Controller
        name={name}
        control={control}
        render={({ field: { onChange, value } }) => (
          <List className='sm:flex-row'>
            {radioOptions.map(({ label, value: optionValue }) => (
              <ListItem
                className='p-0'
                key={String(optionValue)}
                onClick={() => onChange(optionValue)}
              >
                <label
                  htmlFor='horizontal-list-react'
                  className='flex w-full cursor-pointer items-center px-4 py-2'
                >
                  <ListItemPrefix className='mr-3'>
                    <Radio
                      icon={
                        <AiFillCheckCircle className='w-6 h-6 mr-[0.9px] mt-[0.9px]' />
                      }
                      className='border-gray-900/10 bg-gray-900/10 p-0 transition-all hover:before:opacity-0'
                      // checked={optionValue === value}
                      defaultChecked={optionValue === value}
                      name={name}
                      ripple={false}
                      containerProps={{
                        className: 'p-0',
                      }}
                      crossOrigin={undefined}
                    />
                  </ListItemPrefix>
                  <Typography
                    color='blue-gray'
                    className='font-medium text-blue-gray-400'
                  >
                    {t(
                      type === 'OP_TYPE_OPTIONS'
                        ? `OP_TYPE_OPTIONS.${label}`
                        : `OP_PAID_OPTIONS.${label}`
                    )}
                  </Typography>
                </label>
              </ListItem>
            ))}
          </List>
        )}
        rules={{ required }}
      />

      {message && (
        <Typography
          variant='small'
          color={messageColor}
          className='font-normal font-poppins'
        >
          {message}
        </Typography>
      )}
    </div>
  );
};

interface DateSelectorFieldProps extends ComponentProps<typeof Input> {
  name: string;
  control: Control<any, any>;
  message?: string;
  messageColor?: TypographyProps['color'];
  isRange?: boolean;
}

export const DateSelectorField: React.FC<DateSelectorFieldProps> = ({
  name,
  control,
  message,
  messageColor = 'red',
  isRange,
  ...inputProps
}) => {
  return (
    <>
      <Controller
        name={name}
        control={control}
        render={({ field: { onChange, value } }) => (
          <Menu>
            <MenuHandler>
              <Input
                {...inputProps}
                type='text'
                color='amber'
                value={
                  value &&
                  (isRange
                    ? `${dateFormat(
                        value.startDate,
                        'ddd mmm d, yyyy'
                      )}  \u2013  ${dateFormat(
                        value.endDate,
                        'ddd mmm d, yyyy'
                      )}`
                    : dateFormat(value, 'dddd, mmm dd, yyyy'))
                }
                className={`${
                  inputProps.className
                } !border-t-blue-gray-200 focus:!border-t-primary focus:border-primary ${
                  message == undefined
                    ? ''
                    : '!border-t-red-500 focus:!border-t-red-500'
                }`}
                labelProps={{
                  className: 'hidden',
                }}
                crossOrigin={undefined}
                error={message != undefined}
                icon={<AiFillCalendar />}
              />
            </MenuHandler>
            <MenuList>
              {isRange ? (
                <DateRange
                  color='#C4897B'
                  editableDateInputs
                  onChange={(selectedRanges) =>
                    onChange(selectedRanges['selection'])
                  }
                  moveRangeOnFirstSelection={false}
                  ranges={[
                    {
                      startDate:
                        value && value.startDate
                          ? new Date(value.startDate)
                          : new Date(),
                      endDate:
                        value && value.endDate
                          ? new Date(value.endDate)
                          : new Date(),
                      key: 'selection',
                      color: '#C4897B',
                    },
                  ]}
                />
              ) : (
                <Calendar
                  date={value ? new Date(value) : new Date()}
                  color='#C4897B'
                  onChange={(selectedValue) => onChange(selectedValue)}
                />
              )}
            </MenuList>
          </Menu>
        )}
        rules={{ required: inputProps.required }}
      />

      {message && (
        <Typography
          variant='small'
          color={messageColor}
          className='font-normal font-poppins'
        >
          {message}
        </Typography>
      )}
    </>
  );
};

interface AIRichTextFieldProps {
  name: string;
  title?: string;
  setValue: any;
  getValues: any;
  message?: string;
  messageColor?: string;
  placeholder?: string;
  control?: Control<any>;
}

export const AIWithRichTextField: React.FC<AIRichTextFieldProps> = ({
  name,
  title = 'default',
  setValue,
  getValues,
  message,
  placeholder,
  control,
}) => {
  const [loading, setLoading] = useState(false);
  const [apiErrorMessage, setApiErrorMessage] = useState<string | null>(null);

  const handleChange = (content: string) => {
    setValue(name, content, { shouldValidate: true, shouldTouch: true });
  };

  async function fetchSuggestions(event: React.MouseEvent<HTMLButtonElement>) {
    event.preventDefault();
    const currentValue = getValues(name);
    setLoading(true);
    setApiErrorMessage(null);

    try {
      const response = await fetch(`/api/prediction`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: title,
          type: name,
          content: currentValue,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch AI suggestions');
      }

      const data = await response.json();
      setValue(name, data.aiResponse, {
        shouldValidate: true,
        shouldTouch: true,
      });
    } catch (error) {
      setApiErrorMessage(
        'Failed to fetch AI suggestions. Please fill in the opportunity title.'
      );
      console.error('Error fetching AI text:', error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className='relative'>
      <Controller
        control={control}
        name={name}
        defaultValue=''
        render={() => (
          <ReactQuill
            theme='snow'
            value={getValues(name) || ''}
            onChange={handleChange}
            placeholder={placeholder}
            className='transition-all duration-300 ease-in-out border border-blue-gray-200 rounded-xl focus-within:2xl focus-within:border-primary'
            modules={{
              toolbar: [
                ['bold', 'italic', 'underline', 'strike'],
                [{ list: 'ordered' }, { list: 'bullet' }],
                ['clean'],
              ],
            }}
            style={{ height: '250px', overflow: 'hidden' }}
          />
        )}
      />
      <Tooltip
        animate={{ mount: { scale: 1, y: 0 }, unmount: { scale: 0, y: 0 } }}
        className='border border-blue-gray-50 bg-white px-2 text-current shadow-black/10 text-xs'
        content='Get AI-Generated Suggestions'
        placement='top'
      >
        <button
          onClick={fetchSuggestions}
          className='absolute right-1 top-1 rounded-full p-1 animate-pulse'
        >
          {loading ? (
            <Spinner color='amber' className='h-5 w-5' />
          ) : (
            <HiSparkles color='amber' size={20} />
          )}
        </button>
      </Tooltip>

      {message && (
        <Typography variant='small' color='red' className='font-light'>
          {message}
        </Typography>
      )}

      {apiErrorMessage && (
        <Typography variant='small' color='red' className='font-light'>
          {apiErrorMessage}
        </Typography>
      )}
    </div>
  );
};

interface RichTextFieldProps {
  value: string;
  setValue: (_content: string) => void;
  label?: string;
  message?: string;
  messageColor?: string;
  placeholder?: string;
}

export const RichTextField: React.FC<RichTextFieldProps> = ({
  value,
  setValue,
  label,
  message,
  placeholder = 'Write something...',
}) => {
  return (
    <div className='w-full'>
      {label && (
        <label className='block mb-2 text-sm text-blue-gray-700 font-medium'>
          {label}
        </label>
      )}
      <ReactQuill
        theme='snow'
        value={value || ''}
        onChange={setValue}
        placeholder={placeholder}
        className='transition-all duration-300 ease-in-out border border-blue-gray-200 rounded-xl focus-within:border-primary'
        modules={{
          toolbar: [
            ['bold', 'italic', 'underline', 'strike'],
            [{ list: 'ordered' }, { list: 'bullet' }],
            ['clean'],
          ],
        }}
        style={{ height: '250px', overflow: 'hidden' }}
      />
      {message && (
        <Typography variant='small' color='red' className='font-light mt-2'>
          {message}
        </Typography>
      )}
    </div>
  );
};

export default RichTextField;
