import ErrorPage from '@/components/ErrorPage';
import OrganizationDetailsForVolunteers from '@/features/volunteer/ngos/OrganizationDetails';
import { fetchOrganizationDetails } from '@/services/organization-service';

async function OrgDetailPage({ params }: { params: { id: string } }) {
  try {
    const orgDetail = await fetchOrganizationDetails(params.id);

    if (!orgDetail) {
      return <ErrorPage imageName='404.svg' title='Organization not found' />;
    }

    return (
      <>
        <title>HOOPOE - Organization Detail</title>
        <OrganizationDetailsForVolunteers formData={orgDetail.data} />
      </>
    );
  } catch (error) {
    console.error('Error fetching organization:', error);
    return <ErrorPage imageName='404.svg' title='Something went wrong' />;
  }
}

export default OrgDetailPage;
