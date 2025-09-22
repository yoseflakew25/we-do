interface StatCardProps {
  label: string;
  value: number;
  textColor: string;
  smallBorderRadius?: boolean;
  fullBorderRadius?: boolean;
}

const StatCard: React.FC<StatCardProps> = ({
  label,
  value,
  textColor,
  smallBorderRadius = false,
  fullBorderRadius = false,
}) => {
  const backgroundColor = `#C4897B15`; // Adding alpha channel for opacity

  return (
    <div
      className={`flex flex-col items-center justify-center px-4 py-2 ${
        smallBorderRadius ? 'rounded-md' : null
      } ${fullBorderRadius ? 'rounded-full' : null} rounded-3xl shadow-md`}
      style={{ backgroundColor }}
    >
      <p style={{ color: textColor }} className='text-lg font-semibold mb-2'>
        {value}
      </p>
      <p style={{ color: textColor }} className='text-sm'>
        {label}
      </p>
    </div>
  );
};

export default StatCard;
