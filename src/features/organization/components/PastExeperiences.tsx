import { titleStyle } from '../opportunities/applicant/ApplicantDetail';
import OrgReviewCard from './OrgReviewCard';
import { useGetPastExperiencesQuery } from '@/app/api/slices/volunteer-api-slice';
import ErrorPage from '@/components/ErrorPage';
import { Select, Option, Typography, Spinner } from '@material-tailwind/react';
import React, { useState } from 'react';

interface PastExperiencesProps {
  id: string;
  status?: string;
  applicantName: string;
}

const PastExperiences: React.FC<PastExperiencesProps> = ({
  id,
  applicantName,
}) => {
  const [status, setStatus] = useState<string>('');

  let {
    data: pastExperiencesData,
    isFetching: isFetchingPastExperiences,
    isError: isExperienceError,
    refetch,
  } = useGetPastExperiencesQuery({ userId: id, status });

  const handleStatusChange = (value: string) => {
    setStatus(value);
  };

  if (isFetchingPastExperiences) {
    return (
      <div
        className={`bg-primary/10 w-full h-full flex flex-col items-center justify-center `}
      >
        <Spinner className='h-10 w-10' color='amber' />
      </div>
    );
  }

  if (isExperienceError) {
    return <ErrorPage />;
  }

  return (
    <div className='flex flex-col'>
      <div className='flex justify-between'>
        <div>
          <p className={`${titleStyle} capitalize font-epilogue`}>
            Work Experience
          </p>
        </div>

        <div className='w-fit z-50'>
          <Select
            value={status}
            onChange={(value) => handleStatusChange(value as string)}
            placeholder='Select Status'
          >
            <Option value=''>All</Option>
            <Option value='hired'>Hired</Option>
            <Option value='certified'>Certified</Option>
          </Select>
        </div>
      </div>
      {pastExperiencesData?.data?.length ? (
        <div className='overflow-y-scroll h-screen'>
          {pastExperiencesData.data.map((experience, index) => (
            <OrgReviewCard
              key={index}
              logoUrl={experience.reviewer.logo_url}
              orgName={experience.reviewer.orgName}
              rating={experience.rating}
              review={experience.comment}
              reviewId={experience.reviewID}
              startDate={experience.startedAt}
              endDate={experience.completedAt}
              title={experience.event.title}
              applicantName={applicantName}
              refetchExeperiences={refetch}
            />
          ))}
        </div>
      ) : (
        <div className='mx-auto my-auto'>
          <Typography variant='paragraph' className='text-neutrals100 py-6 '>
            No experience yet - under this category
          </Typography>
        </div>
      )}
    </div>
  );
};

export default PastExperiences;
