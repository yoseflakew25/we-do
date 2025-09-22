import { Typography } from '@material-tailwind/react';
import {
  HeartHandshake,
  GraduationCap,
  Leaf,
  Globe,
  Users,
  HandHeart,
  ShieldCheck,
  BookOpen,
  HandHelping,
} from 'lucide-react';
import Link from 'next/link';
import { useMemo } from 'react';
import { IoIosArrowRoundForward } from 'react-icons/io';

interface OpportunitiesCardProps {
  title: string;
  count: number;
  categoryKey?: string;
}

const iconForCategory = (categoryKey?: string) => {
  const key = (categoryKey || '').toLowerCase();
  const map: Record<string, React.ReactNode> = {
    education: <GraduationCap size={22} className='text-primary' />,
    environment: <Leaf size={22} className='text-primary' />,
    health: <HandHeart size={22} className='text-primary' />,
    healthcare: <HandHeart size={22} className='text-primary' />,
    community: <Users size={22} className='text-primary' />,
    social: <HeartHandshake size={22} className='text-primary' />,
    governance: <ShieldCheck size={22} className='text-primary' />,
    literacy: <BookOpen size={22} className='text-primary' />,
    global: <Globe size={22} className='text-primary' />,
    support: <HandHelping size={22} className='text-primary' />,
  };
  return map[key] ?? <Users size={22} className='text-primary' />;
};

const OpportunitiesCard: React.FC<OpportunitiesCardProps> = ({
  title,
  count,
  categoryKey,
}) => {
  const opportunityText = useMemo(() => {
    const n = Math.max(0, Math.floor(count ?? 0));
    return `${n} ${n === 1 ? 'Opportunity' : 'Opportunities'}`;
  }, [count]);

  return (
    <Link
      href={{
        pathname: '/talent/opportunities',
        query: { categories: categoryKey ?? title },
      }}
      aria-label={`Browse ${title} opportunities`}
      className='
        group relative block h-full w-full
        rounded-2xl border border-white/30 bg-white/70 backdrop-blur-md
        dark:bg-gray-900/40 dark:border-white/10
        shadow-sm transition-all duration-300 hover:shadow-md
        hover:-translate-y-0.5 focus-visible:-translate-y-0.5 focus:outline-none
      '
    >
      <div className='flex h-full w-full items-center justify-between gap-4 p-5'>
        <div className='flex items-start gap-4'>
          <div
            className='
              flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl
              bg-primary/10 ring-1 ring-primary/20
            '
          >
            {iconForCategory(categoryKey)}
          </div>
          <div className='flex flex-col'>
            <Typography className='font-poppins text-[#3F3F46] dark:text-gray-100 font-medium text-base sm:text-lg leading-[30px]'>
              {title}
            </Typography>
            <Typography className='font-poppins font-normal text-[#A1A1AA] dark:text-gray-400 text-xs sm:text-sm leading-[27px]'>
              {opportunityText}
            </Typography>
          </div>
        </div>

        <div
          className='
            relative inline-flex h-8 w-8 items-center justify-center overflow-hidden
            rounded-full bg-gray-200/80 dark:bg-gray-800/80 transition-colors
            group-hover:bg-primary group-focus-visible:bg-primary
          '
        >
          <IoIosArrowRoundForward
            size={22}
            className='
              text-gray-500 transition-transform duration-300
              group-hover:translate-x-0.5 group-hover:text-white
              group-focus-visible:translate-x-0.5 group-focus-visible:text-white
            '
          />
        </div>
      </div>
    </Link>
  );
};

export default OpportunitiesCard;
