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


interface InputAreaProps {
  name: Path<TFormValues>;
  register: UseFormRegister<TFormValues>;
  required: boolean;
  value: string; // Add a value prop
}

const InputArea: React.FC<InputAreaProps> = ({ name, register, required }) => {
    const { formData } = useFormState();

  // Get the initial value from formData based on the label
  const initialValue = formData[name] || "";
  return (
    <input
      {...register(name, { required })}
      value={initialValue} // Set the initial value
      className="w-full rounded-full border border-lightGrey py-2 px-3 text-gray-700 outline-none"
      readOnly // Make the input read-only
    />
  );
};

export default InputArea;
