import { useState, useEffect } from 'react';
import OpportunitiesCard from './components/OpportunitiesCard';
import Paragraph from './components/ui/Paragraph';
import { TypewriterEffectSmooth } from './components/ui/TypewriterEffect';
import { useGetAllCategoriesCountQuery } from '@/app/api/slices/opportunity-api-slice';
import LoadingPage from '@/components/LoadingPage';
import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const formatCategoryLabel = (key: string): string => {
  if (!key) return '';
  const spaced = key.replace(/[-_]/g, ' ');
  return spaced
    .replace(/\s+/g, ' ')
    .trim()
    .split(' ')
    .map((w) => (w ? w.charAt(0).toUpperCase() + w.slice(1) : ''))
    .join(' ');
};

const BrowseOpportunity = () => {
  const { data, isFetching } = useGetAllCategoriesCountQuery();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [itemsPerView, setItemsPerView] = useState(4);
  const [isAnimating, setIsAnimating] = useState(false);


  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) setItemsPerView(1);
      else if (window.innerWidth < 768) setItemsPerView(2);
      else if (window.innerWidth < 1024) setItemsPerView(3);
      else setItemsPerView(4);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (isFetching) {
    return <LoadingPage />;
  }

  
  const words = [
    {
      text: "Recent",
    },
    {
      text: "Opportunities",
      className: 'text-[#C4897B]',
    },
  ];

  const Categories = data?.data;
  const categoryEntries = Object.entries(Categories || {});
  const maxIndex = Math.max(0, categoryEntries.length - itemsPerView);

  const nextSlide = () => {
    if (isAnimating || currentIndex >= maxIndex) return;
    setIsAnimating(true);
    setCurrentIndex(prev => Math.min(prev + 1, maxIndex));
    setTimeout(() => setIsAnimating(false), 300);
  };

  const prevSlide = () => {
    if (isAnimating || currentIndex <= 0) return;
    setIsAnimating(true);
    setCurrentIndex(prev => Math.max(prev - 1, 0));
    setTimeout(() => setIsAnimating(false), 300);
  };

  const goToSlide = (index: number) => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentIndex(Math.max(0, Math.min(index, maxIndex)));
    setTimeout(() => setIsAnimating(false), 300);
  };

  return (
    <section className="relative mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center flex flex-col items-center justify-between gap-3 mb-12">
        <div className='flex mx-auto flex-col items-center justify  -between'>
                  <TypewriterEffectSmooth words={words} />
                  <Paragraph text1="Discover opportunities by category and find where you can make an impact." />
                </div>
      </div>

      <div className="relative">
        {/* Navigation Arrows */}
        <button
          onClick={prevSlide}
          disabled={currentIndex === 0}
          className={`absolute left-0 top-1/2 -translate-y-1/2 -translate-x-6 z-10 
            p-3 rounded-full bg-white shadow-lg border border-gray-100 
            transition-all duration-200 hover:bg-gray-50 focus:outline-none
            ${currentIndex === 0 ? 'opacity-50 cursor-not-allowed' : 'opacity-100 hover:shadow-xl'}`}
          aria-label="Previous opportunities"
        >
          <ChevronLeft className="w-5 h-5 text-gray-700" />
        </button>

        <button
          onClick={nextSlide}
          disabled={currentIndex >= maxIndex}
          className={`absolute right-0 top-1/2 -translate-y-1/2 translate-x-6 z-10 
            p-3 rounded-full bg-white shadow-lg border border-gray-100 
            transition-all duration-200 hover:bg-gray-50 focus:outline-none
            ${currentIndex >= maxIndex ? 'opacity-50 cursor-not-allowed' : 'opacity-100 hover:shadow-xl'}`}
          aria-label="Next opportunities"
        >
          <ChevronRight className="w-5 h-5 text-gray-700" />
        </button>

        {/* Carousel Container */}
        <div className="overflow-hidden">
          <div 
            className="flex transition-transform duration-300 ease-in-out gap-5"
            style={{ transform: `translateX(-${currentIndex * (100 / itemsPerView)}%)` }}
          >
            {categoryEntries.map(([categoryKey, count], index) => (
              <div 
                key={index} 
                className="flex-shrink-0 transition-all duration-300"
                style={{ width: `${100 / itemsPerView}%` }}
              >
                <OpportunitiesCard
                  title={formatCategoryLabel(categoryKey)}
                  count={count as number}
                  categoryKey={categoryKey}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Dots Indicator */}
        {maxIndex > 0 && (
          <div className="flex justify-center mt-8 space-x-2">
            {Array.from({ length: maxIndex + 1 }).map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  index === currentIndex ? 'bg-primary w-6' : 'bg-gray-300'
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        )}
      </div>

      <div className="mt-12 flex justify-center">
        <Link
          href="/talent/opportunities"
          className="
            inline-flex items-center justify-center rounded-full bg-primary px-8 py-3
            text-white shadow-sm transition-all duration-300 hover:bg-primary/90
            hover:shadow-md focus:outline-none focus:ring-2 focus:ring-primary/50
            font-medium text-sm
          "
        >
          Explore all opportunities
        </Link>
      </div>
    </section>
  );
};

export default BrowseOpportunity;