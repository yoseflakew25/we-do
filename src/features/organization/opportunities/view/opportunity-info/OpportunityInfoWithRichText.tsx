import 'react-quill/dist/quill.snow.css';

interface RichTextDisplayProps {
  title: string;
  content: string; 
}

const RichTextDisplay: React.FC<RichTextDisplayProps> = ({ title, content }) => {
  return (
    <div 
    className=" py-1 px-4 sm:py-3 mt-4"
    >
        <h3 className='font-bold font-poppins text-base sm:text-xl text-primary text-left pb-2 sm:pb-4'>
            {title}
        </h3>
      <div
        className="ql-editor" // Apply Quill's editor styles
        dangerouslySetInnerHTML={{ __html: content }}
        style={{padding:'12px 0', backgroundColor: 'white', }}
      />
    </div>
  );
};

export default RichTextDisplay;
