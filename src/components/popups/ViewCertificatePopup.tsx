import Certificate from '../certificate/Certificate';
import { useGetOrgCertificateDetailsQuery } from '@/app/api/slices/org-api-slice';
import { Button, Dialog, DialogFooter } from '@material-tailwind/react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import React, { ReactElement, useEffect, useRef } from 'react';
import { useReactToPrint } from 'react-to-print';

interface VeiwCertificatePopupProps {
  title: string;
  volunteerName: string;
  opportunityTitle: string;
  buttonText: string;
  onCancel: () => void;
  onConfirm: () => void;
  icon?: ReactElement;
  setCertificatePDF: (_pdf: Blob) => void;
  certificatePDF?: Blob;
}

export const VeiwCertificatePopup = ({
  title,
  volunteerName,
  opportunityTitle,
  buttonText,
  onCancel,
  onConfirm,
  setCertificatePDF,
  certificatePDF,
}: VeiwCertificatePopupProps) => {
  const [open, setOpen] = React.useState(true);
  const certificateRef = useRef<HTMLDivElement>(null);

  const { data: certificateDetails } = useGetOrgCertificateDetailsQuery();

  const handleOpen = () => {
    setOpen(!open);
  };

  const handleGeneratePdf = useReactToPrint({
    content: () => certificateRef.current,
    print: async (printIframe) => {
      try {
        const content = printIframe.contentDocument;

        if (content) {
          const canvas = await html2canvas(
            content.getElementsByClassName('certificate')[0] as HTMLElement,
            {
              width: 1122, // A4 landscape size in pixels
              height: 640,
            }
          );

          const imgData = canvas.toDataURL('image/png');

          const imgWidth = 1122;
          const imgHeight = 640;

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

  const handleConfirm = () => {
    handleGeneratePdf();
  };

  useEffect(() => {
    if (certificatePDF) {
      onConfirm();
      setOpen(!open);
    }
  }, [certificatePDF]);

  return (
    <>
      <Dialog
        open={open}
        handler={handleOpen}
        animate={{
          mount: { scale: 1, y: 0 },
          unmount: { scale: 0.9, y: -100 },
        }}
        size='xl'
      >
        <div className=' px-12 py-7 '>
          <h1 className='text-neutrals100 text-center font-poppins font-extrabold text-3xl mb-5'>
            {title}
          </h1>
          <div className='shadow-lg p-2 bg-secondary'>
            <div className='max-h-[60vh] overflow-scroll'>
              <div
                ref={certificateRef}
                className={'certificate overflow-scroll'}
                style={{ width: '1122px', height: '640px' }} // A4 size
              >
                <Certificate
                  volunteerName={volunteerName}
                  opportunityTitle={opportunityTitle}
                  description={certificateDetails?.data.description}
                  orgLogo={certificateDetails?.data.orgLogoURl}
                  orgRepresentativeName={
                    certificateDetails?.data.orgRepresentativeName
                  }
                  orgRepresentativeTitle={
                    certificateDetails?.data.orgRepresentativeTitle
                  }
                  // orgRepSignature={certificateDetails?.data.orgRepSignatureUrl}
                  title={certificateDetails?.data.title}
                  subtitle={certificateDetails?.data.subtitle}
                />
              </div>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button
            variant='outlined'
            className={`mr-5 rounded-3xl border-teal-500  text-teal-500`}
            onClick={() => {
              onCancel();
            }}
          >
            Cancel
          </Button>
          <Button
            variant='filled'
            className={`rounded-3xl 'bg-teal-500'`}
            onClick={handleConfirm}
          >
            {buttonText}
          </Button>
        </DialogFooter>
      </Dialog>
    </>
  );
};
