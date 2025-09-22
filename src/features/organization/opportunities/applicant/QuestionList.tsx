import React from "react";

interface QuestionListProps {
  question: string;
  answer: string;
  titleStyle: string;
}

const QuestionList: React.FC<QuestionListProps> = ({ question, answer, titleStyle }) => {
  return (
    <div className="flex">
      <div className="basis-1/3">
        <p className={titleStyle}>Question</p>
        <p className="text-neutrals60 font-normal text-lg">
          {question}
        </p>
      </div>
      <div className="basis-2/3">
        <p className="text-neutrals100 font-medium text-base border-2 border-neutral20 rounded-lg p-2">
          {answer}
        </p>
      </div>
    </div>
  );
};

export default QuestionList;