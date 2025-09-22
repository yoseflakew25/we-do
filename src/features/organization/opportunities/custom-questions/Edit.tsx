import add from '../../../../../public/assets/add.svg';
import del from '../../../../../public/assets/del.svg';
import Image from 'next/image';
import React from 'react';

interface EditProps {
  handleAdd: () => void;
  handleDelete: () => void;
  show?: boolean; // Add show as an optional boolean prop
  _isDeleteVisible?: boolean; // Renamed to start with underscore
}

const Edit = ({ handleAdd, handleDelete, _isDeleteVisible = true,show = true }: EditProps) => {
  if (!show) return null; // Example: hide component if show is false

  return (
    <div className='bg-gray-50/80 shadow p-4 md:p-2 ml-2 rounded-md flex md:flex-col gap-4 justify-center items-center'>
      <div
        onClick={handleAdd}
        className='md:border-b md:border-r-0 border-r pr-4 md:px-0 py-2 border-gray-400 cursor-pointer hover:text-[#29A0B1]'
      >
        <Image src={add} alt='' width={25} height={25} />
      </div>
      {!show && (
        <div
          onClick={handleDelete}
          className='cursor-pointer py-2 hover:text-red-400'
        >
          <Image src={del} alt='' width={25} height={25} />
        </div>
      )}
    </div>
  );
};

export default Edit;
