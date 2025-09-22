interface TagProps {
  text: string;
  textColor: string;
  smallBorderRadius?: boolean;
  fullBorderRadius?: boolean;
  onClick?: () => void;
}

const Tag: React.FC<TagProps> = ({
  text,
  textColor,
  smallBorderRadius = false,
  onClick,
  fullBorderRadius = {},
}) => {
  const backgroundColor = `${textColor}15`; // Adding alpha channel for opacity

  return (
    <div
      className={`flex items-center font-poppins font-normal justify-center px-4 py-2 ${
        smallBorderRadius ? 'rounded-md' : null
      } ${fullBorderRadius ? 'rounded-full' : null} rounded-3xl`}
      style={{ backgroundColor }}
      onClick={onClick}
    >
      <p style={{ color: textColor }} className='text-sm'>
        {text}
      </p>
    </div>
  );
};

export default Tag;
