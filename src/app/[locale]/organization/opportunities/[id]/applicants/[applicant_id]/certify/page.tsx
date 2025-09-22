'use client';

import { useGetOrgCertificateDetailsQuery } from '@/app/api/slices/org-api-slice';
import {
  useCertifyVolunteerMutation,
  useGetApplicantDetailQuery,
} from '@/app/api/slices/volunteer-api-slice';
import { CertificateData } from '@/app/api/types';
import Certificate from '@/components/certificate/Certificate';
import EditCertificate from '@/components/certificate/EditCertificate';
import PageTitle from '@/features/organization/components/PageTitle';
import { Button, Spinner } from '@material-tailwind/react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { Edit } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React, { useEffect, useRef, useState } from 'react';
import { useReactToPrint } from 'react-to-print';
import { toast } from 'react-toastify';

interface pageProps {
  params: { opportunity_id: string; applicant_id: string };
}

const Certify = ({ params }: pageProps) => {
  const certificateRef = useRef<HTMLDivElement>(null);
  const { data: certificateDetails } = useGetOrgCertificateDetailsQuery();
  const [certifyVolunteer] = useCertifyVolunteerMutation();
  const { data: applicantDetail } = useGetApplicantDetailQuery(
    params.applicant_id
  );
  const [loading, setLoading] = useState(false);
  const [_CertificateData, setCertificateData] = useState<FormData>(
    new FormData()
  );
  const [editCertificate, setEditCertificate] = useState(false);
  const [certificatePDF, setCertificatePDF] = useState<Blob>();
  const [certificateImage, setCertificateImage] = useState<Blob>();
  const [certificateDetail, setCertificateDetail] = useState<CertificateData>({
    title: '',
    subtitle: '',
    description: '',
    orgLogoURl: '',
    orgRepresentativeName: '',
    orgRepresentativeTitle: '',
    volunteerName: '',
    opportunityTitle: '',
    date: new Date(),
  });
  const router = useRouter();
  const isInitialized = useRef(false); // Track if the details have already been populated

  useEffect(() => {
    if (!isInitialized.current && applicantDetail && certificateDetails) {
      // Set certificateDetail only once, when the component loads
      setCertificateDetail({
        title: certificateDetails?.data.title || '',
        subtitle: certificateDetails?.data.subtitle || '',
        description: certificateDetails?.data.description || '',
        orgLogoURl: certificateDetails?.data.orgLogoURl || '',
        orgRepresentativeName:
          certificateDetails?.data.orgRepresentativeName || '',
        orgRepresentativeTitle:
          certificateDetails?.data.orgRepresentativeTitle || '',
        volunteerName: applicantDetail.data.name,
        opportunityTitle: applicantDetail.data.eventTitle,
        date: new Date(),
      });
      // Mark as initialized
      isInitialized.current = true;
    }
  }, [applicantDetail, certificateDetails]);

  const handleGeneratePdf = useReactToPrint({
    content: () => certificateRef.current,
    print: async (printIframe) => {
      try {
        const content = printIframe.contentDocument;

        if (content) {
          const canvas = await html2canvas(
            content.getElementsByClassName('certificate')[0] as HTMLElement,
            {
              width: 780, // A4 landscape size in pixels
              height: 560,
            }
          );

          const imgData = canvas.toDataURL('image/png');
          // Convert base64 to Blob
          const byteString = atob(imgData.split(',')[1]);
          const mimeString = imgData.split(',')[0].split(':')[1].split(';')[0];
          const ab = new ArrayBuffer(byteString.length);
          const ia = new Uint8Array(ab);

          for (let i = 0; i < byteString.length; i++) {
            ia[i] = byteString.charCodeAt(i);
          }

          const blob = new Blob([ab], { type: mimeString });
          setCertificateImage(blob); // Set the Blob instead of a string

          //get the width and height from the canvas and draw image

          const imgWidth = 780;
          const imgHeight = 560;

          const pdf = new jsPDF({
            orientation: 'landscape', // Set to landscape
            unit: 'px',
            format: [imgWidth, imgHeight],
            compress: true,
          });

          pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);

          // save the PDF as a Blob object
          const pdfBlob = pdf.output('blob');
          setCertificatePDF(pdfBlob);
        }
      } catch (error) {
        console.error('Error: on generate pdf', error);
      }
    },
  });

  const handleCertify = async () => {
    try {
      await certifyVolunteer({
        applicationID: params.applicant_id,
        eventName: applicantDetail?.data.eventTitle || '',
        orgID: applicantDetail?.data.orgID || '',
        file: certificatePDF || null,
        photo: certificateImage || null,
        dateOfIssue: new Date(Date.now()).toJSON(),
      }).unwrap();
      setLoading(false);
      toast.success('Certificate issued successfully!', {
        theme: 'light',
      });
      router.back();
    } catch (error) {
      console.error('Error: on accept Applicant', error);
    }

    router.refresh();
  };

  const handleConfirm = () => {
    setLoading(true);
    handleGeneratePdf();
  };

  useEffect(() => {
    if (certificatePDF && certificateImage) {
      handleCertify();
    }
  }, [certificatePDF]);

  return (
    <div className='p-7'>
      <PageTitle
        title='
Certification'
        blockRightComponent
        onClick={() => router.back()}
      />

      <div className='border border-gray-400 rounded-2xl shadow-lg p-5 lg:mx-10'>
        {editCertificate ? (
          <>
            <EditCertificate
              opportunityTitle={certificateDetail.opportunityTitle || ''}
              volunteerName={certificateDetail.volunteerName}
              description={certificateDetail.description || ''}
              orgLogo={certificateDetail.orgLogoURl}
              orgRepresentativeName={certificateDetail.orgRepresentativeName}
              orgRepresentativeTitle={
                certificateDetail.orgRepresentativeTitle || ''
              }
              title={certificateDetail.title || ''}
              subtitle={certificateDetail.subtitle || ''}
              date={certificateDetail.date}
              setFlag={setEditCertificate}
              onSave={setCertificateData}
              setCertificateDetail={setCertificateDetail}
            />
          </>
        ) : (
          <div className='flex flex-col justify-center'>
            <Button
              variant='text'
              size='sm'
              color='amber'
              className='text-bgPrimary flex gap-2 self-end items-center justify-center capitalize'
              onClick={() => setEditCertificate(true)}
            >
              <Edit className='m-auto' />
              <p>Edit Certificate</p>
            </Button>
            <div className='overflow-scroll self-center'>
              <div
                ref={certificateRef}
                style={{ width: '780px', height: '560px' }}
                className='certificate py-3.5 px-4'
              >
                <Certificate
                  volunteerName={certificateDetail.volunteerName}
                  opportunityTitle={certificateDetail.opportunityTitle}
                  description={certificateDetail.description}
                  orgLogo={certificateDetail.orgLogoURl}
                  orgRepresentativeName={
                    certificateDetail.orgRepresentativeName
                  }
                  orgRepresentativeTitle={
                    certificateDetail.orgRepresentativeTitle
                  }
                  title={certificateDetail.title}
                  subtitle={certificateDetail.subtitle}
                  date={certificateDetail.date}
                />
              </div>
            </div>
          </div>
        )}
        {!editCertificate && (
          <div className='flex justify-end'>
            <Button
              variant='outlined'
              className={`mr-5 rounded-3xl border-red-400 text-red-400`}
              onClick={() => {
                router.back();
              }}
            >
              Cancel
            </Button>
            <Button
              variant='filled'
              color='amber'
              className='rounded-3xl'
              onClick={handleConfirm}
            >
              {loading ? <Spinner /> : 'Certify'}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Certify;
