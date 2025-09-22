import { FaLink } from "react-icons/fa";

const UploadLink = () => {


  return (
    <div className='w-1/2 md:px-6 px-2 flex md:flex-row flex-col md:justify-between justify-center items-center gap-4 py-6'>
      <input
        placeholder="Link"
        required
        readOnly={true}
        className='text-base px-4 outline-none capitalize pb-2 border-b bg-gray-100 focus:border-b-2 border-gray-400 pt-3 w-full focus:border-[#29A0B1]'
      />
      <FaLink size={24} className='cursor-pointer text-gray-400' />
    </div>
  );
};

export default UploadLink;