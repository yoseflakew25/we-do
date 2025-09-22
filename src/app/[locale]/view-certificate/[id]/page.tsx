import ViewCertificate from '@/components/certificate/ViewCertificate';
import { Metadata } from 'next';

// Server-side metadata generation (SSR)
export async function generateMetadata({
  params,
}: {
  params: { id: string };
}): Promise<Metadata> {
  const id = params.id;

  const certificateDetail = await fetch(
    `${
      process.env.NEXT_PUBLIC_API_URL ||
      'https://akil-backend-ij7jnmwh2q-zf.a.run.app'
    }/certificate/${id}`
  ).then((response) => response.json());

  return {
    metadataBase: new URL('https://akilconnect.org/'),
    openGraph: {
      title: `Certificate issued by ${certificateDetail?.data?.orgName}`,
      description: `This certificate is proudly presented by ${certificateDetail?.data?.orgName} in recognition of valuable contributions as a ${certificateDetail?.data?.eventName} on ${certificateDetail?.data?.dateOfIssue}.`,
      url: `https://akilconnect.org/view-certificate/${certificateDetail?.data?.id}`,
      images: [
        {
          url:
            certificateDetail?.data?.certificateImageURL ||
            'https://akilconnect.org/assets/certificate/template.png',
        },
      ],
    },
  };
}

// Page component that renders the certificate view
const CertificatePage = ({ params }: { params: { id: string } }) => {
  return <ViewCertificate id={params.id} />;
};

export default CertificatePage;
