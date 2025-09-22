import { FieldValues, Path, UseFormRegister } from "react-hook-form";
import { useState } from "react";

interface TextAreaProps<T extends FieldValues> {
  label: Path<T>;
  register: UseFormRegister<T>;
  required: boolean;
  placeHolder?: string;
  maxLength?: number;
  bottomText?: string;
  // useFormState: () => { formData: T }; // Pass the useFormState function as a prop
}

const TextArea = <T extends Record<string, any>>({
  label,
  register,
  required,
  // useFormState,
  placeHolder,
  maxLength,
  bottomText
}: TextAreaProps<T>) => {
  // const { } = useFormState(); // Call the useFormState function

  const [value, setValue] = useState<string>("");

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    if (newValue.length <= 500) {
      setValue(newValue);
    }
  };

  return (
    <div className=" ">
      <textarea
        autoFocus
        rows={4}
        value={value}
        id={label}
        {...register(label, { required })}
        className="w-full rounded-[12px] border border-lightGrey px-3 text-gray-700 outline-none"
        placeholder={placeHolder}
        maxLength={maxLength}
        required={true}
        onChange={handleInputChange}
      />
      <div className="flex justify-between items-end text-xs  font-normal text-neutrals60">
      {bottomText && (
        <p className="">{bottomText}</p>
      )}
      {value.length || 0}/{500}
      </div>
    </div>
  );
};

export default TextArea;