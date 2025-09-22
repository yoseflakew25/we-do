import CertificateTemplate from './CertificateTemplate';
import { PDFViewer } from '@react-pdf/renderer';
import React from 'react';

interface CertificatePreviewProps {
  volunteerName: string;
  opportunityTitle: string;
  orgLogo: string;
  orgRepresentativeName: string;
}

const CertificatePreview: React.FC<CertificatePreviewProps> = ({
  volunteerName,
  opportunityTitle,
  orgLogo,
  orgRepresentativeName,
}) => {
  return (
    <div>
      <PDFViewer width='100%' height={window.innerHeight}>
        <CertificateTemplate
          volunteerName={volunteerName}
          opportunityTitle={opportunityTitle}
          orgLogo={orgLogo}
          orgRepresentativeName={orgRepresentativeName}
        />
      </PDFViewer>
    </div>
  );
};

export default CertificatePreview;
