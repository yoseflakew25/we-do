'use client';

import { useGetCertificateByIdQuery } from '@/app/api/slices/volunteer-api-slice';
import ErrorPage from '@/components/ErrorPage';
import LoadingPage from '@/components/LoadingPage';
import Image from 'next/image';

interface ViewCertificateProps {
  id: string;
}

const ViewCertificate = ({ id }: ViewCertificateProps) => {
  const {
    data: certificateDetail,
    isFetching,
    isError,
  } = useGetCertificateByIdQuery(id);

  if (isFetching) {
    return <LoadingPage />;
  }

  if (isError || !certificateDetail?.data) {
    return <ErrorPage />;
  }

  const { certificateImageURL } = certificateDetail.data;

  return (
    <div>
      {/* Display the certificate */}
      <Image
        className='mx-auto'
        src={
          certificateImageURL ||
          'https://akilconnect.org/assets/certificate/template.png'
        }
        alt='certificate'
        width={1300}
        height={1000}
        priority
      />
    </div>
  );
};

export default ViewCertificate;
