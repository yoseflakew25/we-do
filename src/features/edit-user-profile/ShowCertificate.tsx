import { useGetCertificatesQuery } from '@/app/api/slices/volunteer-api-slice';
import { Card, Typography } from '@material-tailwind/react';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { FaExternalLinkAlt } from 'react-icons/fa';
import { PiCertificateThin } from 'react-icons/pi';

export function ShowCertificate() {
  const t = useTranslations('EditProfile');
  const { data } = useGetCertificatesQuery();
  const certificateList = data?.data;

  return (
    <Card shadow={false} className={`flex p-5 flex-col `}>
      <Typography className='font-inherit font-semibold text-lg text-primary capitalize mb-2'>
        {t('Certificate')}
      </Typography>
      {certificateList && certificateList.length > 0 ? (
        certificateList.map((certificate, index) => (
          <div key={index} className='flex items-center gap-2'>
            <PiCertificateThin size={35} />
            <Link
              href={`/view-certificate/${certificate.id}`}
              rel='noopener noreferrer'
              className='flex flex-row items-center space-x-2 cursor-pointer w-4/5'
            >
              <Typography
                className='text-sm text-secondary font-poppins font-normal truncate'
                title={certificate.eventName}
              >
                {certificate.eventName} {t('Certificate of Completion')}
              </Typography>
              <FaExternalLinkAlt size={10} color='#C4897B' />
            </Link>
          </div>
        ))
      ) : (
        <Typography className='font-inherit flex justify-center items-center text-sm text-[#7A7A84]'>
          {t('No Certificate Received')}
        </Typography>
      )}
    </Card>
  );
}
