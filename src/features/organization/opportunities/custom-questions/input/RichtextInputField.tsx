'use client';

import "react-quill/dist/quill.bubble.css";
import dynamic from 'next/dynamic';
import 'react-quill/dist/quill.snow.css';

const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });

const QuestionInput = ({
  question,
  handleChange,
  viewOnly,
}: {
  question: string;
  handleChange: (_value: string) => void;
  viewOnly?: boolean;
}) => {

  const modules = {
    toolbar: {
      container: [
        ["bold", "italic", "underline", "strike", "blockquote"],
        [ { list: "ordered" }, { list: "bullet" },  { indent: "-1" }, { indent: "+1" }],
      ],
    }
  };

  return (
    <div className='w-full'>
      <ReactQuill
        value={question}
        onChange={handleChange}
        readOnly={!viewOnly}
        placeholder='Question'
        theme='snow'
        className={`text-base bg-grey-100 border-b focus:border-b-2 border-gray-400 w-full ${
          viewOnly ? 'focus:border-primary' : 'focus:border-[#29A0B1]'
        }`}
        modules={modules}
      />
    </div>
  );
};

export default QuestionInput;
