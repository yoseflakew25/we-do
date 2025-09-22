import React from "react";
import { Path, UseFormRegister } from "react-hook-form";
import { useFormState } from "../OrgSignupFormContext";



type TFormValues = {
    description: string;
    vission: string;
    mission: string;
    futurePlan: string;
    website: string;
    linkedIn: string;
    instagram: string;
    facebook: string;
    telegram: string;
    whatsapp: string;
  };

  

interface TextAreaProps {
  label: Path<TFormValues>;
  register: UseFormRegister<TFormValues>;
  required: boolean;
}

const TextArea: React.FC<TextAreaProps> = ({ label }) => {
  const { formData } = useFormState();

  // Get the initial value from formData based on the label
  const initialValue = formData[label] || "";

  return (
    <div className="space-y-2 relative">
      <textarea
        autoFocus
        rows={4}
        value={initialValue}
        id={label}
        className="w-full rounded-[12px] border border-lightGrey py-2 px-3 text-gray-700 outline-none"
        readOnly  // Make the textarea read-only
      />
    </div>
  );
};

export default TextArea;
