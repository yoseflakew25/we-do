import {
  addChoice,
  removeChoice,
  updateChoice,
} from '@/features/organization/org-side-custom-questions-slice';
import { useEffect } from 'react';
import { IoIosAddCircleOutline } from 'react-icons/io';
import { MdOutlineCheckBoxOutlineBlank } from 'react-icons/md';
import { TiDeleteOutline } from 'react-icons/ti';
import { useDispatch } from 'react-redux';

const Checkboxes = ({
  choices,
  viewOnly,
}: {
  choices: string[];
  isActiveQuestion: boolean;
  viewOnly?: boolean;
}) => {
  const dispatch = useDispatch();
  const handleAddChoice = () => {
    dispatch(addChoice());
  };

  const handleDeleteChoice = (index: number) => {
    dispatch(removeChoice({ choiceIndex: index }));
  };

  const handleChoiceChange = (index: number, value: string) => {
    dispatch(updateChoice({ choiceIndex: index, value }));
  };
  useEffect(() => {
    choices.length == 0 && handleAddChoice();
  }, []);

  return (
    <div>
      {choices.map((choice, choiceIndex) => (
        <div
          className='w-full md:px-6 px-2 flex md:flex-row flex-col md:justify-between justify-center items-center gap-4 py-6'
          key={choiceIndex}
        >
          <MdOutlineCheckBoxOutlineBlank
            size={40}
            className='border-gray-600'
            key={choiceIndex}
          />

          <input
            type='text'
            key={choiceIndex}
            value={choice}
            onChange={(e) => handleChoiceChange(choiceIndex, e.target.value)}
            placeholder={`Option ${choiceIndex + 1}`}
            required
            readOnly={viewOnly}
            className='text-base px-4 outline-none capitalize border-b bg-gray-100 focus:border-b-2 border-gray-400 pt-3 pb-2 w-full focus:border-[#29A0B1]'
          />

          {!viewOnly && (
            <div>
              {choices.length > 1 && (
                <TiDeleteOutline
                  size={34}
                  className='cursor-pointer'
                  onClick={() => handleDeleteChoice(choiceIndex)}
                />
              )}
              <IoIosAddCircleOutline
                size={34}
                className='cursor-pointer'
                onClick={() => handleAddChoice()}
              />
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default Checkboxes;
