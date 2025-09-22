import {
  addChoice,
  removeChoice,
  updateChoice,
} from '@/features/organization/org-side-custom-questions-slice';
import { IoIosAddCircleOutline } from 'react-icons/io';
import { TiDeleteOutline } from 'react-icons/ti';
import { useDispatch } from 'react-redux';

const Choices = ({
  choice,
  isActiveChoice,
  index,
}: {
  choice: string;
  isActiveChoice: boolean;
  index: number;
}) => {
  // const { choices } = question;
  const dispatch = useDispatch();
  const handleAddChoice = () => {
    dispatch(addChoice());
  };

  const handleDeleteChoice = (index: number) => {
    dispatch(removeChoice({ choiceIndex: index }));
  };
  // const handleChoiceClick = (index: number) => {
  //   dispatch(setActiveChoiceIndex());
  // };

  const handleChoiceChange = (index: number, value: string) => {
    dispatch(updateChoice({ choiceIndex: index, value }));
  };

  return (
    <div className='w-full md:px-6 px-2 flex md:flex-row flex-col md:justify-between justify-center items-center gap-8 py-6'>
      <input
        key={index}
        type='text'
        value={choice}
        onChange={(e) => handleChoiceChange(0, e.target.value)}
        placeholder='Option 1'
        required
        className='text-base px-4 outline-none capitalize border-b bg-gray-100 focus:border-b-2 border-gray-400 pt-3 pb-2 w-full focus:border-[#29A0B1]'
      />
      {isActiveChoice && (
        <>
          <TiDeleteOutline
            size={34}
            className='cursor-pointer'
            onClick={() => handleDeleteChoice(0)}
          />
          <IoIosAddCircleOutline
            size={34}
            className='cursor-pointer'
            onClick={() => handleAddChoice()}
          />
        </>
      )}
    </div>
  );
};

export default Choices;
