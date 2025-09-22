import { Path, UseFormRegister, UseFormWatch, useForm } from "react-hook-form";
import { OrgFormData } from "@/app/api/types";


interface TextAreaProps {
  // initialValue: string,
  label: Path<OrgFormData>;
  register: UseFormRegister<OrgFormData>;
  required?: boolean;
  watch: UseFormWatch<OrgFormData>;
}

const TextArea: React.FC<TextAreaProps> = ({ label, register, required=false,  }) => {
  const { watch } = useForm();

  // const watchedValue = watch(label);


  
  // const [value, setValue] = useState<string>(initialValue);

  // const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
  //   const newValue = e.target.value;
  //   if (newValue.length <= 500) {
  //     setValue(newValue);
  //   }
  // };

  // useEffect(() => {
  //   setValue(initialValue);
  //   handleInputChange;
  // }, [initialValue]);


  

  return (
    <div className="space-y-2 relative">
      <textarea
        autoFocus
        rows={4}
        // value={value}
        id={label}
        {...register(label, { required })}
        className="w-full rounded-[12px] border border-lightGrey py-2 px-3 text-gray-700 outline-none"
        // className="w-full p-2 border rounded-lg mb-4"
        
        // onChange={handleInputChange}
      />
      <div className="flex items-end text-gray-400 absolute bottom-0 right-0 mt-10">
        {watch(label)?.length || 5}/{500}
      </div>
    </div>
  );
};

export default TextArea;
