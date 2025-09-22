import { FieldValues, Path, UseFormRegister } from "react-hook-form";

interface InputAreaProps<T extends FieldValues> {
  name: Path<T>;
  register: UseFormRegister<T>;
  required: boolean;
  placeHolder?: string;
  maxLength?: number;
  bottomText?: string;
}

const InputArea = <T extends Record<string, any>>({
  name,
  register,
  required,
  placeHolder,
  maxLength,
  bottomText,
}: InputAreaProps<T>) => {
  return (
    <>
      <input
        {...register(name, { required })}
        className="w-full rounded-full border border-lightGrey py-2 px-3 text-gray-700 outline-none"
        placeholder={placeHolder}
        maxLength={maxLength}
        required={true}
      />
      {bottomText && (
        <p className="text-xs font-normal text-neutrals60 ">{bottomText}</p>
      )}
    </>
  );
};

export default InputArea;