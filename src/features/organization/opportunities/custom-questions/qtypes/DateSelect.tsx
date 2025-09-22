import { BsCalendarDate } from "react-icons/bs";

const DateSelect = () => {
  return (
    <div className='w-1/2 md:px-6 px-2 flex md:flex-row flex-col md:justify-between justify-center items-center py-6'>
      <textarea 
        placeholder='Month, Day, Year'
        readOnly={true}
        className='text-base px-4 outline-none capitalize border-b bg-grey-100 focus:border-b-2 border-gray-400 pt-3 w-full focus:border-[#29A0B1]'
      />
      <BsCalendarDate size={24} className='cursor-pointer' />
    </div>
  );
};

export default DateSelect;