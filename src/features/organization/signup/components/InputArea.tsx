import { Path, UseFormRegister } from "react-hook-form";
import { OrgFormData } from "@/app/api/types";


interface InputAreaProps {
    name: Path<OrgFormData>
    register: UseFormRegister<OrgFormData>
    required?: boolean
    type? : string
}

const InputArea : React.FC<InputAreaProps> = ({
    name,
    register,
    required = false,
    type

}) => {

  return (
    <>
      <input
        {...register(name, {required})}
        className="w-full rounded-full border border-lightGrey py-2 px-3 text-gray-700 outline-none"
        type={type}
      />
    </>
  );
}


export default InputArea;